import ECTouchEvent from "./ECTouchEvent";
import { ECFlagStatus, ECEvents } from "../../consts/ECConsts"
import ECGameController from "../../core/ECGameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECTextEvent extends ECTouchEvent {

    @property StringKey: string = "";

    public onTouched():boolean
    {
        cc.systemEvent.emit(ECEvents.ShowText,this.StringKey);
        if(!this.flag)
        { 
            if(this.actionData.length > 0)
            {
                ECGameController.instance.excuteActions(this,this.actionData);
            }
            return true;
        }
        else
        {
            if(this.getFlagStatus(this.flag) != ECFlagStatus.Start)
            {
                return true;
            }
            this.setFlagStatus(this.flag,this.completeHidden ? ECFlagStatus.CompleteHidden : ECFlagStatus.Complete);
        }

        return true;
    }
}
