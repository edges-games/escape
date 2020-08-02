import ECBaseLayer from "./ECBaseLayer";
import ECGameController from "../core/ECGameController";
import ECUIGroup from "./ECUIGroup";
import ECNative from "../native/ECNative";
import ECLocalization from "../core/ECLocalization";
import { ECStrings } from "../consts/ECConsts";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SettingLayer extends ECBaseLayer {

    @property(cc.Node) musicOff:cc.Node = null;
    @property(cc.Node) soundOff:cc.Node = null;
    @property(cc.Node) vibrationOff:cc.Node = null;
    @property(cc.Node) titleButton:cc.Node = null;

    onShowing()
    {
        this.musicOff.active = !ECGameController.instance.EnableMusic;
        this.soundOff.active = !ECGameController.instance.EnableSound;
        this.vibrationOff.active = !ECGameController.instance.EnableVibration;
        this.titleButton.active = false;
    }

    public onSetMusic()
    {
        ECGameController.instance.EnableMusic = !ECGameController.instance.EnableMusic;
        if(!ECGameController.instance.EnableMusic)
        {
            ECGameController.instance.audio.stopBGM();
        }
        this.onShowing();
        ECGameController.instance.saveSettings();
    }

    public onSetSound()
    {
        ECGameController.instance.EnableSound = !ECGameController.instance.EnableSound;
        this.onShowing();
        if(!ECGameController.instance.EnableSound)
        {
            ECGameController.instance.audio.stopSoundLoop();
        }
        ECGameController.instance.saveSettings();
    }

    public onSetVibration()
    {
        ECGameController.instance.EnableVibration = !ECGameController.instance.EnableVibration;
        this.onShowing();
        ECGameController.instance.saveSettings();
    }

    public onShowDebuger()
    {
        cc.resources.load("debuger/debuger",cc.Prefab,(error,prefab:cc.Prefab)=>{
           let node: cc.Node = cc.instantiate(prefab);
           this.node.parent.addChild(node);
           node.setPosition(cc.Vec2.ZERO);
        })
    }

    public onGoBackTitle()
    {
        cc.tween(ECGameController.instance.mask)
        .call(()=>{ECGameController.instance.mask.active=true;})
        .to(1,{opacity:255})
        .call(()=>{
            ECGameController.instance.overGame();
            ECUIGroup.instance.hideHUD();
            ECUIGroup.instance.showStandup();
            this.node.active=false;})
        .to(1,{opacity:0})
        .call(()=>{ECGameController.instance.mask.active=false;})
        .start();
    }

    public onShare()
    {
        ECNative.shareMessage(ECLocalization.format(ECStrings.LK_SHARE), ECLocalization.format(ECStrings.LK_SHARE_MESSAGE));
    }
}
