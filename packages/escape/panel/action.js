// panel/index.js, this filename needs to match the one registered in package.json
var Fs = require('fs');
const getMethods = (obj) => {
  let properties = new Set()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
  return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}
Editor.Panel.extend({

  // css style for panel
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
    .input_box{font-size:14px;width:100%;background-color: rgba(0,0,0,0);color:rgb(255,153,0,255);border:0px;height:30px"}
  `,

  // html template for panel
  template: 
  `
  <br/>
  <ui-section folded="true">
    <div class="header">Create</div>
    <div class="layout horizontal">
    <ui-input id="jsonFile" class="flex-1" ></ui-input>
    <ui-button @confirm="onCreateAction">Create actions</ui-button>
    <ui-button @confirm="onCreateGroup">Create group actions</ui-button>
  </div>
</ui-section>

<br/>
      <div class="layout horizontal">
        <ui-asset @change="onReload" id="jsonAsset" class="flex-1" style="width:100px;"  type="json" droppable="cc.JsonAsset"></ui-asset>
        <ui-button @confirm="onReload">Reload</ui-button>
        <ui-button @confirm="onSave">Save</ui-button>
      </div>
      <div v-if="type === 'Single'">
      This is an actions file for normal ECEvent.
      </div>
      <div v-if="type === 'Array'">
      This is a group actions file for ECMutiTouchEvent.
      </div>
    <hr />
    <div style="height:60%;overflow:auto;" v-if="type === 'Single'">
      <div v-for="(index, action) in actions">
      ` +　Fs.readFileSync(Editor.url('packages://escape/panel/action.html', 'utf8'))　+　`
      </div>
    </div>
    <div style="height:70%;overflow:auto;" v-if="type === 'Array'">
      <div v-for="(group, actions) in actions">
        <div v-for="(index, action) in actions">`
        +
        Fs.readFileSync(Editor.url('packages://escape/panel/action.html', 'utf8'))
        + `
        </div>
        <ui-button @confirm="onRemoveGroup($event,group)">Remove</ui-button>
        <ui-button @confirm="onAddGroup($event,group)">Add</ui-button>
        <ui-button @confirm="onUpGroup($event,group)">Up</ui-button>
        <ui-button @confirm="onDownGroup($event,group)">Down</ui-button>
      <hr/>
      </div>
    </div>`
  ,

  // element and variable binding
  $: {
    jsonAsset:"#jsonAsset",
    jsonFile:"#jsonFile",
  },

  // method executed when template and styles are successfully loaded and initialized
  ready () {
      let self = this;
      new window.Vue({
        el: this.shadowRoot,
        data: {
          actions: [],
          type:"",
          file:"",
          asset:"",
          strings: JSON.parse(Fs.readFileSync(Editor.url('db://assets/resources/i18n/Japanese.json', 'utf8')))
        },
        methods: {
          splitJoin(theText){
            return theText.split(',');
          },
          getString(key)
          {
            if(!this.strings[key])
            {
              return "There is no key: [" + key + "]";
            }
            return this.strings[key];
          },
          onReload(efent)
          {
            event.stopPropagation();
            Editor.assetdb.queryUrlByUuid(self.$jsonAsset.value,function(err, path)
            {
              this.actions = JSON.parse(Fs.readFileSync(Editor.url(path, 'utf8')));
              if(this.actions[0].Type !== undefined)
              {
                this.type = "Single";
              }
              else
              {
                this.type = "Array";
              }
              this.file = Editor.url(path, 'utf8');
              this.asset = path;
            }.bind(this)
            );
  
          },
          onSave ( event ) {
            event.stopPropagation();

            if(!this.file)
            {
              alert("Plese drop a action file in to field beside.");
              return;
            }
   
            if(this.type == "Array")
            {
              for(let a=0;a<this.actions.length;a++)
              {
                for(let i=0;i<this.actions[a].length;i++)
                {
                  if(!this.actions[a][i].Type)
                  {
                    alert("Error index " + (a + 1)+ "." +(i + 1)+ " is null");
                    return;
                  }
                }
              }
            }
            else
            {
              for(let i=0;i<this.actions.length;i++)
              {
                if(!this.actions[i].Type)
                {
                  alert("Error index " +(i + 1)+ " is null");
                  return;
                }
              }
            }

            Fs.writeFileSync(this.file, JSON.stringify(this.actions, null, "\t"),{encoding: "utf8"});
            Editor.assetdb.refresh(this.asset, function(error,results)
            {
              alert("Actions data have been saved to " + this.file);
            }.bind(this));
          },
          onUp ( event,index, group ) {
            event.stopPropagation();
            if(group === undefined)
            {
              if(index==0)return;
              this.actions = self.array_move(this.actions,index-1,index);
            }
            else
            {
              if(index==0)return;
              this.actions[group] = self.array_move(this.actions[group],index-1,index);
            }
      
          },
          onDown ( event,index, group ) {
            event.stopPropagation();
            
            if(group === undefined)
            {
              if(index==this.actions.length-1)return;
              this.actions = self.array_move(this.actions,index+1,index);
            }
            else
            {
              if(index==this.actions[group].length-1)return;
              this.actions[group] = self.array_move(this.actions[group],index+1,index);
            }
            
      
          },
          onRemove ( event,index, group ) {
            event.stopPropagation();
            if(group === undefined)
            {
              var r = confirm("Are you sure to remove action:" + this.actions[index].Type + "?");
              if (r)
              {
                this.actions.splice(index, 1);
              }
            }
            else
            {
              var r = confirm("Are you sure to remove action:" + this.actions[group][index].Type + "?");
              if (r)
              {
                this.actions[group].splice(index, 1);
              }
            }
          },
          onAdd ( event,index, group) {
            event.stopPropagation();
            if(group === undefined)
            {
              var data = {};
        
              data.Type = "";
              data.Params = false;

              this.actions.splice(index + 1,0, data);
            }
            else
            {
              var data = {};
       
              data.Type = "";
              data.Params = false;
  
              this.actions[group].splice(index + 1,0, data);
            }
     
          },
          onUpGroup ( event,index ) {
            event.stopPropagation();
            if(index==0)return;
            this.actions = self.array_move(this.actions,index-1,index);
      
          },
          onDownGroup ( event,index ) {
            event.stopPropagation();
            if(index==this.actions.length-1)return;
            this.actions = self.array_move(this.actions,index+1,index);
      
          },
          onRemoveGroup ( event,index ) {
            event.stopPropagation();
            var r = confirm("Are you sure to remove Group:" + (index+ 1) + "?");
            if (r)
            {
              this.actions.splice(index, 1);
            }
          },
          onAddGroup ( event,index ) {
            event.stopPropagation();
            var data = [{}];
       
            data[0].Type = "";
            data[0].Params = false;

            this.actions.splice(index + 1,0, data);
     
          },

          onCreateAction(event)
          {
            event.stopPropagation();
            if(!self.$jsonFile )
            { 
              alert("Please input file name.");
              return;
            }
            let actions = [{Type:"",Params:""}];
            let file = Editor.url("db://assets/ingredients/actions/" + self.$jsonFile.value + ".json" , 'utf8');
            Fs.writeFileSync(file, JSON.stringify(actions, null, "\t"),{encoding: "utf8"});
            
            Editor.assetdb.refresh("db://assets/ingredients/actions/", function(error,results)
            {
              alert("Action file has been created in " + file );
            });
          },
          onCreateGroup(event)
          {
            event.stopPropagation();
            if(!self.$jsonFile )
            { 
              alert("Please input file name.");
              return;
            }
            let actions = [[{Type:"",Params:""}]];
            let file = Editor.url("db://assets/ingredients/actions/" + self.$jsonFile.value + ".json" , 'utf8');
            Fs.writeFileSync(file, JSON.stringify(actions, null, "\t"),{encoding: "utf8"});
            alert("Action file has been created in " + file );
            Editor.assetdb.refresh("db://assets/ingredients/actions/", function(error,results)
            {
              alert("Action file has been created in " + file );
            });
          }
        }
      });

    

  //  this.$flagList.innerHTML =table;

  },

  // register your ipc messages here
  messages: {
    'escape:hello' (event) {
      this.$label.innerText = 'Hello!';
    }
  },

  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  },

  CSVToArray( strData, strDelimiter = null ) {
    strDelimiter = (strDelimiter || ",");
    var objPattern = new RegExp(
        (
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
        "gi"
    );
    var arrData = [[]];
    var arrMatches = null;
    while (arrMatches = objPattern.exec( strData )){
        var strMatchedDelimiter = arrMatches[ 1 ];
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)
            ){
            arrData.push( [] );
        }
        if (arrMatches[ 2 ]){
            var strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
            );
        } else {
            var strMatchedValue = arrMatches[ 3 ];
        }
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    if(arrData.length>0){
        arrData.pop();
    }
    return arrData;
}
});