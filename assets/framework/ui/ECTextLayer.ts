import ECBaseLayer from "./ECBaseLayer";
import { ECEvents } from "../consts/ECConsts";
import ECGameController from "../core/ECGameController";
import ECLocalization from "../core/ECLocalization";
import ECUtils from "../core/ECUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECTextLayer extends ECBaseLayer {

    @property(cc.Sprite) background:cc.Sprite = null;
    @property({type:cc.SpriteFrame}) line1:cc.SpriteFrame = null;
    @property({type:cc.SpriteFrame}) line2:cc.SpriteFrame = null;
    @property(cc.Node) right:cc.Node = null;
    @property(cc.Node) left:cc.Node = null;
    @property(cc.Sprite) face:cc.Sprite = null;
    @property(cc.Label) label:cc.Label = null;
    @property({type:[cc.SpriteFrame]}) faces:cc.SpriteFrame[] = [];
    private colors = {};
    private sounds = {};
    private lastString:string = "";
    private updateColor:boolean = false;
    private currentTween:cc.Tween<unknown> = null;
    private useTypewrite:boolean = false;

    public onInitialize()
    {
        cc.systemEvent.on(ECEvents.ShowText,this.showText.bind(this));
        this.node.active=true;
        this.node.opacity = 0;
        let com = this;

        if((this.label as any)._assembler)
        (
            this.label as any)._assembler._updateContent = function () {
            this._updateFontScale();
            this._computeHorizontalKerningForText();
            this._alignText();
            if(com.updateColor)
            {
                var uintVerts = this._renderData.uintVDatas[0]; if (!uintVerts) return;
                for (let v = 0, c = 0; v < uintVerts.length; v += 20, c++)
                for (var i = this.colorOffset; i < 20; i += this.floatsPerVert) 
                if(com.colors[c]) { uintVerts[v+i] = com.colors[c]; };
            }
        };
        this.label.string = "";
    }

    public show(args:any = null)
    {
        // 何もしません。
    }

    typewrite(text:string, cb) 
    {
        var content = '';
        var arr = text.split('');
        var len = arr.length;
        var step = 0;

        var type= function() {
            content += arr[step];
            this.label.string = content;
            if(this.sounds[step])
            {
                ECGameController.instance.audio.playSoundAsync(this.sounds[step]);
            }
            if (++step == len) {
                this.unschedule(type, this);
                cb && cb();
            }
        }
        this.schedule(type,0.1, cc.macro.REPEAT_FOREVER, 0)
    }

    public showText(key:string)
    {
        if(this.lastString == key) return;
        this.lastString = key;
        this.colors = {};
        this.sounds = {};
        this.updateColor = false;
        this.label.string = "";
        this.node.opacity = 0;
        this.unscheduleAllCallbacks();
        ECUtils.stopTween(this.currentTween);

        var values = key.split(',');
        
        if(values.length == 1)
        {
            let value = this.processValue(ECLocalization.format(values[0]));

            if(!this.useTypewrite)
            {
                for(let s in this.sounds)
                {
                    if(this.sounds[s])
                    {
                        ECGameController.instance.audio.playSoundAsync(this.sounds[s]);
                    }
                }
                this.label.string = value;
                this.currentTween = cc.tween(this.node).call(()=>{this.node.active=true;}).to(0.5,{opacity:255}).
                delay(value.length * 0.1 + 1).to(0.5,{opacity:0}).call(()=>{this.lastString = "";}).start();
            }
            else
            {
                this.currentTween = cc.tween(this.node).call(()=>{this.node.active=true;}).to(0.5,{opacity:255}).call(()=>{this.typewrite(value,null);}
                ).delay(value.length * 0.2 + 1).to(0.5,{opacity:0}).call(()=>{this.lastString = "";}).start();
            }
        }
        else
        {
            let tween = cc.tween(this.node).call(()=>{this.node.active=true;});
            for(let i=0; i<values.length;i++)
            {
                this.colors = {"default" : 4294967295};
                this.sounds = {};
                let content = ECLocalization.format(values[i]);
                if(i == 0)
                {
                    let value = this.processValue(content);
                    if(!this.useTypewrite)
                    {   
                        this.label.string = value;
                    }
                    tween.to(0.5,{opacity:255});
                }
               
                tween.call(()=> 
                {
                    let value = this.processValue(content);
                    if(!this.useTypewrite)
                    {
                        this.label.string = value;
                    }
                    else
                    {
                        this.typewrite(value,null);
                    }
                }).delay(content.length * 0.1 + 1);
            }
            this.currentTween = tween.to(0.5,{opacity:0}).call(()=>{this.lastString = "";}).start();
        }
    }

    processValue(value:string):string
    {
        let line:number = value.split("\n").length;
        this.background.spriteFrame = line == 1 ? this.line1: this.line2;
        this.face.node.active = false;
        if(value.startsWith("@#"))
        {
            this.face.node.active = true;
            let faceid:string = value.substr(2,1);
            if(faceid != "-")
            {
                this.face.node.active = true;
                let face = parseInt(faceid);
                this.face.spriteFrame = this.faces[face];
                let rl:string = value.substr(3,1);

                if(rl == "r")
                {
                    this.face.node.parent = this.right;
                }
                else
                {
                    this.face.node.parent = this.left;
                }
                this.face.node.setPosition(new cc.Vec2(0,this.background.node.height/2+5));
            }

            value = value.substring(4);
        }

        this.useTypewrite = false;
        if(value.startsWith("$$"))
        {
            value = value.substring(2);
            this.useTypewrite = true;
        }

        let colorMatches = value.match(/<color=([0-9A-Fa-f]{6})>([\s\S]*?)<\/color>/ig);
        if(colorMatches)
        {
            this.updateColor = true;
            for (let i = 0; i < colorMatches.length; i++)
            {
                let match = colorMatches[i];
                let index = value.indexOf(match);
                index -= ((value.substr(0,index)).match(/\s/g) || []).length;
                let color = parseInt((match.substring(7,13) + "FF").split("").reverse().join(""), 16);
                let realValue = match.replace(/<[^>]+>/g,"");
                for(let j = index, l = index + realValue.length ; j < l; j++)
                {
                    this.colors[j] = color;
                }
                value = value.replace(match,realValue);
            }
        }

        let soundMatches = value.match(/<sound=[a-z_A-Z/0-9]*\/>/ig);
        if(soundMatches)
        {
            for (let i = 0; i < soundMatches.length; i++)
            {
                let match = soundMatches[i];
                let index = value.indexOf(match);
                index -= ((value.substr(0,index)).match(/\n/g) || []).length;
                this.sounds[index] =  match.substring(7,match.indexOf("/>"));
                let realValue = match.replace(/<[^>]+>/g,"");
                value = value.replace(match,realValue);
            }
        }
        return value
    }
}
