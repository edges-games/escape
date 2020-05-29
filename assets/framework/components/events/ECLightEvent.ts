import ECTouchEvent from "./ECTouchEvent";
import { ECFlagStatus } from "../../consts/ECConsts";
import ECGameController from "../../core/ECGameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECLightEvent extends ECTouchEvent
{
    @property(cc.Node) switchOn:cc.Node = null;
    @property(cc.Node) switchOff:cc.Node = null;
    @property(cc.Node) light:cc.Node = null;

    onLoad()
    {
        super.onLoad();
        this.onUpdateStatus(this.flag);
    }

    onUpdateStatus(flag:string)
    {
        if(flag != this.flag) return;

        if(this.switchOff) this.switchOff.active = false;
        if(this.switchOn) this.switchOn.active = false;
        if(this.light) this.light.active = false;
        
        let status = this.getFlagStatus(this.flag);

        if(status == ECFlagStatus.Complete)
        {
            if(this.switchOff) this.switchOff.active = true;
            if(this.switchOn) this.switchOn.active = false;
            if(this.light) this.light.active = true;
        }
        else if(status == ECFlagStatus.Start)
        {
            if(this.switchOff) this.switchOff.active = false;
            if(this.switchOn) this.switchOn.active = true;
            if(this.light) this.light.active = false;
        }
    }

    public onTouched():boolean
    {
        this.setFlagStatus(this.flag,this.getFlagStatus(this.flag) == ECFlagStatus.Start? ECFlagStatus.Complete: ECFlagStatus.Start);
        ECGameController.instance.onUpdateFlashLight();

        return true;
    }

}
