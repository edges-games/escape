import ECDetailEventData from "./ECDetailEventData";
import ECPipeItem, { PipeDetailEventItemTypes } from "./ECPipeItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECPipeDetailEventData extends ECDetailEventData {

    @property({multiline: true}) question:string = "";
    @property({type:[cc.SpriteFrame]}) blocks:cc.SpriteFrame[] = [];
    @property(cc.Node) itemParent:cc.Node = null;
    
    private  gridX:number = 8;
    private  gridY:number = 8;
    private  space:number = 0;
    private  startX:number = 0;
    private  startY:number = 0;
    private  gridSize:number = 50;

    private  startItem:ECPipeItem;
    private  items:ECPipeItem[];
    
    private  questionData:number[];

    onInitialize()
    {
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.startItem = null;
        this.startX = (this.gridSize * this.gridX + this.space * (this.gridX -1)) /-2 + this.gridSize /2;
        this.startY = (this.gridSize * this.gridY + this.space * (this.gridY -1)) /-2 + this.gridSize /2;
        this.items = [];
        this.questionData = this.question.replace(/\n/g,"").split(",").map((s)=>parseInt(s));

        for(let y = 0; y < this.gridY; y++)
        {
            for(let x = 0; x < this.gridX; x++)
            {
                let pipeItem:ECPipeItem = new cc.Node().addComponent(ECPipeItem);
                pipeItem.x = x;
                pipeItem.y = y;
                pipeItem.sprite = new cc.Node().addComponent(cc.Sprite);
                pipeItem.node.addChild(pipeItem.sprite.node);
                pipeItem.detail = this;
                this.itemParent.addChild(pipeItem.node);
             
                pipeItem.type = this.questionData[this.gridX * y + x];
                if(pipeItem.type == PipeDetailEventItemTypes.End)
                {
                    if(y == 0)
                    {
                        pipeItem.sprite.node.angle = 90;
                    }
                    else if(y == this.gridY - 1)
                    {
                        pipeItem.sprite.node.angle = 270
                    }
                }
                pipeItem.node.setPosition(cc.v2((x * this.gridSize) + this.startX,-(y * this.gridSize) - this.startY));
                this.items.push(pipeItem);

                if(pipeItem.type == PipeDetailEventItemTypes.Start)
                {
                    this.startItem = pipeItem;
                }

                pipeItem.initialize();
            }
        }

        this.linkItems();
    }

    onDestroy()
    {
        this.node.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
    }

    onTouchStart(touch)
    {
		if(this.isCompleted) return;
		for (let i=0;i<this.items.length;i++)
		{
			let item:ECPipeItem = this.items[i];

			if(item != null)
			{
				let locationInNode:cc.Vec2 = item.node.convertToNodeSpaceAR(touch.getLocation());
				let rect:cc.Rect = item.sprite.node.getBoundingBox();
				
				if (rect.contains(locationInNode))
				{
					this.Rotate(item);
					return;
				}
			}
		}
    }

    public linkItems()
    {
        for(let i=0;i<this.items.length;i++)
        {
            this.items[i].setLinkFlag(false);
        }
            
        this.FindLinkItem(this.startItem,[]);

        for(let i=0;i<this.items.length;i++)
        {
            this.items[i].updateSprite();
        }
    }

    public  FindLinkItem( item:ECPipeItem,  checkeditems:ECPipeItem[])
    {
        if(checkeditems.includes(item))
        {
            return;
        }

        checkeditems.push(item);

        if(item.type == PipeDetailEventItemTypes.Start ||
            item.type == PipeDetailEventItemTypes.LeftRight ||
            item.type == PipeDetailEventItemTypes.RightDown ||
            item.type == PipeDetailEventItemTypes.UpRight ||
            item.type == PipeDetailEventItemTypes.UpRightDown ||
            item.type == PipeDetailEventItemTypes.RightDownLeft ||
            item.type == PipeDetailEventItemTypes.LeftUpRight
        )
        {
            if(this.isValidItem(item.x + 1 ,item.y))
            {
                let pipeItem:ECPipeItem = this.items[item.y * this.gridX + item.x + 1];

                if(pipeItem.type == PipeDetailEventItemTypes.End || 
                    pipeItem.type == PipeDetailEventItemTypes.LeftUp || 
                    pipeItem.type == PipeDetailEventItemTypes.LeftRight ||
                    pipeItem.type == PipeDetailEventItemTypes.DownLeft ||
                    pipeItem.type == PipeDetailEventItemTypes.LeftUpRight ||
                    pipeItem.type == PipeDetailEventItemTypes.RightDownLeft ||
                    pipeItem.type == PipeDetailEventItemTypes.DownLeftUp
                )
                {
                    pipeItem.setLinkFlag(true);
                    this.FindLinkItem(pipeItem,checkeditems);
                }
            }
        }

        if(item.type == PipeDetailEventItemTypes.UpDown || 
            item.type == PipeDetailEventItemTypes.DownLeft || 
            item.type == PipeDetailEventItemTypes.RightDown ||
        
            item.type == PipeDetailEventItemTypes.UpRightDown ||
            item.type == PipeDetailEventItemTypes.RightDownLeft ||
            item.type == PipeDetailEventItemTypes.DownLeftUp
        
        
        )
        {
            if(this.isValidItem(item.x ,item.y + 1))
            {
                let pipeItem:ECPipeItem = this.items[(item.y + 1) * this.gridX + item.x];

                if(pipeItem.type == PipeDetailEventItemTypes.End || 
                    pipeItem.type == PipeDetailEventItemTypes.UpDown || 
                    pipeItem.type == PipeDetailEventItemTypes.UpRight || 
                    pipeItem.type == PipeDetailEventItemTypes.LeftUp ||
                
                    pipeItem.type == PipeDetailEventItemTypes.DownLeftUp ||
                    pipeItem.type == PipeDetailEventItemTypes.LeftUpRight ||
                    pipeItem.type == PipeDetailEventItemTypes.UpRightDown
                )
                {
                    pipeItem.setLinkFlag(true);
                    this.FindLinkItem(pipeItem,checkeditems);
                }
            }
        }

        if(item.type == PipeDetailEventItemTypes.DownLeft || 
            item.type == PipeDetailEventItemTypes.LeftUp || 
            item.type == PipeDetailEventItemTypes.LeftRight || 
            item.type == PipeDetailEventItemTypes.RightDownLeft || 
            item.type == PipeDetailEventItemTypes.DownLeftUp || 
            item.type == PipeDetailEventItemTypes.LeftUpRight 
        )
        {
            if(this.isValidItem(item.x - 1,item.y))
            {
                let pipeItem:ECPipeItem = this.items[item.y * this.gridX + item.x - 1];

                if(pipeItem.type == PipeDetailEventItemTypes.End || 
                    pipeItem.type == PipeDetailEventItemTypes.RightDown || 
                    pipeItem.type == PipeDetailEventItemTypes.UpRight || 
                    pipeItem.type == PipeDetailEventItemTypes.LeftRight || 
                
                    pipeItem.type == PipeDetailEventItemTypes.LeftUpRight || 
                    pipeItem.type == PipeDetailEventItemTypes.UpRightDown || 
                    pipeItem.type == PipeDetailEventItemTypes.RightDownLeft 
                )
                {
                    pipeItem.setLinkFlag(true);
                    this.FindLinkItem(pipeItem,checkeditems);
                }
            }
        }

        if(item.type == PipeDetailEventItemTypes.UpDown || 
            item.type == PipeDetailEventItemTypes.LeftUp || 
            item.type == PipeDetailEventItemTypes.UpRight || 
            item.type == PipeDetailEventItemTypes.DownLeftUp || 
            item.type == PipeDetailEventItemTypes.LeftUpRight || 
            item.type == PipeDetailEventItemTypes.UpRightDown
        )
        {
            if(this.isValidItem(item.x,item.y - 1))
            {
                let pipeItem:ECPipeItem = this.items[(item.y - 1) * this.gridX + item.x];

                if(pipeItem.type == PipeDetailEventItemTypes.End || 
                    pipeItem.type == PipeDetailEventItemTypes.DownLeft || 
                    pipeItem.type == PipeDetailEventItemTypes.RightDown || 
                    pipeItem.type == PipeDetailEventItemTypes.UpDown || 
                    pipeItem.type == PipeDetailEventItemTypes.UpRightDown || 
                    pipeItem.type == PipeDetailEventItemTypes.RightDownLeft || 
                    pipeItem.type == PipeDetailEventItemTypes.DownLeftUp
                )
                {
                    pipeItem.setLinkFlag(true);
                    this.FindLinkItem(pipeItem,checkeditems);
                }
            }
        }
    }

    isValidItem( x, y)
    {
        return x >= 0 && x < this.gridX && y >= 0 && y < this.gridY;
    }

    public  Rotate( item:ECPipeItem)
    {
        item.rotate();
        this.linkItems();

        for(let y = 0; y < this.gridY; y++)
        {
            for(let x = 0; x < this.gridX; x++)
            {
                let pipeItem:ECPipeItem = this.items[y * this.gridX + x];
                this.questionData[y * this.gridX + x] = pipeItem.type;
            }
        }

        this.Check();
        if(this.isCompleted)
        {
            this.unlock(false);
        }
    }

    public  Check()
    {

        let terminations:ECPipeItem[] = [];
        for(let i=0; i<this.items.length; i++)
        {
            if(this.items[i].type == PipeDetailEventItemTypes.End)
            {
                terminations.push(this.items[i]);
            }
        }

        let allRight:boolean = true;
        for(let i=0; i<terminations.length; i++)
        {
            if(!terminations[i].isLinked)
            {
                allRight = false;
                break;
            }
        }

        if (allRight)
        {
            this.isCompleted = true;
        }
    }
}
