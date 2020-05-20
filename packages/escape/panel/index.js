// panel/index.js, this filename needs to match the one registered in package.json
var Fs = require('fs');

Editor.Panel.extend({

  // css style for panel
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
    .input_box{font-size:14px;width:100%;background-color: rgba(0,0,0,0);color:rgb(255,153,0,255);border:0px;height:30px"}
  `,

  // html template for panel
  template: `
    <div class="layout horizontal justified">
      <div class="layout horizontal">
        <ui-button @confirm="onReload">Reload</ui-button>
        <ui-button @confirm="onSave">Save</ui-button>
      </div>
      <div class="layout horizontal">
        <ui-input style="width:300px" id="txtSearch" ></ui-input>
        <ui-button @confirm="onSearch">Search</ui-button>
      </div>
    </div>
    <hr />
    <table width="99%" border="0" cellspacing="0" style="font-size:12px" cellpadding="0">
    <thead>
      <tr>
        <th width="7%">NO.</th>
        <th width="7%">Round</th>
        <th width="30%">Flag</th>
        <th width="26%">Comment</th>
        <th width="5%">Start</th>
        <th width="5%">Rate</th>
        <th width="5%"></th>
        <th width="5%"></th>
        <th width="5%"></th>
        <th width="5%"></th>
      </tr>
      </thead>
      <tbody style="visibility:hidden;height:0px" >
      <td width="7%" align="center" style="height:0px" >123</td>
      <td width="7%"><input type="text" class="input_box" style="height:0px" ></input></td>
      <td width="30%"><input type="text" class="input_box" style="height:0px" ></input></td>
      <td width="26%"><input type="text" class="input_box" style="height:0px" ></input></td>
      <td width="5%" align="center"><input type="checkbox" style="height:0px"  id="checkbox"/></td>
      <td width="5%" align="center"><input type="checkbox" style="height:0px"  id="checkbox" /></td>
      <td width="5%" align="center"><ui-button style="height:0px" >↑</ui-button></td>
      <td width="5%" align="center"><ui-button style="height:0px" >↓</ui-button></td>
      <td width="5%" align="center"><ui-button style="height:0px" >-</ui-button></td>
      <td width="5%" align="center"><ui-button style="height:0px" >+</ui-button></td>
    </tbody>
    </table>
    <div style="height:77%;overflow:auto;">
      <table width="100%" border="1" cellspacing="0" style="font-size:12px" cellpadding="0">
        <tbody id="flagList" v-for="(index, flag) in flags">
          <td width="7%" align="center">{{index + 1}}</td>
          <td width="7%"><input type="text" class="input_box" style="height:30px" v-model="flag.round"></input></td>
          <td width="30%"><input type="text" class="input_box" style="height:30px" v-model="flag.flag"></input></td>
          <td width="26%"><input type="text" class="input_box" style="height:30px" v-model="flag.comment"></input></td>
          <td width="5%" align="center"><input type="checkbox" id="checkbox" v-model="flag.start"/></td>
          <td width="5%" align="center"><input type="checkbox" id="checkbox" v-model="flag.requisite"/></td>
          <td width="5%" align="center"><ui-button @confirm="onUp($event,index)">↑</ui-button></td>
          <td width="5%" align="center"><ui-button v-on:click="onDown($event,index)">↓</ui-button></td>
          <td width="5%" align="center"><ui-button @confirm="onRemove($event,index)">-</ui-button></td>
          <td width="5%" align="center"><ui-button v-on:click="onAdd($event,index)">+</ui-button></td>
        </tbody>
      </table>
    </div>
    <hr />
  `,

  // element and variable binding
  $: {

    txtSearch:"#txtSearch"
  },

  flagCSVPath: Editor.url('db://assets/ingredients/masters/flags.csv', 'utf8'),

  // method executed when template and styles are successfully loaded and initialized
  ready () {
      let self = this;
      new window.Vue({
        el: this.shadowRoot,
        data: {
          flags: self.loadFlagData(),
        },
        methods: {
          onSave ( event ) {
            event.stopPropagation();


            let checker = {};
            for(let i=0;i<this.flags.length;i++)
            {
              if(!this.flags[i].flag)
              {
                alert("Error index " +(i + 1)+ " is null");
                return;
              }

              if(checker[this.flags[i].flag] != undefined)
              {
                alert("Flags " +this.flags[i].flag + " on index " + (i + 1) + " and " + (checker[this.flags[i].flag] + 1) + " are duplicated!");
                return;
              }
              checker[this.flags[i].flag] = i;
            }


            let csvContent = "flag,status,requisite,comment\r\n";
       
            this.flags.forEach(function(data) {
                let row = data.round + "," + data.flag + "," + (data.start?"1,":"0,") + (data.requisite?"1,":"0,") + (data.comment?data.comment:"");
                csvContent += row + "\r\n";
            });
            csvContent = csvContent.slice(0, -2);
            Fs.writeFileSync(self.flagCSVPath,csvContent,{encoding: "utf8"});
            Editor.assetdb.refresh("db://assets/resources/data/masters/flags.csv", function(error,results)
            {
              alert("Flags CSV data have been saved to " + self.flagCSVPath);
            });
            

          },
          onReload ( event ) {
            event.stopPropagation();
            this.flags = self.loadFlagData();
            alert("Flags csv data reloaded.");
          },
          onRemove ( event,index ) {
            event.stopPropagation();
            var r = confirm("Are you sure to remove flag:" + this.flags[index].flag + "?");
            if (r)
            {
              this.flags.splice(index, 1);
            }
          },
          onAdd ( event,index ) {
            event.stopPropagation();
            var data = {};
            data.round = 0;
            data.flag = "";
            data.start = false;
            data.requisite = false;
            data.comment = "";

            this.flags.splice(index + 1,0, data);
     
          },
          onUp ( event,index ) {
            event.stopPropagation();
            if(index==0)return;
            this.flags = self.array_move(this.flags,index-1,index);
      
          },
          onDown ( event,index ) {
            event.stopPropagation();
            if(index==this.flags.length-1)return;
            this.flags = self.array_move(this.flags,index+1,index);
      
          },
          onSearch(event)
          {
            event.stopPropagation();
            if(!self.$txtSearch.value) return;
            for(let i=0;i<this.flags.length;i++)
            {
              if(this.flags[i].flag ==  self.$txtSearch.value)
              {
                alert("The index of flag [" + self.$txtSearch.value +"] is " + (i + 1) + ".");
                return;
              }
            }

            alert("There is no flag called [" + self.$txtSearch.value +"].");
           
          }
        },
      });

    

  //  this.$flagList.innerHTML =table;

  },

  // register your ipc messages here
  messages: {
    'escape:hello' (event) {
      this.$label.innerText = 'Hello!';
    }
  },

  loadFlagData()
  {
    let csv = Fs.readFileSync(this.flagCSVPath)

    let flags = [];
    var flagdata = this.CSVToArray(csv);
    for(let i=1;i<flagdata.length;i++)
    {
        var data = {};

        data.round = flagdata[i][0];
        data.flag = flagdata[i][1];
        data.start = flagdata[i][2] == "1";
        data.requisite = flagdata[i][3] == "1";
        data.comment = flagdata[i][4];
        flags.push(data);
    }
    return flags;
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
    strData +="\r\n";
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