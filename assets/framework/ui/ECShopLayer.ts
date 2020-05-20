import ECBaseLayer from "./ECBaseLayer";
import Native from "../native/ECNative";
import ECUIGroup from "./ECUIGroup";

const {ccclass} = cc._decorator;

@ccclass
export default class ECShopLayer extends ECBaseLayer 
{
    public buyCoin(event:any, customData:string)
    {
        Native.launchBillingFlow(customData);
    }

    public showMovie()
    {
        ECUIGroup.instance.showMovie();
    }
}
