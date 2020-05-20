import ECGameController from "../core/ECGameController";
import { ECFlagStatus } from "../consts/ECConsts";
import ECUIGroup from "./ECUIGroup";
import ECLocalization from "../core/ECLocalization";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ECScrapItem extends cc.Component {

    @property(cc.Label) title:cc.Label = null;
    public data:any = null;

    format()
    {
        if(ECGameController.instance.getFlagStatus(this.data.flag) == ECFlagStatus.Start)
        {
            this.title.string = ECLocalization.format( "LK_" + this.data.flag.toUpperCase() + "_TITLE");
        }
        else
        {
            this.title.string = "???";
            this.node.removeComponent(cc.Button);
        }
    }

    onClick()
    {
        ECUIGroup.instance.showScrapDetail(this.data);
    }
}
