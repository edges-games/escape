const {ccclass, property} = cc._decorator;

import ECBaseLayer from "./ECBaseLayer";
import { ECEvents } from "../consts/ECConsts";
import ECGameController from "../core/ECGameController";

@ccclass
export default class ECMarkLayer extends ECBaseLayer 
{
    @property(cc.Label) markCount:cc.Label = null;

    public onInitialize()
    {
        cc.systemEvent.on(ECEvents.TakeMark,this.onTakeMark.bind(this));
    }

    onTakeMark()
    {
        this.markCount.string = ECGameController.instance.getCurrentMarkCount() + "/" + ECGameController.instance.getTotalMarkCount();

        this.show();
    }

}
