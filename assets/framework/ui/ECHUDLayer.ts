import ECBaseLayer from "./ECBaseLayer";
import { ECEvents } from "../consts/ECConsts";
import ECGameController from "../core/ECGameController";
import ECUIGroup from "./ECUIGroup";
import Native from "../native/ECNative";
import ECCoinEvent from "../components/events/ECCoinEvent";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ECHUDLayer extends ECBaseLayer {

    @property(cc.Node) Coin:cc.Node = null;
    @property(cc.Node) FlashLight:cc.Node = null;
    @property(cc.Node) Map:cc.Node = null;
    @property(cc.Node) Message:cc.Node = null;
    @property(cc.Node) Movie:cc.Node = null;
    @property(cc.Node) MovieX2:cc.Node = null;
    @property(cc.Sprite) bagButton:cc.Sprite = null;
    @property(cc.Node) goBackButton:cc.Node = null;
    @property(cc.SpriteFrame) lightOn = null;
    @property(cc.SpriteFrame) lightOff = null;

    onInitialize()
    {
        cc.systemEvent.on(ECEvents.EquipItem,this.onItemEquip.bind(this));
        cc.systemEvent.on(ECEvents.TakeCoin,this.onTakeCoin.bind(this));
        cc.systemEvent.on(ECEvents.GetFlashLight,()=>{this.FlashLight.active = true});
        cc.systemEvent.on(ECEvents.GetMap,()=>{this.Map.active = true});
        cc.systemEvent.on(ECEvents.GetMessage,()=>{this.Message.active = true});
        cc.systemEvent.on(ECEvents.UpdateItem,this.onUpdateItem.bind(this));
        cc.systemEvent.on(ECEvents.SceneChanged,this.onSceneChanged.bind(this));
        cc.systemEvent.on(ECEvents.HideButton,this.onHideButton.bind(this));
        this.onItemEquip(null);

        this.goBackButton.active = false;
    }

    onHideButton(name:string)
    {
        if(name == "Map")
        {
            this.Map.active = false;
        }
    }

    onSceneChanged()
    {
        if(ECGameController.instance.currentScene.previousScene)
        {
            this.goBackButton.active = true;
        }
        else
        {
            this.goBackButton.active = false;
        }
    }

    onItemEquip(item:string)
    {
        if(ECGameController.instance.currentItem)
        {
            cc.loader.loadRes("items/" + ECGameController.instance.currentItem + "_u",
             cc.SpriteFrame,function (err, spriteFrame) {this.bagButton.spriteFrame = spriteFrame; }.bind(this));
        }
        else
        {
            cc.loader.loadRes("items/btn_item",
             cc.SpriteFrame,function (err, spriteFrame) {this.bagButton.spriteFrame = spriteFrame; }.bind(this));
        }
    }

    onUpdateItem()
    {
        if(!ECGameController.instance.hasFlashLight2())
        {
            cc.systemEvent.emit(ECEvents.SwitchLight, false);
            this.FlashLight.getComponentInChildren(cc.Sprite).spriteFrame = this.lightOff;
        }
    }

    onShowing()
    {
        this.FlashLight.active = ECGameController.instance.hasFlashLight() || ECGameController.instance.hasFlashLight2();
        if(ECGameController.instance.flashLight.Light.active)
        {
            this.FlashLight.getComponentInChildren(cc.Sprite).spriteFrame = this.lightOn;
        }
        else
        {
            this.FlashLight.getComponentInChildren(cc.Sprite).spriteFrame = this.lightOff;
        }

        this.Map.active = ECGameController.instance.hasMap;
        this.Message.active = ECGameController.instance.hasMessage;
        this.onItemEquip(null);
    }

    public show(args:any)
    {
        this.onShowing();
        this.node.active=true;
        this.onShowed();
    }

    public showHint()
    {
        ECUIGroup.instance.showHint();
    }

    public showItemBox()
    {
        ECUIGroup.instance.showItemBox();
    }

    public showShop()
    {
        ECUIGroup.instance.showShop();
    }

    public showMap()
    {
        ECUIGroup.instance.showMap();
    }

    public showMovie()
    {
        Native.showUnityVideoAd((result)=>{if(result == "completed") ECGameController.instance.getCoin(1);});
    }

    public showSetting()
    {
        ECUIGroup.instance.showSetting();
    }

    public showScrap()
    {
        ECUIGroup.instance.showScrap();
    }

    public showChat()
    {
        ECUIGroup.instance.showChat();
    }

    public switchLight()
    {
        if(!ECGameController.instance.hasFlashLight2())
        {
            return;
        }

        cc.systemEvent.emit(ECEvents.SwitchLight, !ECGameController.instance.flashLight.Light.active);
        if(ECGameController.instance.flashLight.Light.active)
        {
            this.FlashLight.getComponentInChildren(cc.Sprite).spriteFrame = this.lightOn;
        }
        else
        {
            this.FlashLight.getComponentInChildren(cc.Sprite).spriteFrame = this.lightOff;
        }
    }

    private onTakeCoin(coinevent:ECCoinEvent)
    {
        let tp = this.Coin.position;
        tp.x -= 20;
        cc.loader.loadRes("particles/coin", function(error,prefab){
            var tap:cc.Node = cc.instantiate(prefab);
            ECUIGroup.instance.node.addChild(tap);
            tap.setPosition(this.node.convertToNodeSpaceAR(coinevent.node.parent.convertToWorldSpaceAR(coinevent.node.position)));

            cc.tween(tap).to(2,
                {
                    position:this.node.convertToNodeSpaceAR(
                    this.Coin.convertToWorldSpaceAR(tp))
                },{ easing: t => t*t }
                ).call(()=>{ECGameController.instance.getCoin(coinevent.coin);}).delay(0.5).call(()=>{tap.destroy();}).start();
        }.bind(this));
    }

    public goBack()
    {
        if(ECGameController.instance.currentScene.previousScene)
        {
            ECGameController.instance.changeScene(ECGameController.instance.currentScene.previousScene,true,null,true);
        }
    }

}
