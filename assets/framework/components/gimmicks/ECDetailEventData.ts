import { ECEvents } from "../../consts/ECConsts";
import ECEvent from "../events/ECEvent";
import ECDetailEvent from "../events/ECDetailEvent";
import ECGameController from "../../core/ECGameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECDetailEventData extends cc.Component 
{
    @property price:number = 0;
    @property hint:string = "";
    @property euthanasia:boolean = false;
    @property showHelp:boolean = false;
    @property(cc.Component.EventHandler) onClose:cc.Component.EventHandler = null;
    @property(cc.JsonAsset) actions:cc.JsonAsset = null;

    public event:ECDetailEvent = null;
    protected actionData = [];
    public isCompleted:boolean = false;

    public unlockText():string
    {
        return null;
    }

    public unlockButtonText():string
    {
        return null;
    }

    /// <summary>
    /// 初期化する時に呼ばれる。
    /// </summary>
    public onCreate()
    {
    }

    public onInitialize()
    {
        let ecEvents:ECEvent[] = this.getComponentsInChildren(ECEvent);
        for(let i = 0; i< ecEvents.length;i++)
        {
            ecEvents[i].onInitialize();
        }

        if(this.actions != null)
        {
            this.actionData = this.actions.json;
        }
    }

    /// <summary>
    /// 閉じる時に呼ばれる。
    /// </summary>
    public onTerminating()
    {

    }

    public onTerminated()
    {
        if(!this.euthanasia)
        {
            cc.systemEvent.emit(ECEvents.CloseDetail,this);
        }
    }

    public unlock(byCoin:boolean)
    {
        if(this.actionData.length == 0)
        {
            cc.tween(ECGameController.instance.node).call(()=>{ ECGameController.instance.locker.active = true;}).delay(0.5)
            .call(()=>{cc.systemEvent.emit(ECEvents.UnlockDetail, this);}).delay(0.5)
            .call(()=>{ECGameController.instance.locker.active = false;}).start();
            
        }
        else
        {
            ECGameController.instance.excuteActions(this.event,this.actionData);
        }

        if(!byCoin)
        {
            this.clearByUser();
        }
    }

    private clearByUser()
    {

    }

    protected check()
    {
    }
}
