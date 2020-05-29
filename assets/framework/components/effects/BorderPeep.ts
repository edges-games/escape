import ECEffect from "../../core/ECEffect";
import ECGameController from "../../core/ECGameController";

const {ccclass} = cc._decorator;

@ccclass
export default class BorderPeep extends ECEffect 
{
    private background:cc.Node = null;
    private executing = false;

    start()
    {
        this.background = ECGameController.instance.currentScene.node.getChildByName("Background");
        this.node.x = this.background.x + this.background.width / 2;
    }

    update(dt)
    {
        if(!this.executing)
        {
            if((this.background.x + this.background.width / 2 - 10) < cc.winSize.width/2)
            {
                this.executing = true;
                cc.tween(this.node).delay(1).by(1,{x:cc.winSize.width}).removeSelf().start();
            }
            else
            {
                this.node.x = this.background.x + this.background.width / 2;
            }
        }
    }
}
