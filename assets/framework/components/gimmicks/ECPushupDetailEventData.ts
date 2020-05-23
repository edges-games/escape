import ECDetailEventData from "./ECDetailEventData";
import ECPushupItem from "./ECPushupItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECPushupDetailEventData extends ECDetailEventData
{
    @property({multiline: true}) question:string = "";
	@property({multiline: true}) answer:string = "";
    @property({type:[cc.SpriteFrame]}) blocks:cc.SpriteFrame[] = [];
    @property(cc.Node) itemParent:cc.Node = null;
	@property  gridX:number = 5;
	@property  gridY:number = 5;
	@property  gridSize:cc.Vec2 = cc.v2(60, 60);
    private  items:ECPushupItem[] = [];
    private  questionData:number[] = [];
    private  answerData:number[] = [];

    onInitialize()
    {
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.questionData = this.question.replace(/\n|\s/g,"").split(",").map((s)=>parseInt(s));
        this.answerData = this.answer.replace(/\n|\s/g,"").split(",").map((s)=>parseInt(s));
        this.itemParent.destroyAllChildren();
        this.items = [];
		let startX = this.gridSize.x * this.gridX /-2 + this.gridSize.x /2;
		let startY = this.gridSize.y * this.gridY /2 - this.gridSize.y /2;

		for(let y = 0; y < this.gridY; y++)
		{
			for(let x = 0; x < this.gridX; x++)
			{
                let item:ECPushupItem = new cc.Node().addComponent(ECPushupItem);
                this.itemParent.addChild(item.node);
				item.node.setPosition(cc.v2(x*this.gridSize.x + startX,-y*this.gridSize.y+startY));
                item.spriteOff = new cc.Node().addComponent(cc.Sprite);
                item.spriteOff.spriteFrame = this.blocks[0];
                item.node.addChild(item.spriteOff.node);
                item.spriteOn = new cc.Node().addComponent(cc.Sprite);
                item.node.addChild(item.spriteOn.node);
                item.spriteOn.spriteFrame = this.blocks[1];
				item.isOn = this.questionData[item.y * this.gridX + item.x] == 1;
				item.x = x;
				item.y = y;
                this.items.push(item);
			}
		}

        for(let i=0;i<this.items.length;i++)
		{
            let item:ECPushupItem = this.items[i];
            if(this.answerData[item.y * this.gridX + item.x] == 1)
            {
                item.isOn = true;
            }
        }
	}

    onTouchStart(touch)
    {
		if(this.isCompleted) return;
		for (let i=0;i<this.items.length;i++)
		{
			let item:ECPushupItem = this.items[i];

			if(item != null)
			{
				let locationInNode:cc.Vec2 = item.node.convertToNodeSpaceAR(touch.getLocation());
				let rect:cc.Rect = item.spriteOff.node.getBoundingBox();
				
				if (rect.contains(locationInNode))
				{
					this.TapLight(item);
					return;
				}
			}
		}
    }
    
    onDestroy()
    {
        this.node.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
    }

    public TapLight( item:ECPushupItem)
	{
        this.ChangeLightState(item);


        this.Check();
        if(this.isCompleted)
        {
            this.unlock(false);
        }
	}

    public  ChangeLightState(item:ECPushupItem)
    {
        item.isOn = !item.isOn;

        this.ChangeSiblingLight(item.x + 1, item.y);
        this.ChangeSiblingLight(item.x - 1 ,  item.y);
        this.ChangeSiblingLight(item.x, item.y + 1);
        this.ChangeSiblingLight(item.x, item.y - 1);
    }

	public ChangeSiblingLight( x, y)
	{
		if(x >= 0 && x < this.gridX && y >= 0 && y < this.gridY)
		{
            let i = this.convertIndex(y,x);
            this.items[i].isOn = !this.items[i].isOn;
		}
	}

    public Check()
	{
        let allRight:boolean = true;
        for(let i=0;i<this.items.length;i++)
		{
            let item:ECPushupItem = this.items[i];
            if(this.answerData[item.y * this.gridX + item.y] == 1)
			{
                if(!item.isOn)
                {
				    return;
                }
			}
            else
            {
                if(item.isOn)
                {
                    return;
                }
            }
        }
        if(allRight)
        {
            this.isCompleted = true;
        }
	}

    convertIndex(y,x):number
    {
        return x % this.gridX + y * this.gridY;
    }
}
