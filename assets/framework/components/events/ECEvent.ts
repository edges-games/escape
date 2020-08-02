import { ECEvents, ECFlagStatus } from "../../consts/ECConsts";
import ECGameController from "../../core/ECGameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECEvent extends cc.Component 
{
    @property flag:string = "";
    @property(cc.JsonAsset) Actions:cc.JsonAsset = null;
    @property runActionOnStart:boolean = false;
    @property completeHidden:boolean = false;
    @property skipEffect:boolean = false;
    protected actionData = [];

    onLoad()
    {
        if(!this.flag) return;

        if(ECGameController.instance.getFlagRound(this.flag) > ECGameController.instance.playRound)
        {
            this.node.active = false;
            return;
        }

        cc.systemEvent.on(ECEvents.UpdateFlag,this.onUpdateStatus.bind(this),this);
        var status = ECGameController.instance.getFlagStatus(this.flag);
        if(status == ECFlagStatus.Stay || status == ECFlagStatus.CompleteHidden)
        {
            this.node.active = false;
        }
        else if(status == ECFlagStatus.Start || status == ECFlagStatus.Complete)
        {
            this.node.active = true;
        }
    }

    onInitialize()
    {
        if(this.Actions != null)
        {
            this.actionData = this.Actions.json;
        }
        if(!this.flag) return;
        var status = ECGameController.instance.getFlagStatus(this.flag);
        if(this.runActionOnStart && status == ECFlagStatus.Start)
        {
            if(this.actionData.length > 0)
            {
                ECGameController.instance.excuteActions(this,this.actionData);
            }
        }
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }

    onUpdateStatus(flag)
    {
        if(flag != this.flag) return;

        var status = ECGameController.instance.getFlagStatus(this.flag);
        if(status == ECFlagStatus.CompleteHidden || status == ECFlagStatus.Stay)
        {
            this.node.active = false;
        }
        if(status == ECFlagStatus.Start || status == ECFlagStatus.Complete)
        {
            this.node.active = true;
        }

        if(this.runActionOnStart && status == ECFlagStatus.Start)
        {
            if(this.actionData.length > 0)
            {
                ECGameController.instance.excuteActions(this,this.actionData);
            }
        }
    }

    getFlagStatus(flag:string=null)
    {
        return ECGameController.instance.getFlagStatus(!flag?this.flag:flag);
    }

    setFlagStatus(flag:string,status:string)
    {
        if(this.actionData.length > 0)
        {
            ECGameController.instance.excuteActions(this,this.actionData);
        }
        else
        {
            ECGameController.instance.setFlagStatus(flag,status,true,true);
        }
    }
}
