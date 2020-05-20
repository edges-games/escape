const {ccclass, property} = cc._decorator;

import ECBaseLayer from "./ECBaseLayer";
import { ECEvents } from "../consts/ECConsts";
import ECGameController from "../core/ECGameController";
import ECLocalization from "../core/ECLocalization";

@ccclass
export default class ECItemLayer extends ECBaseLayer 
{
    @property(cc.Label) itemName:cc.Label = null;
    @property(cc.Label) itemDesc:cc.Label = null;
    @property(cc.Sprite) itemSprite:cc.Sprite = null;

    @property({type:cc.AudioClip}) audioClip = null;
    
    public onInitialize()
    {
        cc.systemEvent.on(ECEvents.GetItem,this.onGetItem.bind(this));
    }

    onGetItem(item:string)
    {
        cc.loader.loadRes("items/" + item,cc.SpriteFrame,
        function(error,spriteFrame)
        {
            this.itemSprite.spriteFrame = spriteFrame;
        }.bind(this));

        if(this.audioClip)
        {
            ECGameController.instance.audio.playSound(this.audioClip);
        }
 
        this.itemName.string = ECLocalization.format("LK_"+item.toUpperCase()+"_NAME");
        this.itemDesc.string = ECLocalization.format("LK_"+item.toUpperCase()+"_DESC");

        super.show();
    }

    public show(args:any)
    {
        this.onGetItem(args[0]);
    }
}
