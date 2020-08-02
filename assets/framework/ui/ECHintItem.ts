import ECUIGroup from "./ECUIGroup";
import ECGameController from "../core/ECGameController";
import ECLocalization from "../core/ECLocalization";
import { ECStrings, ECFlagStatus } from "../consts/ECConsts";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECHintItem extends cc.Component {

    @property(cc.Label) Title:cc.Label = null;
    @property(cc.Node) Coin:cc.Node = null;
    @property(cc.Label) CoinCount:cc.Label = null;
    @property(cc.Sprite) Lock:cc.Sprite = null;
    @property(cc.Sprite) UnLock:cc.Sprite = null;

    public data:any = null;

    onClick()
    {
        if(!this.Coin.active)
        {
            ECUIGroup.instance.showHintDetal(this.data);
        }
        else
        {
            if(this.data.price <= ECGameController.instance.coin)
            {
                ECUIGroup.instance.showMessage(["",ECLocalization.format(ECStrings.LK_BUY_HINT,this.data.price),1,
                    function(button)
                    {
                        if(button == "Yes")
                        {
                            ECGameController.instance.useCoin(this.data.price);
                            ECGameController.instance.setFlagStatus(this.data.flag,ECFlagStatus.Complete,false,true);
                            this.Coin.active = false;
                            this.Lock.node.active = false;
                            this.UnLock.node.active = true;
                        }
                    }.bind(this)
                ]);
            }
            else
            {
                ECUIGroup.instance.showMessage(["",ECLocalization.format(ECStrings.LK_BUY_COIN),1,
                    function(button)
                    {
                        if(button == "Yes")
                        {
                            ECUIGroup.instance.showShop();
                        }
                    }.bind(this)
                ]);
            }
        }
       
    }

    format()
    {
        this.Title.string = ECLocalization.format("LK_"　+ this.data.flag.toUpperCase() + "_TITLE");
        this.CoinCount.string = "x" + this.data.price;
        this.Lock.node.active = true;
        this.UnLock.node.active = false;

        if(this.data.price == 0 || ECGameController.instance.getFlagStatus(this.data.flag) == ECFlagStatus.Complete)
        {
            this.Lock.node.active = false;
            this.UnLock.node.active = true;
            this.Coin.active = false;
        }
    }
}
