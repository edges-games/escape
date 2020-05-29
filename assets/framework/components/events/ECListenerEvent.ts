import { ECFlagStatus, ECEvents } from "../../consts/ECConsts"
import ECEvent from "./ECEvent";

const {ccclass, property} = cc._decorator;

const ECListenerBehaviors = cc.Enum({
    PanelHid: 1,
    UpdateFlag: 2
});

@ccclass
export default class ECListenerEvent extends ECEvent 
{
    @property({type:ECListenerBehaviors}) behavior = ECListenerBehaviors.PanelHid;
    @property param:string = "";
    private flags:string[]=[];

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
            if(this.behavior == ECListenerBehaviors.PanelHid)
            {
                cc.systemEvent.on(ECEvents.PanelHid,this.onPanelHid.bind(this),this);
            }
            else if(this.behavior == ECListenerBehaviors.UpdateFlag)
            {
                this.flags = this.param.split(",");
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

    onUpdateStatus(flag)
    {
        super.onUpdateStatus(flag);

        if(flag != this.flag)
        {
            let allComplete = true;
            for(let i=0; i < this.flags.length; i++)
            {
                let status = this.getFlagStatus(this.flags[i]);
                if(status != ECFlagStatus.Complete || status != ECFlagStatus.CompleteHidden)
                {
                    allComplete = false;
                }
            }

            if(allComplete)
            {
                this.setFlagStatus(this.flag, ECFlagStatus.Complete);
            }
        }
    }
}
