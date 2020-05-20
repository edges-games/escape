import ECGameController from "./ECGameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECProformance extends cc.Component {

    @property(cc.JsonAsset) Actions:cc.JsonAsset = null;
    protected actionData = [];

    onLoad () 
    {
        if(this.Actions)
        {
            this.actionData = this.Actions.json;
        }

        ECGameController.instance.excuteActions(this,this.actionData);
    }
}
