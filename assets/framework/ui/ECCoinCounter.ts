import { ECEvents } from "../consts/ECConsts";
import ECGameController from "../core/ECGameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CoinCounter extends cc.Component
{
    @property(cc.Sprite) CoinIcon:cc.Sprite = null;
    @property(cc.Label) CoinCount = null;

    onLoad () 
    {
        cc.systemEvent.on(ECEvents.UpdateCoin,this.onCoinCountChanged.bind(this), this);
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }

    onEnable () 
    {
        this.CoinCount.string = `x${ECGameController.instance.coin}`;
    }

    onCoinCountChanged()
    {
        cc.tween(this.CoinIcon.node).to(0.1,{scale:1.2}).to(0.1,{scale:1}).start();
        this.CoinCount.string = `x${ECGameController.instance.coin}`;
    }
}
