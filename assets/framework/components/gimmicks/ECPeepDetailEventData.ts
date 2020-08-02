import ECDetailEventData from "./ECDetailEventData";
import ECEvent from "../events/ECEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECPeepDetailEventData extends ECDetailEventData
{
    @property(cc.Node) background = null;
    @property(cc.Node) foreground = null;
    private beginTouchPoint: cc.Vec2;
    private isMoving = false;
    private boundary = null;

    onInitialize()
    {
        super.onInitialize();

        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this);

        var events:ECEvent[] = this.node.getComponentsInChildren(ECEvent);
        for(let i=0;i<events.length;i++)
        {
           events[i].onInitialize();
        }

        let halfBackgroundSize = cc.size(this.background.getContentSize().width/2, this.background.getContentSize().height/2);
        let halfWinSize = cc.size(cc.winSize.width/2, this.foreground.getContentSize().height/2);

        this.boundary = new cc.Rect(
            /* Left */
            halfBackgroundSize.width - halfWinSize.width,
            /* Up */
            -(halfBackgroundSize.height - halfWinSize.height),
            /* Right */
            -(halfBackgroundSize.width - halfWinSize.width),
            /* Bottom */
            halfBackgroundSize.height - halfWinSize.height
        );
    }

    onDestroy()
    {
        this.node.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.off(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this);
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
        let currentPos = this.background.getPosition();
        let p = currentPos;
        p.x += diff.x;
        p.y += diff.y;
        // Left
        if(p.x - (this.boundary.x) > 0)
        {
            p.x = this.boundary.x;
        }
        // Right
        if(p.x  <  this.boundary.width)
        { 
            p.x = this.boundary.width;
        }
        // Bottom
        if(p.y  > (this.boundary.height))
        {
            p.y = this.boundary.height;
        }
        // Up
        if(p.y  <  this.boundary.y)
        {
            p.y = this.boundary.y;
        }

        this.background.setPosition(p);
    }

    onTouchEnd(touch)
    {
        this.isMoving = false;
    }
}
