const {ccclass, property} = cc._decorator;

@ccclass
export default class ECLocalization extends cc.Component {

    static instance:ECLocalization;

    @property(cc.TextAsset) English:cc.TextAsset = null;
    @property(cc.JsonAsset) Japanese:cc.JsonAsset = null;
    @property(cc.TextAsset) Chinese:cc.TextAsset = null;
    @property(cc.Integer) Default:number = 0;

    private strings:any = {};

    onLoad()
    {
        ECLocalization.instance = this;
        this.strings = this.Japanese.json;
    }

    static format(key:string, ...args: any[])
    {
        var value = ECLocalization.instance.strings[key];

        if(value == null)
        {
            cc.error("There is no key:" + key);
            value = key;
        }

        if(args != null)
        {
            for (var i = 0; i < args.length; i++) {
                var regexp = new RegExp('\\{'+i+'\\}', 'gi');
                value = value.replace(regexp, args[i]);
            }
        }

        return value;
    }
    // update (dt) {}
}
