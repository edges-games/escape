import ECEvent from "../events/ECEvent";
import { ECActionTypes } from "../../consts/ECConsts";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECPlaySoundAction extends cc.Component 
{
    @property delay: number = 0;
    @property sound: string = '';

    start()
    {
        let ecEvent:ECEvent = this.getComponent(ECEvent);
        let actions:any[] = (ecEvent as any).actionData;
        if(this.delay > 0)
        {
            actions.push({Type:ECActionTypes.Delay,Params:{"0":this.delay}});
        }
        actions.push({Type:ECActionTypes.PlaySound,Params:{"0":this.sound}});
    }
}
