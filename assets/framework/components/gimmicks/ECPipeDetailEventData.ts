import ECDetailEventData from "./ECDetailEventData";
import ECPipeItem, { PipeDetailEventItemTypes } from "./ECPipeItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECPipeDetailEventData extends ECDetailEventData {

    @property(cc.Node)  ItemParent:cc.Node;
    @property({type:[cc.SpriteFrame]}) blocks:cc.SpriteFrame[] = [];
    public  GridX:number = 8;
    public  GridY:number = 8;
    public  Space:number = 0;
    public  StartX:number = 0;
    public  StartY:number = 0;
    public  GridSize:number = 50;
    public  IsCompleted:boolean = false;

    public  StartItem:ECPipeItem;
    public  items:ECPipeItem[];

    private  Datas:number[];

    onInitialize()
    {
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.StartItem = null;
        this.StartX = (this.GridSize * this.GridX + this.Space * (this.GridX -1)) /-2 + this.GridSize /2;
        this.StartY = (this.GridSize * this.GridY + this.Space * (this.GridY -1)) /-2 + this.GridSize /2;
        this.items = [];
        this.Datas = this.Stage;


        for(let y = 0; y < this.GridY; y++)
        {
            for(let x = 0; x < this.GridX; x++)
            {
                let pipeItem:ECPipeItem = new cc.Node().addComponent(ECPipeItem);
                pipeItem.X = x;
                pipeItem.Y = y;
                pipeItem.sprite = new cc.Node().addComponent(cc.Sprite);
                pipeItem.node.addChild(pipeItem.sprite.node);
                pipeItem.PipeDetail = this;
                this.ItemParent.addChild(pipeItem.node);
             
                pipeItem.PipeType = this.Datas[this.GridX * y + x];
                if(pipeItem.PipeType == PipeDetailEventItemTypes.End)
                {
                    if(y == 0)
                    {
                        pipeItem.sprite.node.angle = 90;
                    }
                    else if(y == this.GridY - 1)
                    {
                        pipeItem.sprite.node.angle = 270
                    }
                }
                pipeItem.node.setPosition(cc.v2((x * this.GridSize) + this.StartX,-(y * this.GridSize) - this.StartY));
                this.items.push(pipeItem);

                if(pipeItem.PipeType == PipeDetailEventItemTypes.Start)
                {
                    this.StartItem = pipeItem;
                }

                pipeItem.Initialize();
            }
        }

        this.LinkItems();
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

    public  LinkItems()
    {
        for(let i=0;i<this.items.length;i++)
        {
            this.items[i].SetLinkFlag(false);
        }
            
        this.FindLinkItem(this.StartItem,[]);

        for(let i=0;i<this.items.length;i++)
        {
            this.items[i].UpdateSprite();
        }

    }

    public  FindLinkItem( item:ECPipeItem,  checkeditems:ECPipeItem[])
    {
        if(checkeditems.includes(item))
        {
            return;
        }

        checkeditems.push(item);

        if(item.PipeType == PipeDetailEventItemTypes.Start ||
            item.PipeType == PipeDetailEventItemTypes.LeftRight ||
            item.PipeType == PipeDetailEventItemTypes.RightDown ||
            item.PipeType == PipeDetailEventItemTypes.UpRight ||
            item.PipeType == PipeDetailEventItemTypes.UpRightDown ||
            item.PipeType == PipeDetailEventItemTypes.RightDownLeft ||
            item.PipeType == PipeDetailEventItemTypes.LeftUpRight
        )
        {
            if(this.IsValid(item.X + 1 ,item.Y))
            {
                let pipeItem:ECPipeItem = this.items[item.Y * this.GridX + item.X + 1];

                if(pipeItem.PipeType == PipeDetailEventItemTypes.End || 
                    pipeItem.PipeType == PipeDetailEventItemTypes.LeftUp || 
                    pipeItem.PipeType == PipeDetailEventItemTypes.LeftRight ||
                    pipeItem.PipeType == PipeDetailEventItemTypes.DownLeft ||
                    pipeItem.PipeType == PipeDetailEventItemTypes.LeftUpRight ||
                    pipeItem.PipeType == PipeDetailEventItemTypes.RightDownLeft ||
                    pipeItem.PipeType == PipeDetailEventItemTypes.DownLeftUp
                )
                {
                    pipeItem.SetLinkFlag(true);
                    this.FindLinkItem(pipeItem,checkeditems);
                }
            }
        }


        if(item.PipeType == PipeDetailEventItemTypes.UpDown || 
            item.PipeType == PipeDetailEventItemTypes.DownLeft || 
            item.PipeType == PipeDetailEventItemTypes.RightDown ||
        
            item.PipeType == PipeDetailEventItemTypes.UpRightDown ||
            item.PipeType == PipeDetailEventItemTypes.RightDownLeft ||
            item.PipeType == PipeDetailEventItemTypes.DownLeftUp
        
        
        )
        {
            if(this.IsValid(item.X ,item.Y + 1))
            {
                let pipeItem:ECPipeItem = this.items[(item.Y + 1) * this.GridX + item.X];

                if(pipeItem.PipeType == PipeDetailEventItemTypes.End || 
                    pipeItem.PipeType == PipeDetailEventItemTypes.UpDown || 
                    pipeItem.PipeType == PipeDetailEventItemTypes.UpRight || 
                    pipeItem.PipeType == PipeDetailEventItemTypes.LeftUp ||
                
                    pipeItem.PipeType == PipeDetailEventItemTypes.DownLeftUp ||
                    pipeItem.PipeType == PipeDetailEventItemTypes.LeftUpRight ||
                    pipeItem.PipeType == PipeDetailEventItemTypes.UpRightDown
                )
                {
                    pipeItem.SetLinkFlag(true);
                    this.FindLinkItem(pipeItem,checkeditems);
                }
            }
        }


        if(item.PipeType == PipeDetailEventItemTypes.DownLeft || 
            item.PipeType == PipeDetailEventItemTypes.LeftUp || 
            item.PipeType == PipeDetailEventItemTypes.LeftRight || 
            item.PipeType == PipeDetailEventItemTypes.RightDownLeft || 
            item.PipeType == PipeDetailEventItemTypes.DownLeftUp || 
            item.PipeType == PipeDetailEventItemTypes.LeftUpRight 
        )
        {
            if(this.IsValid(item.X - 1,item.Y))
            {
                let pipeItem:ECPipeItem = this.items[item.Y * this.GridX + item.X - 1];

                if(pipeItem.PipeType == PipeDetailEventItemTypes.End || 
                    pipeItem.PipeType == PipeDetailEventItemTypes.RightDown || 
                    pipeItem.PipeType == PipeDetailEventItemTypes.UpRight || 
                    pipeItem.PipeType == PipeDetailEventItemTypes.LeftRight || 
                
                    pipeItem.PipeType == PipeDetailEventItemTypes.LeftUpRight || 
                    pipeItem.PipeType == PipeDetailEventItemTypes.UpRightDown || 
                    pipeItem.PipeType == PipeDetailEventItemTypes.RightDownLeft 
                )
                {
                    pipeItem.SetLinkFlag(true);
                    this.FindLinkItem(pipeItem,checkeditems);
                }
            }
        }


        if(item.PipeType == PipeDetailEventItemTypes.UpDown || 
            item.PipeType == PipeDetailEventItemTypes.LeftUp || 
            item.PipeType == PipeDetailEventItemTypes.UpRight || 
            item.PipeType == PipeDetailEventItemTypes.DownLeftUp || 
            item.PipeType == PipeDetailEventItemTypes.LeftUpRight || 
            item.PipeType == PipeDetailEventItemTypes.UpRightDown
        )
        {
            if(this.IsValid(item.X,item.Y - 1))
            {
                let pipeItem:ECPipeItem = this.items[(item.Y - 1) * this.GridX + item.X];

                if(pipeItem.PipeType == PipeDetailEventItemTypes.End || 
                    pipeItem.PipeType == PipeDetailEventItemTypes.DownLeft || 
                    pipeItem.PipeType == PipeDetailEventItemTypes.RightDown || 
                    pipeItem.PipeType == PipeDetailEventItemTypes.UpDown || 
                    pipeItem.PipeType == PipeDetailEventItemTypes.UpRightDown || 
                    pipeItem.PipeType == PipeDetailEventItemTypes.RightDownLeft || 
                    pipeItem.PipeType == PipeDetailEventItemTypes.DownLeftUp
                )
                {
                    pipeItem.SetLinkFlag(true);
                    this.FindLinkItem(pipeItem,checkeditems);
                }
            }
        }
    }

    public  IsValid( x, y)
    {
        return x >= 0 && x < this.GridX && y >= 0 && y < this.GridY;
    }

    public  Rotate( item:ECPipeItem)
    {
        if(this.IsCompleted)
        {
   
            return;
        }

        item.Rotate();

        this.LinkItems();

        for(let y = 0; y < this.GridY; y++)
        {
            for(let x = 0; x < this.GridX; x++)
            {
                let pipeItem:ECPipeItem = this.items[y * this.GridX + x];
                this.Datas[y * this.GridX + x] = pipeItem.PipeType;
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
        if (this.items[3].IsLinked && this.items[15].IsLinked &&
            this.items[23].IsLinked && this.items[47].IsLinked &&
            this.items[57].IsLinked && this.items[62].IsLinked)
        {
            this.isCompleted = true;
        }
    }



    private Stage:number[] = 
    [
        0, 0, 0, 3, 0, 0, 0, 0,
        2, 6, 7, 6, 8, 6, 8, 3,
        0, 4, 4, 5, 4, 6, 13, 3,
        0, 7, 10, 7, 11, 1, 13, 0,
        0, 1, 5, 12, 8, 1, 6, 0,
        0, 1, 11, 11, 9, 13, 6, 3,
        0, 8, 7, 6, 7, 6, 11, 0,
        0, 3, 0, 0, 0, 0, 3, 0
    ];

}
