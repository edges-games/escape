import { ECFlagStatus } from "../../consts/ECConsts"
import ECEvent from "./ECEvent";
import ECGameController from "../../core/ECGameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECAudioEvent extends ECEvent 
{
    @property(cc.AudioSource) audioSource:cc.AudioSource = null;

    start()
    {
        if(this.audioSource)
        {
            if(this.getFlagStatus(this.flag) == ECFlagStatus.Start)
            {
                if(ECGameController.instance.EnableSound || (this.audioSource.loop && ECGameController.instance.EnableMusic))
                {
                    this.audioSource.play();
                }
            }
        }
    }

    onUpdateStatus(flag)
    {
        if(flag != this.flag) return;
        
        super.onUpdateStatus(flag);
        if(this.getFlagStatus(this.flag) == ECFlagStatus.Start)
        {
            this.start();
        }
    }
}
