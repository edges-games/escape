import ECTouchEvent from "./ECTouchEvent";
import ECGameController from "../../core/ECGameController";
import { ECFlagStatus, ECEvents } from "../../consts/ECConsts"

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECScrapEvent extends ECTouchEvent {

    @property scrap: string = "";

    public onTouched():boolean
    {
        if(ECGameController.instance.getFlagStatus(this.flag) != ECFlagStatus.Start) return false;
        cc.systemEvent.emit(ECEvents.GetScrap,this.scrap);
        ECGameController.instance.setFlagStatus(this.scrap, ECFlagStatus.Start, false, true);
        this.setFlagStatus(this.flag,this.completeHidden ? ECFlagStatus.CompleteHidden : ECFlagStatus.Complete);
        return true;
    }
}
