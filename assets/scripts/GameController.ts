import ECGameController from "../framework/core/ECGameController";
import Native from "../framework/native/ECNative";
import ECUIGroup from "../framework/ui/ECUIGroup";

const {ccclass, property} = cc._decorator;


@ccclass
export default class GameController extends ECGameController 
{
    @property(ECUIGroup) uigroup:ECUIGroup = null;

    onLoad ()
    {
        Native.InAppPurchaseFinished = (result,sku)=>{
            if(result == "completed")
            {
                ECGameController.instance.getCoin(parseInt(sku.replace("coin","")));
            }
        }
        Native.cooperate(JSON.stringify(this.properties.naitve.json));
        super.onLoad();
        this.uigroup.onInitialize();
        this.uigroup.showStandup();
    }
}
