import ECTouchEvent from "./ECTouchEvent";
import { ECFlagStatus, ECEvents } from "../../consts/ECConsts";
import ECGameController from "../../core/ECGameController";
import ECLocalStorage from "../../core/ECLocalStorage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECAlphaEvent extends ECTouchEvent 
{
    @property count:number = 0;
    @property alpha:number = 0;

    start()
    {
        this.touchCount = ECLocalStorage.getItem(this.flag + "_alpha") || 0;
        this.node.opacity = (1 - (this.touchCount / this.count)) * 255 + this.alpha;
    }

    public onTouched():boolean
    {
        if(this.getFlagStatus() == ECFlagStatus.Complete)
        {
            return false;
        }

        if(this.needItem != "" && this.needItem != ECGameController.instance.currentItem)
        {
            if(this.itemError)
            {
                cc.systemEvent.emit(ECEvents.ShowText,this.itemError);
            }
            return true;
        }

        this.touchCount++;
        ECLocalStorage.setItem(this.flag + "_alpha", this.touchCount,true);

        if(this.touchCount >= this.count)
        {
            if(this.expendItem)
            {
                ECGameController.instance.expendItem(this.needItem);
            }
            this.setFlagStatus(this.flag, ECFlagStatus.Complete);
        }
        this.node.opacity = (1 - (this.touchCount / this.count)) * 255 + this.alpha;

        return true;
    }
}