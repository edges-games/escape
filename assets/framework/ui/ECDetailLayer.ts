import ECBaseLayer from "./ECBaseLayer";
import { ECEvents, ECStrings, ECFlagStatus } from "../consts/ECConsts";
import ECGameController from "../core/ECGameController";
import ECDetailEvent from "../components/events/ECDetailEvent";
import ECLocalization from "../core/ECLocalization";
import ECEvent from "../components/events/ECEvent";
import ECTouchEvent from "../components/events/ECTouchEvent";
import ECUIGroup from "./ECUIGroup";
import ECNative from "../native/ECNative";
import ECUtils from "../core/ECUtils";
import ECDetailEventData from "../components/gimmicks/ECDetailEventData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DetailLayer extends ECBaseLayer 
{
    @property(cc.Node) content:cc.Node = null;
    @property(cc.Node) unlockButton:cc.Node = null;
    @property(cc.Node) movieButton:cc.Node = null;
    @property(cc.Label) unlockPrice:cc.Label = null;
    @property(cc.Sprite) bagButton:cc.Sprite = null;
    currentDetail:ECDetailEventData = null;
    beginTouchPoint: cc.Vec2;
    
    onInitialize()
    {
        cc.systemEvent.on(ECEvents.ShowDetail,this.onShowDetail.bind(this));
        cc.systemEvent.on(ECEvents.GotoDetail,this.onGotoDetal.bind(this));
        cc.systemEvent.on(ECEvents.UnlockDetail,this.onUnlockDetal.bind(this));
        cc.systemEvent.on(ECEvents.EquipItem,this.onItemEquip.bind(this));
        this.content.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.content.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.onItemEquip(null);
        this.content.destroyAllChildren();
    }

    onItemEquip(item:string)
    {
        if(ECGameController.instance.currentItem)
        {
            cc.resources.load("items/" + ECGameController.instance.currentItem + "_u",
             cc.SpriteFrame,function (err, spriteFrame) {this.bagButton.spriteFrame = spriteFrame; }.bind(this));
        }
        else
        {
            cc.resources.load("items/btn_item",
             cc.SpriteFrame,function (err, spriteFrame) {this.bagButton.spriteFrame = spriteFrame; }.bind(this));
        }
    }

    onShowDetail (detalPrefab:cc.Prefab,event:ECDetailEvent,nonAnim:boolean)
    {
        this.onItemEquip(null);
        this.content.removeAllChildren();
        let detail = cc.instantiate(detalPrefab);
        this.currentDetail = detail.getComponent(ECDetailEventData);
        this.currentDetail.event = event;
        this.currentDetail.onInitialize();
        this.unlockButton.active = this.currentDetail.price > 0;
        if(this.unlockButton.active)
        {
            this.unlockPrice.string = ECLocalization.format(ECStrings.LK_COIN_UNLOCK_PUZZLLE, this.currentDetail.price);
        }
        this.movieButton.active = this.currentDetail.hint != "";
        this.content.addChild(detail);
        detail.position = cc.Vec3.ZERO;
        if(!nonAnim && !this.node.active)
        {
            this.node.opacity = 0;
            cc.tween(this.node).call(()=>{this.node.active=true;}).to(0.2,{opacity:255}).start();
        }
    }

    onGotoDetal(index) 
    {
        this.onShowDetail(this.currentDetail.event.detailPrefabs[index],this.currentDetail.event,true);
    }

    onTouchStart(touch)
    {
        this.beginTouchPoint = touch.getLocation();
    }

    onTouchEnd(touch)
    {
        if(this.beginTouchPoint.sub(touch.getLocation()).mag() > 30)
        {
            return;
        }
        let ecevent:ECEvent = ECUtils.touchEvents(this.content.getComponentsInChildren(ECTouchEvent),touch.getLocation());

        if(ecevent && ecevent.skipEffect)
        {
            return;
        }
        cc.resources.load("particles/tap", function(error,prefab){
            var tap:cc.Node = cc.instantiate(prefab);
            this.node.addChild(tap);
            tap.setPosition(this.content.convertToNodeSpaceAR(touch.getLocation()));
        }.bind(this));
    }

    movie()
    {
        ECNative.showUnityVideoAd((result)=>{if(result == "completed"){
            ECGameController.instance.setFlagStatus(this.currentDetail.hint,ECFlagStatus.Complete,false,true);
            ECUIGroup.instance.showHintDetal({flag:this.currentDetail.hint});
        }});
    }

    unlock()
    {
        if(this.currentDetail.price <= ECGameController.instance.coin)
            {
                ECUIGroup.instance.showMessage(["",ECLocalization.format(ECStrings.LK_DO_YOU_UNLOCK_PUZZLE,this.currentDetail.price),1,
                    function(button)
                    {
                        if(button == "Yes")
                        {
                            ECGameController.instance.useCoin(this.currentDetail.price);
                            this.currentDetail.unlock(true);
                        }
                    }.bind(this)
                ]);
            }
            else
            {
                ECUIGroup.instance.showMessage(["",ECLocalization.format(ECStrings.LK_BUY_COIN),1,
                    function(button)
                    {
                        if(button == "Yes")
                        {
                            ECUIGroup.instance.showShop();
                        }
                    }.bind(this)
                ]);
            }
        
    }

    onUnlockDetal(detail)
    {
        this.hide();
    }

    onHidden()
    {
        super.onHidden();
        this.content.destroyAllChildren();
    }

    public hide()
    {
        if(this.currentDetail.onClose)
        {
            if(this.currentDetail.onClose.target.getComponent(
                (this.currentDetail.onClose as any)._componentName)[this.currentDetail.onClose.handler](this.currentDetail.onClose.customEventData))
            {
                return true;
            }
        }

        super.hide();
    }

    showHint()
    {
        ECUIGroup.instance.showHint();
    }

    showItemBox()
    {
        ECUIGroup.instance.showItemBox();
    }

    showShop()
    {
        ECUIGroup.instance.showShop();
    }

    showScrap()
    {
        ECUIGroup.instance.showScrap();
    }
}
