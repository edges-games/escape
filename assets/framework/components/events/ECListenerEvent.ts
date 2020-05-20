import { ECFlagStatus, ECEvents } from "../../consts/ECConsts"
import ECEvent from "./ECEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECListenerEvent extends ECEvent 
{
    @property behavior:string = "";
    @property param:string = "";

    onInitialize()
    {
        if(!this.behavior || !this.param) return;

        if(!this.flag) return;

        let status = this.getFlagStatus(this.flag);
        if(status != ECFlagStatus.Start)
        {
            this.node.active = false;
        }

        if(status == ECFlagStatus.Start || status == ECFlagStatus.Stay)
        {
            if(this.behavior == ECEvents.PanelHid)
            {
                cc.systemEvent.on(this.behavior,this.onPanelHid.bind(this),this);
            }
        }

        super.onInitialize();
    }

    onPanelHid(panel)
    {
        let status = this.getFlagStatus(this.flag);
        if(status != ECFlagStatus.Start)
        {
            return;
        }
        if(panel == this.param)
        {
            this.setFlagStatus(this.flag, ECFlagStatus.Complete);
        }
    }
}
