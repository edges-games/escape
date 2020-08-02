import ECTouchEvent from "./ECTouchEvent";
import { ECFlagStatus, ECEvents } from "../../consts/ECConsts"


const {ccclass, property} = cc._decorator;

@ccclass
export default class ECCoinEvent extends ECTouchEvent 
{
    @property coin:number = 1;

    onTouched()
    {
        if(this.getFlagStatus(this.flag) != ECFlagStatus.Start) return;
        
        this.setFlagStatus(this.flag, ECFlagStatus.CompleteHidden);

        cc.systemEvent.emit(ECEvents.TakeCoin,this);

        return true;
    }
}
