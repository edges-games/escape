import SaveDataLayer from "./SaveDataLayer";
import StorageLayer from "./StorageLayer";
import ECGameController from "../../framework/core/ECGameController";
import ECLocalization from "../../framework/core/ECLocalization";
import { ECStrings, ECEvents, ECFlagStatus, ECSaveKeys } from "../../framework/consts/ECConsts";
import ECUIGroup from "../../framework/ui/ECUIGroup";
import ECNative from "../../framework/native/ECNative";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DebugerLayer extends cc.Component {

    @property(cc.EditBox) editBox:cc.EditBox = null;
    @property(cc.Label) response:cc.Label = null;
    private isShowinfo= false;

    close()
    {
        this.node.destroy();
    }

    item()
    {
        for(let item in ECGameController.instance.master.items)
        {
            ECGameController.instance.items.push(item);
        }
        ECGameController.instance.saveItem();
    }

    scrap()
    {
        for(let s in ECGameController.instance.master.scraps)
        {
            ECGameController.instance.setFlagStatus(ECGameController.instance.master.scraps[s].flag,ECFlagStatus.Start,true,true);
        }
    }

    coin()
    {
        ECGameController.instance.getCoin(10);
    }

    showinfo()
    {
        this.isShowinfo = !this.isShowinfo;
        cc.debug.setDisplayStats(this.isShowinfo);
    }

    showpolygon()
    {
        cc.director.getCollisionManager().enabledDebugDraw = !cc.director.getCollisionManager().enabledDebugDraw;
    }

    initNative()
    {
        ECNative.cooperate(JSON.stringify(ECGameController.instance.properties.naitve.json));
    }

    review()
    {
        ECNative.goReview(ECLocalization.format(ECStrings.LK_REVIEW_DIALOG_TITLE),ECLocalization.format(ECStrings.LK_REVIEW_DIALOG_CONTENT));
    }

    share()
    {
        ECNative.shareMessage(ECLocalization.format(ECStrings.LK_SHARE), ECLocalization.format(ECStrings.LK_SHARE_MESSAGE));
    }

    showVideo()
    {
        ECNative.showUnityVideoAd((result)=>{this.response.string = result});
    }

    vibrate()
    {
        ECNative.vibrate(1000);
    }

    querySkuDetails()
    {
        ECNative.querySkuDetails("");
    }

    querySkuPrice()
    {
        ECNative.querySkuPrice(this.editBox.string,"buy");
    }

    launchBillingFlow()
    {
        ECNative.launchBillingFlow(this.editBox.string);
    }

    records()
    {
        cc.resources.load("debuger/records",cc.Prefab,(error,prefab:cc.Prefab)=>{
            let node: cc.Node = cc.instantiate(prefab);
            this.node.addChild(node);
            node.getComponent(SaveDataLayer).onShowing();
            node.setPosition(cc.Vec2.ZERO);
         })
    }

    storage()
    {
        cc.resources.load("debuger/storage",cc.Prefab,(error,prefab:cc.Prefab)=>{
            let node: cc.Node = cc.instantiate(prefab);
            this.node.addChild(node);
            node.getComponent(StorageLayer).onShowing();
            node.setPosition(cc.Vec2.ZERO);
         })
    }

    debugScene()
    {
        ECGameController.instance.clearSaveData([ECSaveKeys.EnableSound,ECSaveKeys.EnableMusic,ECSaveKeys.EnableVibration]);
        ECGameController.instance.master.loadFlags();
        ECGameController.instance.loadSaveData();
        ECGameController.instance.items.push("item_flashlight2");
        cc.systemEvent.emit(ECEvents.GetMap);
        cc.systemEvent.emit(ECEvents.GetFlashLight);
        ECGameController.instance.changeScene(this.editBox.string,false,()=>{      
            ECUIGroup.instance.hideStandup();
            ECUIGroup.instance.showHUD()});
            this.close();
            ECUIGroup.instance.hideSetting();
    }

    showAdmobBanner()
    {
        ECNative.showAdmobBanner();
    }

    hideAdmobBanner()
    {
        ECNative.hideAdmobBanner();
    }

    showAdmobInterstitial()
    {
        ECNative.showAdmobInterstitial();
    }
}
