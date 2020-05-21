import { ECEvents } from "../../consts/ECConsts";
import ECGameController from "../../core/ECGameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECFlashLight extends cc.Component {

    @property(cc.Node) Light: cc.Node = null;
    @property(cc.Node) Dark: cc.Node = null;
    @property(cc.Node) Mask: cc.Node = null;

    onInitialize()
    {
        this.node.active = ECGameController.instance.hasFlashLight() || ECGameController.instance.hasFlashLight2();
        if(!ECGameController.instance.hasFlashLight2())
        {
            this.Light.active = false;
            this.Dark.active = true;
        }
        else
        {
            this.Light.active = true;
            this.Dark.active = false;
        }
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
        this.Light.active = on;
        this.Dark.active = !on;
    }
    
}
