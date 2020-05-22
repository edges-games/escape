import ECPuzzleItem from "./ECPuzzleItem";
import ECDetailEventData from "./ECDetailEventData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECPuzzleDetailEventData extends ECDetailEventData {

	@property gridX:number = 4;
	@property gridY:number = 4;
	@property(cc.Vec2) gridSize:cc.Vec2 = cc.v2(60,60);
	@property(cc.Node)  itemParent:cc.Node = null;
	@property({multiline: true}) question:string = "";
	@property({multiline: true}) answer:string = "";
	@property({type:[cc.SpriteFrame]}) blocks:cc.SpriteFrame[] = [];

	private items:ECPuzzleItem[];
	private questionData:number[];
    private answerData:number[];
	private startX:number = 0;
    private startY:number = 0;
    private space:number = 0;

	onInitialize()
	{
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
		this.answerData = this.answer.split(",").map((x)=>parseInt(x));
		this.questionData = this.question.split(",").map((x)=>parseInt(x));
		
        this.createMatrix();
	}

    check()
    {
        let i:number=0;
        let isClear:boolean = true;
        for(let y = 0; y < this.gridY; y++)
        {
            for(let x = 0; x < this.gridX; x++)
            {
                if(this.items[this.convertIndex(y,x)] != null)
                {
                    if(this.answerData[i] != this.items[this.convertIndex(y,x)].code)
                    {
                        isClear = false;
                        break;
                    }
                }
                i++;
            }
            if(!isClear)
            {
                break;
            }
        }

        if(isClear)
        {
            this.isCompleted = true;
        }
    }

	
	public createMatrix()
	{
		this.itemParent.destroyAllChildren();
		
		this.items = [];
		
        this.startX = ((this.gridX * this.gridSize.x) + (this.gridX * this.space)) / -2 + (this.space + this.gridSize.x) / 2;
        this.startY = ((this.gridY * this.gridSize.y) + (this.gridY * this.space)) / 2 + (this.space + this.gridSize.y) / -2;

		let i = 0;
		for(let y = 0; y < this.gridY; y++)
		{
			for(let x = 0; x < this.gridX; x++)
			{
                if(this.answerData[i] != -1)
				{
					let item:ECPuzzleItem = new cc.Node().addComponent(ECPuzzleItem);
				    this.itemParent.addChild(item.node);
					item.node.setPosition(this.GetPosition(y,x));
                    item.sprite = new cc.Node().addComponent(cc.Sprite);
                
                    item.sprite.spriteFrame = this.blocks[this.questionData[i]];
                    item.node.addChild(item.sprite.node);
                    item.code = this.questionData[i];
					item.x = x;
					item.y = y;
					
					this.items.push(item);
                }
                else
                {
                    this.items.push(null);
                }
                i++;
			}
		}
	}

	GetPosition( y:number, x:number):cc.Vec3
	{
		return cc.v3(x*this.gridSize.x + this.startX,y*-this.gridSize.y+this.startY);
	}

    onTouchStart(touch)
    {
		if(this.isCompleted) return;
		for (let i=0;i<this.items.length;i++)
		{
			let item:ECPuzzleItem = this.items[i];

			if(item != null)
			{
				let locationInNode:cc.Vec2 = item.node.convertToNodeSpaceAR(touch.getLocation());
				let rect:cc.Rect = item.sprite.node.getBoundingBox();
				
				if (rect.contains(locationInNode))
				{
					this.movePuzzleItem(item);
					return;
				}
			}
		}
    }
    
    onDestroy()
    {
        this.node.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
    }

	movePuzzleItem(item:ECPuzzleItem)
	{
		let canMoveY:boolean = false;
		let moveYCount:number = 0;
		for(let y = item.y ; y < this.gridY;y++)
		{

			if(this.items[this.convertIndex(y,item.x)] == null)
			{
				canMoveY = true;
				break;
			}
			moveYCount++;
		}

		if(canMoveY)
		{
			for(let y =  item.y + moveYCount - 1 ; y >= item.y ;y--)
			{
				this.items[this.convertIndex(y,item.x)].y += 1;
                let pi:ECPuzzleItem = this.items[this.convertIndex(y,item.x)];
                cc.tween(pi.node).to(0.3,{position:this.GetPosition(pi.y,pi.x)}).start();
			}

			this.reFormatMatrix();
			return;
		}
		moveYCount = 0;

		for(let y = item.y ; y >= 0;y--)
		{

			if(this.items[this.convertIndex(y,item.x)] == null)
			{
				canMoveY = true;
				break;
			}
			moveYCount++;
		}
		if(canMoveY)
		{
			let ry = item.y;
			for(let y = item.y - (moveYCount -1) ; y <= item.y ;y++)
			{
				this.items[this.convertIndex(y,item.x)].y -= 1;
				let pi:ECPuzzleItem = this.items[this.convertIndex(y,item.x)];
                cc.tween(pi.node).to(0.3,{position:this.GetPosition(pi.y,pi.x)}).start();
				ry--;
			}
			
			this.reFormatMatrix();
			return;
		}

		let canMoveX:boolean = false;
		let moveXCount:number = 0;
		for(let x = item.x ; x < this.gridX;x++)
		{
			
			if(this.items[this.convertIndex(item.y,x)] == null)
			{
				canMoveX = true;
				break;
			}
			moveXCount++;
		}
		
		if(canMoveX)
		{
			for(let x =  item.x + moveXCount - 1 ; x >= item.x ;x--)
			{
				this.items[this.convertIndex(item.y,x)].x += 1;
				let pi:ECPuzzleItem = this.items[this.convertIndex(item.y,x)];
				cc.tween(pi.node).to(0.3,{position:this.GetPosition(pi.y,pi.x)}).start();
			}
			
			this.reFormatMatrix();
			return;
		}
		moveXCount = 0;
		
		for(let x = item.x ; x >= 0;x--)
		{
			
			if(this.items[this.convertIndex(item.y,x)] == null)
			{
				canMoveX = true;
				break;
			}
			moveXCount++;
		}
		if(canMoveX)
		{
			for(let x = item.x - (moveXCount -1) ; x <= item.x ;x++)
			{
				this.items[this.convertIndex(item.y,x)].x -= 1;
				let pi:ECPuzzleItem = this.items[this.convertIndex(item.y,x)];
				cc.tween(pi.node).to(0.3,{position:this.GetPosition(pi.y,pi.x)}).start();
			}
			
			this.reFormatMatrix();
			return;
		}

	}

	public reFormatMatrix()
	{
		let tempTtems:ECPuzzleItem[] = [];

        for(let y = 0; y < this.gridY; y++)
        {
            for(let x = 0; x < this.gridX; x++)
            {
                tempTtems.push(this.items[this.convertIndex(y,x)]);
            }
        }

		for(let y = 0; y < this.gridY; y++)
		{
			for(let x = 0; x < this.gridX; x++)
			{
				this.items[this.convertIndex(y,x)] = null;
			}
        }
        
        let i=0;
        for(let y = 0; y < this.gridY; y++)
		{
			for(let x = 0; x < this.gridX; x++)
			{
				let item = tempTtems[i];
				if(item != null)
				{
					this.items[this.convertIndex(item.y,item.x)] = item;
				}
				i++;
			}
		}

        this.check();
        if(this.isCompleted)
        {
            this.unlock(false);
        }
    }
    
    convertIndex(y,x):number
    {
        return x % this.gridX + y * this.gridY;
    }
}
