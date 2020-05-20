import { ECEvents } from "../../consts/ECConsts";
import ECGameController from "../../core/ECGameController";
import ECTouchEvent from "./ECTouchEvent";
import ECUtils from "../../core/ECUtils";

const {ccclass} = cc._decorator;

@ccclass
export default class ECSliverLightEvent extends ECTouchEvent {

    private currentTween:cc.Tween = null;

    onLoad()
    {
        super.onLoad();
        cc.systemEvent.on(ECEvents.SwitchLight,this.onSwitchLight.bind(this),this);
        this.node.opacity = 0;
    }

    onSwitchLight()
    {
        if(!ECGameController.instance.flashLight.Light.active)
        {
            ECUtils.stopTween(this.currentTween);
            this.node.opacity = 255;
            this.currentTween = cc.tween(this.node).to(5,{opacity:0}).start();
        }
        else
        {
            ECUtils.stopTween(this.currentTween);
            this.node.opacity = 0;
        }
    }
}
