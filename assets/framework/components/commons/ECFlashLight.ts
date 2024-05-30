import { ECEvents, ECFlagStatus } from "../../consts/ECConsts";
import ECGameController from "../../core/ECGameController";
import ECLightEvent from "../events/ECLightEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECFlashLight extends cc.Component {

    @property(cc.Node) Light: cc.Node = null;
    @property(cc.Node) Dark: cc.Node = null;
    @property(cc.Node) Mask: cc.Node = null;
    @property({type:cc.AudioClip}) switchSound:cc.AudioClip = null;
    
    onInitialize()
    {
        cc.systemEvent.on(ECEvents.SwitchLight,this.onSwitchLight.bind(this));
        cc.tween(this.Mask).hide().start();
        var showMask= ()=> {
            let tween = cc.tween(this.Mask);
            let r = Math.floor(Math.random() * 3) + 3;
            cc.systemEvent.emit(ECEvents.LightTwinkle, "FlashLight");
            for(let i = 0; i< r; i ++)
            {
                tween.show().delay(Math.floor(Math.random() * 8 + 1) * 0.02).hide()
                .delay(Math.floor(Math.random() * 8 + 1) * 0.02);
            }
            tween.hide().start();
        }
        this.schedule(showMask,120, cc.macro.REPEAT_FOREVER, 0);
    }

    onSwitchLight(on)
    {
        if(this.switchSound)
            {
                ECGameController.instance.audio.playSound(this.switchSound);
            }
            this.Light.active = on;
            this.Dark.active = !on;
    }
}
