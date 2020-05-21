import ECBaseLayer from "./ECBaseLayer";
import ECGameController from "../core/ECGameController";
import { ECEvents } from "../consts/ECConsts";
import ECLocalization from "../core/ECLocalization";
import ECLocalizableLabel from "../components/commons/ECLocalizableLabel";

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

    public show(args:any)
    {
        this.title.string = ECLocalization.format("LK_" + args.flag.toUpperCase() + "_TITLE");
        this.content.getComponent(ECLocalizableLabel).Key = "LK_" + args.flag.toUpperCase() + "_CONTENT";
        this.getComponentInChildren(cc.ScrollView).scrollToTop();
        cc.loader.loadRes("scraps/" + args.background,cc.SpriteFrame,function(error,spriteFrame){this.sprite.spriteFrame = spriteFrame}.bind(this));
        super.show();
    }
}
