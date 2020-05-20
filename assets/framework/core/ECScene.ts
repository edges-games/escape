
import ECGameController from "./ECGameController";
import ECEvent from "../components/events/ECEvent";
import { ECEvents } from "../consts/ECConsts";
import ECUtils from "./ECUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECScene extends cc.Component 
{
    @property({type:cc.AudioClip}) music:cc.AudioClip = null;
    public previousScene:string = "";
    private tolerance:cc.Rect = null;
    public previousPosition:cc.Vec2 = null;
    public canBack:boolean = false;
    private touchEvents:any[] = null;
    private lightEvents:any[] = null;
    private beginTouchPoint: cc.Vec2;
    private isMoving = false;
    private backgroundLayer: cc.Node = null;
    private lightOffset = cc.Vec2.ZERO;
    private halfWinSize = null;
    private halfBackgroundSize = null;
    private boundary = null;

    onLoad () 
    {
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);

        cc.view.setResizeCallback(function (params) { this.node.setContentSize(cc.winSize); }.bind(this));
        this.node.setContentSize(cc.winSize);
        this.backgroundLayer = this.node.getChildByName("Background");
        if(this.canBack && this.previousPosition)
        {
            this.backgroundLayer.setPosition(this.previousPosition);
        }

        ECGameController.instance.flashLight.node.setPosition(this.lightOffset);
        ECGameController.instance.lightEventParent.setPosition(this.backgroundLayer.getPosition());
        ECGameController.instance.lightEventParent.destroyAllChildren();
        let lights:cc.Component[]=this.getComponentsInChildren("ECSliverLightEvent");
        for(let i=0;i<lights.length;i++)
        {
            lights[i].node.setParent(ECGameController.instance.lightEventParent);
        }
        if(this.tolerance == null)
        {
            this.tolerance = ECGameController.instance.properties.tolerance;
        }

        this.halfBackgroundSize = cc.size(this.backgroundLayer.getContentSize().width/2, this.backgroundLayer.getContentSize().height/2);
        this.halfWinSize = cc.size(cc.winSize.width/2,cc.winSize.height/2);

        this.boundary = new cc.Rect(
            /* Left */
            this.halfBackgroundSize.width - this.tolerance.x - this.halfWinSize.width,
            /* Up */
            -(this.halfBackgroundSize.height - this.tolerance.y - this.halfWinSize.height),
            /* Right */
            -(this.halfBackgroundSize.width - this.tolerance.width - this.halfWinSize.width),
            /* Bottom */
            this.halfBackgroundSize.height + this.tolerance.height - this.halfWinSize.height
        );

        this.touchEvents = this.node.getComponentsInChildren("ECTouchEvent");
        this.lightEvents = ECGameController.instance.lightEventParent.getComponentsInChildren("ECTouchEvent");
    }

    onDestroy()
    {
        this.node.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.off(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
    }

    initilaizeEvents()
    {
        var events: ECEvent[] = this.node.getComponentsInChildren(ECEvent);
        for(let i=0;i<events.length;i++)
        {
           events[i].onInitialize();
        }
    }

    onSceneStart()
    {
        if(ECGameController.instance.EnableMusic)
        {
            if(ECGameController.instance.globleEventParent.childrenCount == 0)
            ECGameController.instance.audio.playBGM(this.music,3);
        }
    }

    onTouchStart(touch)
    {
        this.isMoving = false;
        this.beginTouchPoint = touch.getLocation();
    }

    onTouchMove(touch)
    {
        if(!this.isMoving && this.beginTouchPoint.sub(touch.getLocation()).mag() < 10)
        {
            return;
        }

        this.isMoving = true;
        
        let diff:cc.Vec2 = touch.getDelta();

        let currentPos = this.backgroundLayer.getPosition();
    
        let moveOffsetY = Math.abs(this.lightOffset.y) < 10;
        let moveOffsetX = Math.abs(this.lightOffset.x) < 10;
        if(!moveOffsetY)
        {
            this.lightOffset.y -= diff.y;
            if(this.lightOffset.y > this.halfWinSize.height - 100)
            {
                if(currentPos.y > 0)
                {
                    this.lightOffset.y = 0;
                    moveOffsetY = true;
                }
                else
                {
                    this.lightOffset.y = this.halfWinSize.height - 100;
                }
            }
    
            if(this.lightOffset.y < -this.halfWinSize.height + 100)
            {
                if(currentPos.y < 0)
                {    
                    this.lightOffset.y = 0;
                    moveOffsetY = true;
                }
                else
                {
                    this.lightOffset.y = -this.halfWinSize.height + 100;
                }
            }
            ECGameController.instance.flashLight.node.setPosition(this.lightOffset);
        }
        if(!moveOffsetX)
        {
            this.lightOffset.x -= diff.x; 
            if(this.lightOffset.x - diff.x > this.halfWinSize.width - 100)
            {
                if(currentPos.x > 0)
                {
                    this.lightOffset.x = 0;
                    moveOffsetX = true;
                }
                else
                {
                    this.lightOffset.x = this.halfWinSize.width - 100;
                }
            }
    
            if(this.lightOffset.x - diff.x < -this.halfWinSize.width + 100)
            {
                if(currentPos.x < 0)
                {    
                    this.lightOffset.x = 0;
                    moveOffsetX = true;
                }
                else
                {
                    this.lightOffset.x = -this.halfWinSize.width + 100;
                }
            }
            ECGameController.instance.flashLight.node.setPosition(this.lightOffset);
        }

        let p = currentPos;
        if(moveOffsetX)
        p.x += diff.x;
        if(moveOffsetY)
        p.y += diff.y;

        // Left
        if(p.x - (this.boundary.x) > 0)
        {
            if(moveOffsetX)
            this.lightOffset.x -= p.x - (this.boundary.x)
            p.x = this.boundary.x;
        }
        // Right
        if(p.x  <  this.boundary.width)
        { 
            if(moveOffsetX)
            this.lightOffset.x += this.boundary.width - p.x
            p.x = this.boundary.width;
        }
        // Bottom
        if(p.y  > (this.boundary.height))
        {
            if(moveOffsetY)
            this.lightOffset.y -= p.y - (this.boundary.height);
            p.y = this.boundary.height;
        }
        // Up
        if(p.y  <  this.boundary.y)
        {
            if(moveOffsetY)
            this.lightOffset.y += this.boundary.y - p.y;
            p.y = this.boundary.y;
        }

        ECGameController.instance.flashLight.node.setPosition(this.lightOffset);
        this.backgroundLayer.setPosition(p);
        ECGameController.instance.lightEventParent.setPosition(p);
    }

    onTouchEnd(touch)
    {
        this.isMoving = false;
        if(this.beginTouchPoint.sub(touch.getLocation()).mag() > 30)
        {
            return;
        }
        
        // タップ範囲は懐中電灯の範囲にあるかどうかをチェックする
        if(ECGameController.instance.flashLight.node.active &&
            ECGameController.instance.flashLight.node.position.sub(
            ECGameController.instance.flashLight.node.parent.convertToNodeSpaceAR(touch.getLocation())
            ).mag() > 220)
        {
            return;
        }

        if(ECGameController.instance.flashLight.Dark.activeInHierarchy)
        {
            if(!ECUtils.touchEvents(this.lightEvents,touch.getLocation()))
            {
                cc.systemEvent.emit(ECEvents.ShowText, ECGameController.instance.properties.textWhenLightOff);
            }
        }
        else
        {
            ECUtils.touchEvents(this.touchEvents,touch.getLocation());
        }
        cc.loader.loadRes("particles/tap", function(error,prefab){
            var tap:cc.Node = cc.instantiate(prefab);
            this.backgroundLayer.addChild(tap);
            tap.setPosition(this.backgroundLayer.convertToNodeSpaceAR(touch.getLocation()));
        }.bind(this));
    }
}
