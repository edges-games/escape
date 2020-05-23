import ECPipeDetailEventData from "./ECPipeDetailEventData";

const {ccclass, property} = cc._decorator;

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
export default class ECPipeItem extends cc.Component {
    public  PipeType:number;
    public  Datas;

    public  sprite:cc.Sprite;

    public  PipeDetail:ECPipeDetailEventData;

    public X:number;
    public Y:number;


    public Initialize()
    {
        if(this.PipeType == PipeDetailEventItemTypes.Nothing)
        {
            this.sprite.node.active = false;
         
        }
        else if(this.PipeType == PipeDetailEventItemTypes.Block)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[0];
    
        }
        else if(this.PipeType == PipeDetailEventItemTypes.Start)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[2];
            
        }
        else if(this.PipeType == PipeDetailEventItemTypes.End)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[1];
            this.node.angle = 180;
            
        }
        else if(this.PipeType == PipeDetailEventItemTypes.UpDown)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[3];
            this.node.angle = 90;
        }
        else if(this.PipeType == PipeDetailEventItemTypes.LeftRight)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[3];
            this.node.angle = 0;
        }
        else if(this.PipeType == PipeDetailEventItemTypes.RightDown)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[5];
            this.node.angle = 0;
        }
        else if(this.PipeType == PipeDetailEventItemTypes.DownLeft)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[5];
            this.node.angle = 270;
        }
        else if(this.PipeType == PipeDetailEventItemTypes.LeftUp)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[5];
            this.node.angle = 180;
        }
        else if(this.PipeType == PipeDetailEventItemTypes.UpRight)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[5];
            this.node.angle = 90;
        }
        else if(this.PipeType == PipeDetailEventItemTypes.LeftUpRight)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[7];
            this.node.angle = 180;
        }
        else if(this.PipeType == PipeDetailEventItemTypes.UpRightDown)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[7];
            this.node.angle = 90;
        }
        else if(this.PipeType == PipeDetailEventItemTypes.RightDownLeft)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[7];

        }
        else if(this.PipeType == PipeDetailEventItemTypes.DownLeftUp)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[7];
            this.node.angle = 270;
        }
    }

    public IsLinked:boolean;

    public  SetLinkFlag( linked)
    {
        this.IsLinked = linked;
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

    public  Rotate()
    {
        if(this.PipeType == PipeDetailEventItemTypes.LeftRight)
        {
            this.PipeType = PipeDetailEventItemTypes.UpDown;
            this.node.angle = 90;
        }
        else if(this.PipeType == PipeDetailEventItemTypes.UpDown)
        {
            this.PipeType = PipeDetailEventItemTypes.LeftRight;
            this.node.angle = 0;
        }
        else if(this.PipeType == PipeDetailEventItemTypes.UpRight)
        {
            this.PipeType = PipeDetailEventItemTypes.RightDown;
            this.node.angle = 0;
        }
        else if(this.PipeType == PipeDetailEventItemTypes.RightDown)
        {
            this.PipeType = PipeDetailEventItemTypes.DownLeft;
            this.node.angle = 270;
        }
        else if(this.PipeType == PipeDetailEventItemTypes.DownLeft)
        {
            this.PipeType = PipeDetailEventItemTypes.LeftUp;
            this.node.angle = 180;
        }
        else if(this.PipeType == PipeDetailEventItemTypes.LeftUp)
        {
            this.PipeType = PipeDetailEventItemTypes.UpRight;
            this.node.angle = 90;
        }
        else if(this.PipeType == PipeDetailEventItemTypes.LeftUpRight)
        {
            this.PipeType = PipeDetailEventItemTypes.UpRightDown;
            this.node.angle = 90;
        }
        else if(this.PipeType == PipeDetailEventItemTypes.UpRightDown)
        {
            this.PipeType = PipeDetailEventItemTypes.RightDownLeft;
            this.node.angle = 0;
        }
        else if(this.PipeType == PipeDetailEventItemTypes.RightDownLeft)
        {
            this.PipeType = PipeDetailEventItemTypes.DownLeftUp;
            this.node.angle = 270;
        }
        else if(this.PipeType == PipeDetailEventItemTypes.DownLeftUp)
        {
            this.PipeType = PipeDetailEventItemTypes.LeftUpRight;
            this.node.angle = 180;
        }
    }

    public UpdateSprite()
    {
        if(this.PipeType == PipeDetailEventItemTypes.Start)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[2];
        }
        else  if(this.PipeType == PipeDetailEventItemTypes.End)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[this.IsLinked?2:1];
        }
        else if(this.PipeType == PipeDetailEventItemTypes.UpDown)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[this.IsLinked?4:3];
        }
        else if(this.PipeType == PipeDetailEventItemTypes.LeftRight)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[this.IsLinked?4:3];
        }
        else if(this.PipeType == PipeDetailEventItemTypes.RightDown)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[this.IsLinked?6:5];
        }
        else if(this.PipeType == PipeDetailEventItemTypes.DownLeft)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[this.IsLinked?6:5];
        }
        else if(this.PipeType == PipeDetailEventItemTypes.LeftUp)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[this.IsLinked?6:5];
        }
        else if(this.PipeType == PipeDetailEventItemTypes.UpRight)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[this.IsLinked?6:5];
        }
        else if(this.PipeType == PipeDetailEventItemTypes.LeftUpRight)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[this.IsLinked?8:7];
        }
        else if(this.PipeType == PipeDetailEventItemTypes.UpRightDown)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[this.IsLinked?8:7];
        }
        else if(this.PipeType == PipeDetailEventItemTypes.RightDownLeft)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[this.IsLinked?8:7];
        }
        else if(this.PipeType == PipeDetailEventItemTypes.DownLeftUp)
        {
            this.sprite.spriteFrame = this.PipeDetail.blocks[this.IsLinked?8:7];
        }
    }

    public  RotateTo(type:number)
    {
        this.Rotate();
        this.PipeDetail.LinkItems();
    }


}
