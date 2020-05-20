import ECEvent from "../events/ECEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECFlagStartAction extends cc.Component 
{
    @property flag: string = '';

    start()
    {
        let ecEvent:ECEvent = this.getComponent(ECEvent);
        let actions:any[] = (ecEvent as any).actionData;
        actions.push({Type:"UpdateFlag",Params:{"0":this.flag,"1": "Start"}});
    }
}
