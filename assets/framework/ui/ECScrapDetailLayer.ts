import ECBaseLayer from "./ECBaseLayer";
import ECGameController from "../core/ECGameController";
import { ECEvents } from "../consts/ECConsts";
import ECLocalization from "../core/ECLocalization";
import ECRichLabel from "../components/commons/ECRichLabel";
import ECLocalStorage from "../core/ECLocalStorage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECScrapDetailLayer extends ECBaseLayer 
{
    @property(cc.Label) title:cc.Label = null;
    @property(cc.Label) content:cc.Label = null;
    @property(cc.Sprite) sprite:cc.Sprite = null;

    public onInitialize()
    {
        cc.systemEvent.on(ECEvents.GetScrap,this.onGetScrap.bind(this));
    }

    onGetScrap(key)
    {
        for(let i=0;i<ECGameController.instance.master.scraps.length;i++)
        {
            if(ECGameController.instance.master.scraps[i].flag == key)
            {
                this.show(ECGameController.instance.master.scraps[i]);
                return;
            }
        }
    }

    public show(args:any = null)
    {
        this.title.string = ECLocalization.format("LK_" + args.flag.toUpperCase() + "_TITLE");
        let value = ECLocalization.format("LK_" + args.flag.toUpperCase() + "_CONTENT");
        let evalMatches:string[] = value.match(/{eval\(("|').*("|')\)}/ig);

        if(evalMatches)
        {
            for (let i = 0; i < evalMatches.length; i++)
            {
                let match = evalMatches[i];
                let script = match.substring(7, match.length-3);
                value = value.replace(match, eval(script));
            }
        }

        setTimeout(() => {
            this.content.string = this.content.getComponent(ECRichLabel).processValue(value);
        }, 10);
 
      

        this.getComponentInChildren(cc.ScrollView).scrollToTop();
        cc.resources.load("scraps/" + args.background,cc.SpriteFrame,function(error,spriteFrame){this.sprite.spriteFrame = spriteFrame}.bind(this));
        super.show();
    }

    public dateFormat(x, y, w:string = "") {
        var z = {
            M: x.getMonth() + 1,
            d: x.getDate(),
            h: x.getHours(),
            m: x.getMinutes(),
            s: x.getSeconds(),
           
        };
        y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
            return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
        });
    
        y = y.replace(/(w)/g, (v)=> {
            return  w.length == 0 ? x.getDay() : w.split("")[x.getDay()];
        });

        return y.replace(/(y+)/g, function(v) {
            return x.getFullYear().toString().slice(-v.length)
        });
    }

    public getMarkDate(format:string, week:string)
    {
        if(ECLocalStorage.getItem("mark_date"))
        {
            return this.dateFormat(new Date(ECLocalStorage.getItem("mark_date")),format,week);
        }

        return "";
    }
}
