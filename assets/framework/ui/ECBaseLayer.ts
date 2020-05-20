import ECGameController from "../core/ECGameController";
import { ECEvents } from "../consts/ECConsts";
import ECUtils from "../core/ECUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECBaseLayer extends cc.Component {

    @property({type:cc.AudioClip}) openSound:cc.AudioClip = null;
    @property({type:cc.AudioClip}) closeSound:cc.AudioClip = null;
    private showTween:cc.Tween<unknown> = null;
    private hideTween:cc.Tween<unknown> = null;
    
    public onInitialize()
    {

    }
    
    public show(args:any = null)
    {
        this.onShowing();
        ECUtils.stopTween(this.showTween);
        ECUtils.stopTween(this.hideTween);

        if(this.openSound)
        {
            ECGameController.instance.audio.playSound(this.openSound);
        }
        this.node.opacity = 0;
        this.showTween = cc.tween(this.node).call(()=>{this.node.active=true;}).to(0.2,{opacity:255}).call(this.onShowed.bind(this)).start();
    }

    protected onShowing()
    {

    }

    public hide()
    {
        ECUtils.stopTween(this.showTween);
        ECUtils.stopTween(this.hideTween);
        if(this.closeSound)
        {
            ECGameController.instance.audio.playSound(this.closeSound);
        }
        this.hideTween = cc.tween(this.node).to(0.2,{opacity:0}).call(()=>{this.node.active = false; this.onHidden();}).start();
    }

    protected onShowed()
    {

    }

    protected onHidden()
    {
        cc.systemEvent.emit(ECEvents.PanelHid, this.node.name);
    }
}
