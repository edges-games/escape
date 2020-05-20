const {ccclass} = cc._decorator;

import ECBaseLayer from "./ECBaseLayer";
import ECGameController from "../core/ECGameController";
import ECUIGroup from "./ECUIGroup";

@ccclass
export default class AttentionLayer extends ECBaseLayer {

    private executing = false;

    start()
    {
        setTimeout(() => {
            this.gotoTitle();
        }, 5000);
    }

    gotoTitle()
    {
        if(!this.executing)
        {
            this.executing = true;
            cc.tween(ECGameController.instance.mask)
                .call(()=>{ECGameController.instance.mask.active=true;})
                .to(1,{opacity:255})
                .call(()=>
                {
                    this.node.destroy();
                    ECUIGroup.instance.showStandup();
                }).to(1,{opacity:0})
                .call(()=>{ECGameController.instance.mask.active=false;})
                .start();
        }
    }
}
