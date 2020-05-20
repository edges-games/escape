import ECDetailEventData from "./ECDetailEventData";
import ECPasswordDetailWord from "./ECPasswordDetailWord";
import ECGameController from "../../core/ECGameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECPasswordDetailEventData extends ECDetailEventData
{
    @property([cc.Integer]) passwords:number[] = [];
    @property([cc.Integer]) defaults:number[] = [];
    @property([cc.SpriteFrame]) wordSprites:cc.SpriteFrame[] = [];
    @property([ECPasswordDetailWord]) rocks:ECPasswordDetailWord[] = [];
    @property(cc.Integer) lineSpace:number = 50;
    @property({type:cc.AudioClip}) clickSound:cc.AudioClip = null;

    public isCompleted:boolean = false;
    public wordPositions:cc.Node[] = [];

    public onTouchWord(event, customEventData, playSound=true)
    {
        if(this.isCompleted) return;

        let rock:ECPasswordDetailWord = this.rocks[parseInt(customEventData)];
        let value = rock.value;
        if(value == this.wordSprites.length - 1)
        {
            value = 0;
            rock.sprites.y = 0;
            rock.value = 0;
        }
        else
        {
            value += 1;
            rock.value = value;
        }

        rock.sprites.y = rock.value * this.lineSpace;

        if(!this.check() && playSound)
        {
            if(this.clickSound)
            {
                ECGameController.instance.audio.playSound(this.clickSound);
            }
        }
    }

    protected check()
    {
        let allRight:boolean = true;

        for (let i = 0; i < this.rocks.length; i++) {
            let w:number = this.rocks[i].value;
            if(w != this.passwords[i])
            {
                allRight = false;
                break;
            }
        }

        if(allRight)
        {
            this.unlock(false);
            this.isCompleted = true;
        }
        return allRight;
    }

    public onInitialize()
    {
        super.onInitialize();
        for(let i = 0; i< this.rocks.length ;i++)
        {
            let rock:ECPasswordDetailWord = this.rocks[i];
            rock.node.destroyAllChildren();
            rock.index = i;
            rock.value = 0;
            rock.sprites = new cc.Node();
            rock.node.addChild(rock.sprites);
            rock.sprites.y = 0;
            let button:cc.Button = rock.addComponent(cc.Button);
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "ECPasswordDetailEventData";
            clickEventHandler.handler = "onTouchWord";
            clickEventHandler.customEventData = `${i}`;
            button.clickEvents.push(clickEventHandler);
            for(let j=0;j<this.wordSprites.length;j++)
            {
               let sprite:cc.Sprite = new cc.Node().addComponent(cc.Sprite);
               sprite.spriteFrame = this.wordSprites[j];
               
               rock.sprites.addChild(sprite.node);
               sprite.node.y = j * -this.lineSpace;
            }
        }
        this.isCompleted = false;

        for(let i=0;i<this.defaults.length;i++)
        {
            this.rocks[i].value = this.defaults[i];
            this.rocks[i].sprites.y = this.rocks[i].value * this.lineSpace;
        }
    }
}
