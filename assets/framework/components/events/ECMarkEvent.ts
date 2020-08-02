import ECTouchEvent from "./ECTouchEvent";
import { ECFlagStatus, ECEvents } from "../../consts/ECConsts"

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECMarkEvent extends ECTouchEvent 
{
    onTouched()
    {
        if(this.getFlagStatus(this.flag) != ECFlagStatus.Start) return;
        this.setFlagStatus(this.flag, this.completeHidden? ECFlagStatus.CompleteHidden: ECFlagStatus.Complete);
        cc.systemEvent.emit(ECEvents.TakeMark);
        return true;
    }
}
