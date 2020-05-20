const {ccclass, property} = cc._decorator;

@ccclass
export default class ECProperties extends cc.Component 
{
    @property(cc.JsonAsset) config:cc.JsonAsset = null;
    @property(cc.Rect) tolerance:cc.Rect = cc.rect(0,0,0,0);
    @property itemFlashLight:string = "item_flashlight";
    @property itemFlashLight2:string = "item_flashlight2";
    @property textWhenLightOff:string = "LK_COMMON_01";
    @property updateCoinSound:string = "audios/se/se_getmoney";
    @property([cc.String]) saveKeys:string[] = [];
    @property(cc.JsonAsset) retains:cc.JsonAsset = null;
    public retainSaveKeys:string[] = [];
    @property startScene:string = "";

    onLoad()
    {
        this.retainSaveKeys = this.retains.json;
    }
}
