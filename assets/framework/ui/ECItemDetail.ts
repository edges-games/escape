import ECUtils from "../core/ECUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECItemDetail extends cc.Component {
    @property(cc.Label) desc:cc.Label = null;
    @property(cc.Label) text:cc.Label = null;

    @property(cc.Node) private sprites:cc.Node = null;
    @property(cc.Sprite) private frontSprite:cc.Sprite = null;
    @property(cc.Sprite) private backSprite:cc.Sprite = null;
    @property(cc.Sprite) targetSprite:cc.Sprite = null;
    public useItemCamera:boolean = false;
    private canRotate:boolean = true;
    private rotating:boolean = false;
    private beginTouchPoint:cc.Vec2;
    private beginY:number = 0;
    private currentTween:cc.Tween<unknown> = null;
    initialize()
    {
        if(this.useItemCamera)
        {
            let renderCamera:cc.Camera = this.getComponentInChildren(cc.Camera);
            let texture:cc.RenderTexture = new cc.RenderTexture();
            texture.initWithSize(260,260);
            renderCamera.targetTexture = texture;
    
            let spriteFrame = new cc.SpriteFrame();
            spriteFrame.setTexture(texture);
            this.targetSprite.spriteFrame = spriteFrame;
            this.backSprite.node.active = false;

            this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
            this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
            this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this);
        }
        else
        {
            this.text.fontSize = 20;
            this.getComponentInChildren(cc.Camera).node.active = false;
        }
    }

    onDestroy()
    {
        if(this.useItemCamera)
        {
            this.node.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
            this.node.off(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
            this.node.off(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this);
        }
    }


    onTouchStart(touch)
    {
        if(!this.canRotate) return;
        this.rotating = false;
        this.beginY = this.sprites.eulerAngles.y;
        this.beginTouchPoint = touch.getLocation();
    }

    onTouchMove(touch)
    {
        if(!this.canRotate) return;
        if(this.beginTouchPoint.sub(touch.getLocation()).mag() < 10)
        {
            if(!this.rotating)
            return;
        }
        this.rotating = true;
        this.sprites.eulerAngles = new cc.Vec3(0,  this.beginY + (touch.getLocation().x - this.beginTouchPoint.x),0);
    }

    update(dt)
    {
        if(this.useItemCamera)
        {
            this.backSprite.node.active = this.sprites.eulerAngles.y >= 90 || this.sprites.eulerAngles.y <= -90;
        }
    }

    onTouchEnd(touch)
    {
        if(!this.canRotate) return;
        let y = this.sprites.eulerAngles.y <= -90 ? -180 : this.sprites.eulerAngles.y >= 90 ? 180 : 0;
        ECUtils.stopTween(this.currentTween);
        this.canRotate = false;
        this.currentTween = cc.tween(this.sprites).to(0.2,{eulerAngles: new cc.Vec3(0,y,0)
            }).call(()=>{this.backSprite.node.active = y >= 90 || y <= -90;this.canRotate = true;})
            .start();
    }

    setSpriteTexture(texture:cc.SpriteFrame)
    {
        if(this.useItemCamera)
        {
            if(this.frontSprite)
            this.frontSprite.spriteFrame = texture;
        }
        else
        {
            if(this.targetSprite)
            this.targetSprite.spriteFrame = texture;
        }
    }
}
