import ECTouchEvent from "./ECTouchEvent";
import { ECEvents, ECFlagStatus} from "../../consts/ECConsts";
import ECGameController from "../../core/ECGameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECDetailEvent extends ECTouchEvent
{
    @property({type:[cc.Prefab]}) detailPrefabs:cc.Prefab[] = [];
    @property({type:[cc.String]}) flags:string[] = [];

    public onTouched():boolean
    {
        if(!this.canTouch()) return false;

        if(this.flags.length == 0)
        {
            cc.systemEvent.emit(ECEvents.ShowDetail,this.detailPrefabs[0],this,false);
        }

        for(let i=0;i<this.flags.length;i++)
        {
            if(this.getFlagStatus(this.flags[i]) == ECFlagStatus.Start)
            {
                cc.systemEvent.emit(ECEvents.ShowDetail, this.detailPrefabs[i], this,false);
                break;
            }
        }
        

        return true;
    }
}
