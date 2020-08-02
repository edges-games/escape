const {ccclass, requireComponent} = cc._decorator;

@ccclass
@requireComponent(cc.Label)
export default class ECRichLabel extends cc.Component {

    private label:cc.Label = null;
    private colors = {};

    onLoad()
    {
        this.label = this.node.getComponent(cc.Label);
        this.colors = {};
        let com = this;
        if((this.label as any)._assembler)
        (
            this.label as any)._assembler._updateContent = function () {
            this._updateFontScale();
            this._computeHorizontalKerningForText();
            this._alignText();
    
            var uintVerts = this._renderData.uintVDatas[0]; if (!uintVerts) return;
            for (let v = 0, c = 0; v < uintVerts.length; v += 20, c++)
            for (var i = this.colorOffset; i < 20; i += this.floatsPerVert) 
            if(com.colors[c]) { uintVerts[v+i] = com.colors[c]; };
        };
    }

    processValue(value:string):string
    {
        let colorMatches = value.match(/<color=([0-9A-Fa-f]{6})>([\s\S]*?)<\/color>/ig);
        if(colorMatches)
        {
            for (let i = 0; i < colorMatches.length; i++)
            {
                let match = colorMatches[i];
                let index = value.indexOf(match);
                index -= ((value.substr(0,index)).match(/\s/g) || []).length;
                let color = parseInt((match.substring(7,13) + "FF").split("").reverse().join(""), 16);
                let realValue = match.replace(/<color=([0-9A-Fa-f]{6})>/g, "").replace("</color>","").replace(/\\</g, "<").replace(/\\>/g,">");
                for(let j = index, l = index + realValue.length ; j < l; j++)
                {
                    this.colors[j] = color;
                }
                value = value.replace(match,realValue);
            }
        }

        return value
    }
}
