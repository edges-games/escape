const {ccclass, property} = cc._decorator;

import ECBaseLayer from "./ECBaseLayer";
import { ECEvents } from "../consts/ECConsts";
import ECLocalization from "../core/ECLocalization";

@ccclass
export default class ECTitleLayer extends ECBaseLayer {

    @property(cc.Label) Title:cc.Label = null;
    private background;
    private foreground;
    onInitialize()
    {
        this.background = this.node.getChildByName("Background");
        this.foreground = this.node.getChildByName("Foreground");
        cc.systemEvent.on(ECEvents.ShowTitle,this.onTitleShow.bind(this));
    }

    onTitleShow(title)
    {
        this.Title.string = ECLocalization.format("LK_RN_" + title.toUpperCase());
        this.foreground.opacity = 0;
        this.background.opacity = 150;
        this.node.active=true;
        cc.tween(this.foreground).delay(1).to(1,{opacity:255}).delay(1).to(1,{opacity:0}).call(()=>{this.node.active=false;}).start();
        cc.tween(this.background).delay(3).to(1,{opacity:0}).start();
    }
}
