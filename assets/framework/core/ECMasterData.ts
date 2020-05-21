const {ccclass, property} = cc._decorator;

@ccclass
export default class ECMasterData extends cc.Component {

    public static instance:ECMasterData = null;

    @property(cc.TextAsset) HintCSV: cc.TextAsset = null;
    public hints: HintData[] = null;

    @property(cc.TextAsset) ItemCSV: cc.TextAsset = null;
    public items: {[key: string]: ItemData} = null;

    @property(cc.TextAsset) FlagCSV: cc.TextAsset = null;
    public flags: {[key: string]: FlagData} = null;
    
    @property(cc.TextAsset) ScrapCSV: cc.TextAsset = null;
    public scraps: ScrapData[] = null;
    
    onInitialize () {
        ECMasterData.instance = this;

        this.hints = [];
        var hintdata = this.CSVToArray(this.HintCSV.text);
        for(let i=1;i<hintdata.length;i++)
        {
            let data:HintData = new HintData();
            data.flag = hintdata[i][0];
            data.price = hintdata[i][1];
            data.scene = hintdata[i][2];
            this.hints.push(data);
        }

        this.scraps = [];
        var scrapdata = this.CSVToArray(this.ScrapCSV.text);
        for(let i=1; i<scrapdata.length; i++)
        {
            let data:ScrapData = new ScrapData();
            data.flag = scrapdata[i][0];
            data.background = scrapdata[i][1];
            data.smart = scrapdata[i][2];
            this.scraps.push(data);
        }

        this.loadFlags();

        this.items = {};
        var itemdata = this.CSVToArray(this.ItemCSV.text);
        for(let i=1;i<itemdata.length;i++)
        {
            var item:ItemData = new ItemData();
            item.item = itemdata[i][0];
            item.fromA = itemdata[i][1];
            item.fromB = itemdata[i][2];
            item.toA = itemdata[i][3];
            item.toB = itemdata[i][4];
            item.back = itemdata[i][5] == "1";
            item.flag = itemdata[i][6];
            item.smart = itemdata[i][7] == "1";
            this.items[item.item] = item;
        }

        cc.log("Master data loaded Flags:"+Object.keys(this.flags).length + " Hints:" + this.hints.length);
    }

    loadFlags()
    {
        this.flags = {};
        var flagdata = this.CSVToArray(this.FlagCSV.text);
        for(let i=1;i<flagdata.length;i++)
        {
            var data:FlagData = new FlagData();
            data.round = flagdata[i][0];
            data.flag = flagdata[i][1];
            data.status = flagdata[i][2];
            data.requisite = flagdata[i][3];
            this.flags[data.flag] = data;
        }
    }

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
}

@ccclass
export class HintData
{
    public flag:string;
    public price:number;
    public scene:string;
}

@ccclass
export class ItemData
{
    public item:string;
    public fromA:string;
    public fromB:string;
    public toA:string;
    public toB:string;
    public flag:string;
    public back:boolean;
    public smart:boolean;
}

@ccclass
export class FlagData
{
    public flag:string;
    public round:number;
    public status:string;
    public requisite:string;
}

@ccclass
export class ScrapData
{
    public flag:string;
    public background:string;
    public smart:boolean;
}
