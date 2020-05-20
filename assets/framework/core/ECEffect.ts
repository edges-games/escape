import ECGameController from "./ECGameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECEffect extends cc.Component {

    @property lifeTime = 5;
    public actionData = [];

    start()
    {
        if(this.lifeTime > 0)
        {
            setTimeout(() => {
                this.node.destroy();
            }, this.lifeTime * 1000);
        }
        if(this.actionData.length > 0)
        {
            ECGameController.instance.excuteActions(this,this.actionData,false);
        }
    }
}
