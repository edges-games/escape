import ECDetailEventData from "./ECDetailEventData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECLetterpressDetailEventData extends ECDetailEventData
{
    private renderTexture:cc.RenderTexture = null;
    @property(cc.Vec2) size:cc.Vec2 = cc.Vec2.ZERO;
    @property(cc.Sprite) brush:cc.Sprite = null;
    @property(cc.Sprite) sprite:cc.Sprite = null;
    @property(cc.Sprite) mask:cc.Sprite = null;
    @property(cc.Camera) renderCamera:cc.Camera = null;
    @property(cc.Node) renderNode:cc.Node = null;
    @property renderImageName = "render_image.png";
    onInitialize()
    {
        super.onInitialize();
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
    
        this.renderTexture = new cc.RenderTexture();
        this.renderTexture.initWithSize(cc.winSize.width,cc.winSize.height);
        this.renderCamera.targetTexture = this.renderTexture;
        this.sprite.spriteFrame = new cc.SpriteFrame();
        this.sprite.spriteFrame.setTexture(this.renderTexture);
        this.brush.node.active = false;
        // picture = CCSprite::create("images/scenes/mroom/mroom_bg_message.png");
        // picture->retain();
        
        // ccBlendFunc bf = {GL_ZERO , GL_ONE_MINUS_SRC_ALPHA};
        // picture->setBlendFunc(bf);
        // picture->setPosition(ccp(400,300)/2);
        // this->addChild(picture);
        this.renderCamera.render(this.renderNode);
        
        return true;
    }



onTouchStart(touch)
{
    this.brush.node.active = true;
}

onTouchEnd(touch)
{
    this.brush.node.active = false;
}

onTouchMove(touch:cc.Touch)
{
    let start:cc.Vec2  = this.renderNode.convertToNodeSpaceAR(touch.getLocation());
    let end:cc.Vec2  = this.node.convertToNodeSpaceAR(touch.getPreviousLocation());

    let distance:number = start.sub(end).mag();// ccpDistance(start, end);
    if (distance > 1)
    {
        let d:number = Math.floor(distance);
        for (let i = 0; i < d; i++)
        {
            let difx = end.x - start.x;
            let dify = end.y - start.y;
            let delta = i / distance;
            let y = start.y + (dify * delta);
            
            if(y > 700)
            {
                y = 700;
            }
            this.brush.node.setPosition(start.x + (difx * delta), y);
            this.renderCamera.render(this.renderNode);
        }
    }
}

saveImage()
{
    if (CC_JSB) {
        let data = this.renderTexture.readPixels();
        let width = this.renderTexture.width;
        let height = this.renderTexture.height;
        let filePath = jsb.fileUtils.getWritablePath() + this.renderImageName;
        let success = (jsb as any).saveImageData(data, width, height, filePath);
        if (success) {
            cc.log("save image data success, file: " + filePath);
        }
        else {
            cc.error("save image data failed!");
        }
    }
    else {
        cc.log("saveImage, only supported on native platform.");
    }
}


// This is a temporary solution
filpYImage (data, width, height) {
    // create the data array
    let picData = new Uint8Array(width * height * 4);
    let rowBytes = width * 4;
    for (let row = 0; row < height; row++) {
        let srow = height - 1 - row;
        let start = srow * width * 4;
        let reStart = row * width * 4;
        // save the piexls data
        for (let i = 0; i < rowBytes; i++) {
            picData[reStart + i] = data[start + i];
        }
    }
    return picData;
}
}
