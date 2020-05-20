import ECBaseLayer from "./ECBaseLayer";
import { ECEvents, ECFlagStatus } from "../consts/ECConsts";
import ECGameController from "../core/ECGameController";
import ECEvent from "../components/events/ECEvent";
import ECGotoEvent from "../components/events/ECGotoEvent";
import ECLockEvent from "../components/events/ECLockEvent";
import ECTouchEvent from "../components/events/ECTouchEvent";
import ECUtils from "../core/ECUtils";
import ECUIGroup from "./ECUIGroup";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECMapLayer extends ECBaseLayer {
    
    @property(cc.Node) map:cc.Node = null;
    @property(cc.Node) mark:cc.Node = null;
    @property(cc.Sprite) bagButton:cc.Sprite = null;
    
    beginTouchPoint: cc.Vec2;
    canTouch:boolean;

    onInitialize()
    {
        //监听触摸开始事件
        this.mark.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        //监听触摸移动事件
        this.mark.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        //监听作用域内触摸抬起事件
        this.mark.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        cc.systemEvent.on(ECEvents.EquipItem,this.onItemEquip.bind(this));
        this.onItemEquip(null);
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

    onShowing()
    {
        var events: ECEvent[] = this.mark.getComponentsInChildren(ECEvent);
        for(let i=0;i<events.length;i++)
        {
            let e = events[i];
            if(!e.flag) continue;

            var status = ECGameController.instance.getFlagStatus(e.flag);
            if(status == ECFlagStatus.Stay || status == ECFlagStatus.CompleteHidden)
            {
                e.node.active = false;
            }
            else if(status == ECFlagStatus.Start || status == ECFlagStatus.Complete)
            {
                e.node.active = true;
            }
        }
        this.onItemEquip(null);
    }

    onTouchStart(touch)
    {
        this.beginTouchPoint = touch.getLocation();
    }

    onTouchMove(touch)
    {
        if(this.beginTouchPoint.sub(touch.getLocation()).mag() < 10)
        {
            return;
        }
        
        var diff = touch.getDelta();
        var backgroundLayer: cc.Node = this.map;
        
        var currentPos = backgroundLayer.getPosition();
        
        var p = currentPos.add(diff);
        var size = cc.size(backgroundLayer.getContentSize().width/2, backgroundLayer.getContentSize().height/2);
        var ss = cc.size(this.mark.getContentSize().width/2, this.mark.getContentSize().height/2);
    
        if(p.x - (size.width - ss.width) > 0)
        {
            p.x = size.width - ss.width;
        }

        if(p.x  <  -(size.width - ss.width))
        { 
            p.x = -(size.width - ss.width);
        }
    
        p.y = 0;
        
        backgroundLayer.setPosition(p);
    
    }

    onTouchEnd(touch)
    {
        if(this.beginTouchPoint.sub(touch.getLocation()).mag() > 30)
        {
            return;
        }

        let event:ECGotoEvent = ECUtils.touchEvents(this.mark.getComponentsInChildren(ECTouchEvent),touch.getLocation()) as ECGotoEvent;
        if(event)
        {
            if(event instanceof ECLockEvent)
            {
                return;
            }
            cc.tween(this.node).delay(1).call(()=>{this.hide();}).start();
        }

    }

    showItemBox()
    {
        ECUIGroup.instance.showItemBox();
    }
}
