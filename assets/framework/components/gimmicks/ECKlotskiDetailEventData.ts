const {ccclass, property} = cc._decorator;
import ECKlotskiItem from "./ECKlotskiItem"
import ECDetailEventData from "./ECDetailEventData";

@ccclass
export default class ECKlotskiDetailEventData extends ECDetailEventData
{
    private target:ECKlotskiItem;
    private gridX:number = 7;
    private gridY:number = 7;
    private gridSize:cc.Size = cc.size(38,38);
    
    private startX:number = 0;
    
    private startY:number = 0;
    
    private space:number = 0;
    
    private map:number[] = [];
    
    private items:ECKlotskiItem[] = [];

    clamp=function(a,b,c){return Math.max(b,Math.min(c,a));};

    @property(cc.Node) itemParent:cc.Node = null;
    @property({multiline: true}) question:string = "";
    @property({multiline: true}) answer:string = "";
    @property({type:[cc.SpriteFrame]}) blocks:cc.SpriteFrame[] = [];

    private answerData:number[] = null;
    onInitialize()
    {   
        this.startX = ((this.gridX * this.gridSize.width) + (this.gridX * this.space)) / -2 + (this.space + this.gridSize.width) / 2;
        this.startY = ((this.gridY * this.gridSize.height) + (this.gridY * this.space)) / 2 + (this.space + this.gridSize.height) / -2;
    
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this);

        let data:number[] = this.question.replace(/\n/g,"").split("").map((item)=>{ return parseInt(item);});

        data = [
            1,3,1,9,1,0,1,
            3,0,5,0,0,2,0,
            0,0,0,2,0,5,0,
            2,0,0,0,3,0,5,
            2,0,2,0,0,0,0,
            3,0,0,2,0,0,0,
            0,2,0,0,0,2,0
        ];
        this.answerData = this.answer.replace(/\n/g,"").split("").map((item)=>{ return parseInt(item);});

        for(let i = 0; i < this.gridX * this.gridY; i++)
        {
            let x = i % this.gridX;
            let y = Math.floor(i / this.gridX);

            let type = data[i];
            if(type != 0)
            {
                let item1:ECKlotskiItem = this.createItem(x,y,type);
                item1.node.setPosition(this.createPosition(item1.x, item1.y));
                this.items.push(item1);
                this.itemParent.addChild(item1.node);
            }
        }
        
        return false;
    }

    onDestroy()
    {
        this.node.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.off(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this);
    }

    createMap()
    {
        this.map = [];
        for(let i = 0; i < this.gridX*this.gridY; i++)
        {
            this.map.push(0);
        }
        
        for(let i=0;i<this.items.length;i++)
        {
            let item1:ECKlotskiItem = this.items[i];
            for(let x = item1.x; x < item1.x + item1.sizeX; x++)
            {
                this.map[this.convertIndex(x, item1.y)] = item1.type;
            }
            
            for(let y = item1.y; y < item1.y + item1.sizeY; y++)
            {
                this.map[this.convertIndex(item1.x, y)] = item1.type;
            }
        }
        
        if(this.isCompleted) return;
        this.check();
        if(this.isCompleted)
        {
            this.unlock(false);
        }
    }

    check()
    {
        let allRight = true;
        for(let i = 0; i < this.map.length; i++)
        {
            if(this.map[i] == 9)
            {
                if(this.answerData[i] != this.map[i])
                {
                    allRight = false;
                }
            }
        }

        if(allRight)
        {
            this.isCompleted = true;
        }
    }
    
    convertIndex( x,  y):number
    {
        return x % this.gridX + y * this.gridY;
    }
    
    createItem(x, y, type)
    {
        let item:ECKlotskiItem = new cc.Node().addComponent(ECKlotskiItem);
        item.x = x;
        item.y = y;

        let sprite:cc.Sprite = new cc.Node().addComponent(cc.Sprite);
        item.sprite = sprite;
        item.node.addChild(sprite.node);
        sprite.node.anchorX = 0.5;
        sprite.node.anchorY = 0.5;

        item.type = type;
        if(type == 1)
        {
            item.sizeX = 1;
            item.sizeY = 1;
            item.sprite.spriteFrame = this.blocks[0];
        }
        else if(type == 2)
        {
            item.sizeX = 2;
            item.sizeY = 1;
            item.sprite.spriteFrame = this.blocks[1];
        }
        else if(type == 3)
        {
            item.sizeX = 1;
            item.sizeY = 2;
            item.sprite.spriteFrame = this.blocks[1];
            item.sprite.node.angle = 90;
        }
        else if(type == 9)
        {
            item.sizeX = 1;
            item.sizeY = 2;
            item.sprite.spriteFrame = this.blocks[3];
        }
        else if(type == 4)
        {
            item.sizeX = 3;
            item.sizeY = 1;
            item.sprite.spriteFrame = this.blocks[2];
        }
        else if(type == 5)
        {
            item.sizeX = 1;
            item.sizeY = 3;
            item.sprite.spriteFrame = this.blocks[2];
            item.sprite.node.angle = 90;
        }

        item.sprite.node.setPosition((item.sizeX-1)*this.gridSize.width/2, (item.sizeY-1)*this.gridSize.height/-2);
        return item;
    }
    
    onTouchStart(touch)
    {
        if(this.isCompleted) return;
        for (let i=0;i<this.items.length;i++)
        {
            let item:ECKlotskiItem = this.items[i];
            
            if(item.sizeX != 1 || item.sizeY != 1)
            {
                let locationInNode:cc.Vec2 = item.node.convertToNodeSpaceAR(touch.getLocation());
        
                let rect:cc.Rect = item.sprite.node.getBoundingBox();
                
                if (rect.contains(locationInNode))
                {
                    this.target = item;
                    this.target.minX = this.target.node.x;
                    this.target.maxX = this.target.node.x;
                    this.target.minY = this.target.node.y;
                    this.target.maxY = this.target.node.y;
                    
                    if(this.target.type == 2 || this.target.type == 4)
                    {
                        for(let x=this.target.x-1;x>=0;x--)
                        {
                            if(this.map[this.convertIndex(x, item.y)] == 0)
                            {
                                this.target.minX = this.createPosition(x,this.target.y).x;
                            }
                            else
                            {
                                break;
                            }
                        }
                        
                        for(let x=this.target.x;x < this.gridX - this.target.sizeX; x++)
                        {
                            if(this.map[this.convertIndex(x + this.target.sizeX,item.y )] == 0)
                            {
                                this.target.maxX = this.createPosition(x+1,item.y).x;
                            }
                            else
                            {
                                break;
                            }
                        }
                    }
                    
                    if(this.target.type == 3 || this.target.type == 5 || this.target.type == 9)
                    {
                        for(let y=this.target.y-1;y>=0;y--)
                        {
                            if(this.map[this.convertIndex(item.x, y)] == 0)
                            {
                                this.target.minY = this.createPosition(this.target.x,y).y;
                            }
                            else
                            {
                                break;
                            }
                        }
                        
                        for(let y=this.target.y;y < this.gridY - this.target.sizeY; y++)
                        {
                            if(this.map[this.convertIndex(item.x, y + this.target.sizeY)] == 0)
                            {
                                this.target.maxY = this.createPosition(item.x,y+1).y;
                            }
                            else
                            {
                                break;
                            }
                        }
                    }
                }
            }
        }
        return true;
    }
    
    onTouchMove(touch)
    {
        if(this.isCompleted) return;
        if(this.target != null)
        {
            let tp:cc.Vec2 = this.target.node.getPosition().add(touch.getDelta());
            if(tp.x < this.target.minX)
            {
                tp.x = this.target.minX;
            }
            
            if(tp.x > this.target.maxX)
            {
                tp.x = this.target.maxX;
            }
            
            if(tp.y > this.target.minY)
            {
                tp.y = this.target.minY;
            }
    
            if(tp.y < this.target.maxY)
            {
                tp.y = this.target.maxY;
            }
            
            this.target.node.setPosition(tp);
        }
    }
    
    onTouchEnd(touch)
    {
        if(this.isCompleted) return;
        if(this.target != null)
        {
            let p:cc.Vec2 = this.createPoint(this.target.node.getPosition());
            if(this.target.x != p.x || this.target.y != p.y)
            {
                this.target.x = p.x;
                this.target.y = p.y;
                this.createMap();
            }
            this.target.node.setPosition(this.createPosition(p.x, p.y));
            this.target = null;
        }
    }
    
    createPosition(x, y):cc.Vec2
    {
        return new cc.Vec2(this.startX + x * this.gridSize.width, this.startY + y * - this.gridSize.height);
    }
    
    createPoint(position:cc.Vec2):cc.Vec2
    {
        let m:cc.Vec2 = cc.v2(position.x - this.startX,this.startY - position.y).add(cc.v2(this.gridSize.width/2, this.gridSize.height/-2 + this.gridSize.height));
        
        let y = this.clamp(Math.floor(m.y/this.gridSize.height),0,this.gridY - 1);
        let x = this.clamp(Math.floor(m.x/this.gridSize.width),0,this.gridX - 1);
      
        return cc.v2(x,y);
    }
    
}
