import ECPipeDetailEventData from "./ECPipeDetailEventData";

const {ccclass} = cc._decorator;

export const PipeDetailEventItemTypes = cc.Enum(
{
    Nothing : 0,
    Block : 1,
    Start  : 2,
    End  : 3,

    LeftRight : 4,
    UpDown : 5,
    UpRight : 6,
    RightDown : 7,
    DownLeft : 8,
    LeftUp : 9,

    UpRightDown : 10,
    RightDownLeft : 11,
    DownLeftUp : 12,
    LeftUpRight : 13
});

@ccclass
export default class ECPipeItem extends cc.Component 
{
    public type:number;
    public sprite:cc.Sprite;
    public detail:ECPipeDetailEventData;
    public x:number;
    public y:number;
    public isLinked:boolean;

    public initialize()
    {
        if(this.type == PipeDetailEventItemTypes.Nothing)
        {
            this.sprite.node.active = false;
         
        }
        else if(this.type == PipeDetailEventItemTypes.Block)
        {
            this.sprite.spriteFrame = this.detail.blocks[0];
    
        }
        else if(this.type == PipeDetailEventItemTypes.Start)
        {
            this.sprite.spriteFrame = this.detail.blocks[2];
            
        }
        else if(this.type == PipeDetailEventItemTypes.End)
        {
            this.sprite.spriteFrame = this.detail.blocks[1];
            this.node.angle = 180;
        }
        else if(this.type == PipeDetailEventItemTypes.UpDown)
        {
            this.sprite.spriteFrame = this.detail.blocks[3];
            this.node.angle = 90;
        }
        else if(this.type == PipeDetailEventItemTypes.LeftRight)
        {
            this.sprite.spriteFrame = this.detail.blocks[3];
            this.node.angle = 0;
        }
        else if(this.type == PipeDetailEventItemTypes.RightDown)
        {
            this.sprite.spriteFrame = this.detail.blocks[5];
            this.node.angle = 0;
        }
        else if(this.type == PipeDetailEventItemTypes.DownLeft)
        {
            this.sprite.spriteFrame = this.detail.blocks[5];
            this.node.angle = 270;
        }
        else if(this.type == PipeDetailEventItemTypes.LeftUp)
        {
            this.sprite.spriteFrame = this.detail.blocks[5];
            this.node.angle = 180;
        }
        else if(this.type == PipeDetailEventItemTypes.UpRight)
        {
            this.sprite.spriteFrame = this.detail.blocks[5];
            this.node.angle = 90;
        }
        else if(this.type == PipeDetailEventItemTypes.LeftUpRight)
        {
            this.sprite.spriteFrame = this.detail.blocks[7];
            this.node.angle = 180;
        }
        else if(this.type == PipeDetailEventItemTypes.UpRightDown)
        {
            this.sprite.spriteFrame = this.detail.blocks[7];
            this.node.angle = 90;
        }
        else if(this.type == PipeDetailEventItemTypes.RightDownLeft)
        {
            this.sprite.spriteFrame = this.detail.blocks[7];

        }
        else if(this.type == PipeDetailEventItemTypes.DownLeftUp)
        {
            this.sprite.spriteFrame = this.detail.blocks[7];
            this.node.angle = 270;
        }
    }

    

    public setLinkFlag( linked)
    {
        this.isLinked = linked;
    }

    public  convert( b:number[]):number[]
    {
        let temp:number[] = [];  
        for (let i = 0; i < 3; i++) {  
            for (let j = 0; j < 3; j++) {  
                temp[j*3+i]=b[3-j-1 + i];
            }  
        }  
        return temp;  
    }

    public rotate()
    {
        if(this.type == PipeDetailEventItemTypes.LeftRight)
        {
            this.type = PipeDetailEventItemTypes.UpDown;
            this.node.angle = 90;
        }
        else if(this.type == PipeDetailEventItemTypes.UpDown)
        {
            this.type = PipeDetailEventItemTypes.LeftRight;
            this.node.angle = 0;
        }
        else if(this.type == PipeDetailEventItemTypes.UpRight)
        {
            this.type = PipeDetailEventItemTypes.RightDown;
            this.node.angle = 0;
        }
        else if(this.type == PipeDetailEventItemTypes.RightDown)
        {
            this.type = PipeDetailEventItemTypes.DownLeft;
            this.node.angle = 270;
        }
        else if(this.type == PipeDetailEventItemTypes.DownLeft)
        {
            this.type = PipeDetailEventItemTypes.LeftUp;
            this.node.angle = 180;
        }
        else if(this.type == PipeDetailEventItemTypes.LeftUp)
        {
            this.type = PipeDetailEventItemTypes.UpRight;
            this.node.angle = 90;
        }
        else if(this.type == PipeDetailEventItemTypes.LeftUpRight)
        {
            this.type = PipeDetailEventItemTypes.UpRightDown;
            this.node.angle = 90;
        }
        else if(this.type == PipeDetailEventItemTypes.UpRightDown)
        {
            this.type = PipeDetailEventItemTypes.RightDownLeft;
            this.node.angle = 0;
        }
        else if(this.type == PipeDetailEventItemTypes.RightDownLeft)
        {
            this.type = PipeDetailEventItemTypes.DownLeftUp;
            this.node.angle = 270;
        }
        else if(this.type == PipeDetailEventItemTypes.DownLeftUp)
        {
            this.type = PipeDetailEventItemTypes.LeftUpRight;
            this.node.angle = 180;
        }
    }

    public updateSprite()
    {
        if(this.type == PipeDetailEventItemTypes.Start)
        {
            this.sprite.spriteFrame = this.detail.blocks[2];
        }
        else  if(this.type == PipeDetailEventItemTypes.End)
        {
            this.sprite.spriteFrame = this.detail.blocks[this.isLinked?2:1];
        }
        else if(this.type == PipeDetailEventItemTypes.UpDown)
        {
            this.sprite.spriteFrame = this.detail.blocks[this.isLinked?4:3];
        }
        else if(this.type == PipeDetailEventItemTypes.LeftRight)
        {
            this.sprite.spriteFrame = this.detail.blocks[this.isLinked?4:3];
        }
        else if(this.type == PipeDetailEventItemTypes.RightDown)
        {
            this.sprite.spriteFrame = this.detail.blocks[this.isLinked?6:5];
        }
        else if(this.type == PipeDetailEventItemTypes.DownLeft)
        {
            this.sprite.spriteFrame = this.detail.blocks[this.isLinked?6:5];
        }
        else if(this.type == PipeDetailEventItemTypes.LeftUp)
        {
            this.sprite.spriteFrame = this.detail.blocks[this.isLinked?6:5];
        }
        else if(this.type == PipeDetailEventItemTypes.UpRight)
        {
            this.sprite.spriteFrame = this.detail.blocks[this.isLinked?6:5];
        }
        else if(this.type == PipeDetailEventItemTypes.LeftUpRight)
        {
            this.sprite.spriteFrame = this.detail.blocks[this.isLinked?8:7];
        }
        else if(this.type == PipeDetailEventItemTypes.UpRightDown)
        {
            this.sprite.spriteFrame = this.detail.blocks[this.isLinked?8:7];
        }
        else if(this.type == PipeDetailEventItemTypes.RightDownLeft)
        {
            this.sprite.spriteFrame = this.detail.blocks[this.isLinked?8:7];
        }
        else if(this.type == PipeDetailEventItemTypes.DownLeftUp)
        {
            this.sprite.spriteFrame = this.detail.blocks[this.isLinked?8:7];
        }
    }

    public  rotateTo(type:number)
    {
        this.rotate();
        this.detail.linkItems();
    }
}
