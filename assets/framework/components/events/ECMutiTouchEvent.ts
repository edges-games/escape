import ECTouchEvent from "./ECTouchEvent";
import { ECFlagStatus } from "../../consts/ECConsts"
import ECGameController from "../../core/ECGameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECMutiTouchEvent extends ECTouchEvent
{
    onInitialize()
    {
        super.onInitialize();
        this.actionData[this.actionData.length-1].push({"Type":"UpdateFlag","Params":[this.flag,this.completeHidden?"CompleteHidden":"Complete",true]});
    }

    public onTouched():boolean
    {
        if(ECGameController.instance.getFlagStatus(this.flag) != ECFlagStatus.Start) return false;
        if(this.touchCount >= this.actionData.length ) return false;

        if(!this.checkItem())
        {
            return true;
        }
        
        ECGameController.instance.excuteActions(this,this.actionData[this.touchCount],this.actionData.length - 1 == this.touchCount );
        this.touchCount++;
        return true;
    }

    onUpdateStatus(flag)
    {
        if(flag != this.flag) return;

        var status = ECGameController.instance.getFlagStatus(this.flag);
        if(status == ECFlagStatus.CompleteHidden)
        {
            this.node.active = false;
        }
        if(status == ECFlagStatus.Start)
        {
            this.node.active = true;
        }
    }
}
