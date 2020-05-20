import ECTouchEvent from "./ECTouchEvent";
import ECGameController from "../../core/ECGameController";
import { ECFlagStatus, ECEvents } from "../../consts/ECConsts"

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECLockEvent extends ECTouchEvent {

    @property targetFlag:string = "";
    @property({type:cc.AudioClip}) unlockSound:cc.AudioClip = null;
    
    public onTouched():boolean
    {
        if(!this.flag) return true;

        if(!this.checkItem())
        {
            this.playSound();
            return true;
        }

        if(this.expendItem)
        {
            ECGameController.instance.expendItem(this.needItem);
        }

        this.setFlagStatus(this.flag, ECFlagStatus.CompleteHidden);
        this.playSound(this.unlockSound);

        if(!this.targetFlag) return true;
        this.setFlagStatus(this.targetFlag, ECFlagStatus.Start);

        return true;
    }
}
