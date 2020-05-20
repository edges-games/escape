import ECTouchEvent from "./ECTouchEvent";
import { ECFlagStatus, ECEvents } from "../../consts/ECConsts";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECItemEvent extends ECTouchEvent 
{
    @property item:string = "";

    onTouched()
    {
        if(!this.canTouch()) return false;

        if(!this.checkItem())
        {
            return true;
        }
        
        cc.systemEvent.emit(ECEvents.GetItem,this.item);
        this.completeHidden = true;
        this.setFlagStatus(this.flag, ECFlagStatus.CompleteHidden);
        return true;
    }
}
