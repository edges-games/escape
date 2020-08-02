import ECUIGroup from "./ECUIGroup";
import ECLocalization from "../core/ECLocalization";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECChatItem extends cc.Component {

    @property isAlignRight: boolean = false;
    @property(cc.Widget) right:cc.Widget = null;
    @property(cc.Widget) left:cc.Widget = null;
    @property(cc.Node) leftText:cc.Node = null;
    @property(cc.Sprite) leftSprite:cc.Sprite = null;
    @property(cc.Node) rightText:cc.Node = null;
    @property(cc.Sprite) rightSprite:cc.Sprite = null;

    private text:cc.Node = null;
    private sprite:cc.Sprite = null;

    format(json)
    {

        this.right.target = ECUIGroup.instance.Canvas.node;
        this.left.target = ECUIGroup.instance.Canvas.node;
        if(this.isAlignRight)
        {
            this.text = this.rightText;
            this.sprite = this.rightSprite;

            this.right.node.active = true;
            this.left.node.active = false;

        }
        else
        {
            this.text = this.leftText;
            this.sprite = this.leftSprite;

            this.right.node.active = false;
            this.left.node.active = true;
        }

        if(json["Type"] == "Text")
        {
            this.showText(ECLocalization.format(json["Value"]));
        }
        else
        {
            this.showImage(json);
        }

        this.node.setContentSize(0, json["Height"]);
    }

    showText(text:string)
    {
        this.text.active = true;
        this.sprite.node.active = false;
        this.text.getComponentInChildren(cc.Label).string = text;
        this.text.setContentSize(300, 50 + ((text.split("\n").length - 1) * 25));
    }

    showImage(json:any)
    {
        this.text.active = false;
        this.sprite.node.active = true;
        let self = this;
        cc.resources.load(json["Value"],cc.SpriteFrame,function(error,sprteFrame:cc.SpriteFrame)
        {
            self.sprite.spriteFrame = sprteFrame;

            let components:any = json["Components"];
            if(components)
            {
                for(let c = 0; c < components.length; c++)
                {
                    let component = components[c];
                    if(component)
                    {
                        let e = self.sprite.addComponent(component["Type"]);
                        self.setParams(e,component["Params"]);

                        if(component["Type"] == "ECTextEvent")
                        {
                            let box = self.sprite.addComponent(cc.BoxCollider);
                            box.size = self.sprite.spriteFrame.getOriginalSize();
                            box.offset = new cc.Vec2(box.size.width / 2 , box.size.height / -2);
                        }
                    }
                }
            }
        });
    }

    setParams(component:any, params:any)
    {
        for(let key in params)
        {
            component[key] = params[key];
        }
    }
}
