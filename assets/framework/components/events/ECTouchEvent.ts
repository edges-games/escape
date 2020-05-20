import ECEvent from "./ECEvent";
import ECGameController from "../../core/ECGameController";
import { ECFlagStatus, ECEvents } from "../../consts/ECConsts";

const {ccclass,property} = cc._decorator;

@ccclass
export default class ECTouchEvent extends ECEvent
{
    public colliders:cc.Collider[] = [];
    public touchCount:number = 0;
    @property(cc.String) needItem:string = "";
    @property(cc.String) itemError:string = "";
    @property expendItem:boolean = false;
    @property({type:cc.AudioClip}) sound:cc.AudioClip = null;
    
    onLoad()
    {
        super.onLoad();
        
        let boxColliders = this.getComponents(cc.BoxCollider);
        for(let i=0;i<boxColliders.length;i++)
        {
            this.colliders.push(boxColliders[i]);
        }

        let polygonColliders = this.getComponents(cc.PolygonCollider);
        for(let i=0;i<polygonColliders.length;i++)
        {
            this.colliders.push(polygonColliders[i]);
        }
    }

    protected canTouch()
    {
        if(this.flag && ECGameController.instance.getFlagStatus(this.flag) != ECFlagStatus.Start) return false;
        return true;
    }

    public onTouched():boolean
    {
        if(!this.flag) return true;

        if(!this.checkItem())
        {
            return true;
        }

        this.playSound();

        this.setFlagStatus(this.flag,this.completeHidden? ECFlagStatus.CompleteHidden: ECFlagStatus.Complete);
        return true;
    }

    protected checkItem()
    {
        if(this.needItem != "" && this.needItem != ECGameController.instance.currentItem)
        {
            if(this.itemError)
            {
                cc.systemEvent.emit(ECEvents.ShowText,this.itemError);
            }
            return false;
        } 
        else
        {
            if(this.expendItem)
            {
                ECGameController.instance.expendItem(this.needItem);
            }
        }
        return true;
    }

    protected playSound(audioClip:cc.AudioClip = null)
    {
        if(audioClip===null)
        {
            audioClip = this.sound;
        }
        if(audioClip && this.actionData.length == 0)
        {
            ECGameController.instance.audio.playSound(audioClip);
        }
    }
}
