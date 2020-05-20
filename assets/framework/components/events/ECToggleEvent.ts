import ECTouchEvent from "./ECTouchEvent";
import { ECFlagStatus, ECEvents } from "../../consts/ECConsts"

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECToggleEvent extends ECTouchEvent {

    @property(cc.String) targetFlag:string = "";

    onLoad()
    {
        super.onLoad();
        this.node.active = this.getFlagStatus(this.flag) == ECFlagStatus.Start;
    }

    public onTouched():boolean
    {
        this.setFlagStatus(this.targetFlag,this.getFlagStatus(this.targetFlag) == ECFlagStatus.Start?
        ECFlagStatus.Stay: ECFlagStatus.Start
        )

        this.setFlagStatus(this.flag,this.getFlagStatus(this.flag) == ECFlagStatus.Start?
        ECFlagStatus.Stay: ECFlagStatus.Start
        )
        this.onInitialize();
        this.playSound();
        return true;
    }
}
