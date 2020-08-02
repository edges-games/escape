import ECTouchEvent from "./ECTouchEvent";
import { ECFlagStatus, ECEvents } from "../../consts/ECConsts";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECGotoEvent extends ECTouchEvent {

    @property destination:string = "";
    @property isDetail:boolean = false;
    @property isQuick:boolean = false;

    public onTouched():boolean
    {
        if(!this.checkItem())
        {
            return true;
        }
        cc.systemEvent.emit(this.isDetail?ECEvents.GotoDetail:ECEvents.GotoScene, this.destination,this.isQuick,null);
        this.playSound();

        if(!this.flag) return true;
        this.setFlagStatus(this.flag,this.completeHidden ? ECFlagStatus.CompleteHidden : ECFlagStatus.Start);
        return true;
    }
}
