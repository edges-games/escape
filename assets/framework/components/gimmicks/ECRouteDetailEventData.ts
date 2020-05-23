import ECDetailEventData from "./ECDetailEventData";
import ECGameController from "../../core/ECGameController";
import ECRouteItem from "./ECRouteItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECRouteDetailEventData extends ECDetailEventData
{
    @property(cc.Node) itemParent:cc.Node = null;
    @property(cc.Integer) space:number = 0;
    @property({multiline: true}) question:string = "";
    @property({multiline: true}) answer:string = "";
    @property({type:cc.AudioClip}) clickSound:cc.AudioClip = null;
    @property({type:[cc.SpriteFrame]}) blocks:cc.SpriteFrame[] = [];

    private answerMatrix:number[][] = [[]];
    private matrix:ECRouteItem[][] = [[]];
    private canMove:boolean = false;
    private route:ECRouteItem[] = [];

    onInitialize()
    {
        super.onInitialize();

        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this);

        let rows = this.question.split("\n");
        let answerRows = this.answer.split("\n");
        for(let r = 0; r < rows.length; r++)
        {
            let cols = rows[r].split("");
            let answerCols = answerRows[r].split("");
            this.matrix[r] = [];
            this.answerMatrix[r] = [];
            for(let c = 0; c < cols.length; c++)
            {
                let cell:ECRouteItem = new cc.Node().addComponent(ECRouteItem);
                cell.sprite = new cc.Node().addComponent(cc.Sprite);
                cell.node.setContentSize(47,47);
                cell.node.addChild(cell.sprite.node);
                this.matrix[r][c] = cell;
                this.answerMatrix[r][c] = parseInt(answerCols[c]);
                cell.value = parseInt(cols[c]);
                this.itemParent.addChild(cell.node);
                cell.x = c;
                cell.y = r;
                cell.node.position = new cc.Vec3(c * (cell.node.width + this.space), r * (-cell.node.height - this.space));
                this.setCellStatus(cell);
            }
        }
    }

    onDestroy()
    {
        this.node.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.off(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this);
    }

    protected setCellStatus(cell:ECRouteItem)
    {
        if(cell.value == 2)
        {
            cell.node.opacity = 0;
        }
        else if(cell.value == 1)
        {
            cell.node.opacity = 255;
            cell.sprite.spriteFrame = this.blocks[1];
        }
        else if(cell.value == 0)
        {
            cell.node.opacity = 0;
        }
    }

    onTouchStart(touch)
    {
        this.route = [];
        this.canMove = false;
        let point:cc.Vec2 = this.itemParent.convertToNodeSpaceAR(touch.getLocation());
        let currentCell:ECRouteItem = null;
        for(let r = 0; r < this.matrix.length; r++)
        {
            for(let c = 0; c < this.matrix[0].length; c++)
            {
                let cell:ECRouteItem = this.matrix[r][c];
                if(point.x > (cell.node.x - cell.node.width / 2) && point.x < (cell.node.x + cell.node.width / 2) &&
                   point.y > (cell.node.y - cell.node.height / 2) && point.y < (cell.node.y + cell.node.height / 2))
                {
                    currentCell = cell;
                }
            }
        }

        if(currentCell && currentCell.value == 1)
        {
            this.canMove = true;
            this.route.push(currentCell);
        }
    }

    onTouchMove(touch)
    {
        if(this.isCompleted) return;
        if(!this.canMove) return;

        let point:cc.Vec2 = this.itemParent.convertToNodeSpaceAR(touch.getLocation());
        
        for(let r = 0; r < this.matrix.length; r++)
        {
            for(let c = 0; c < this.matrix[0].length; c++)
            {
                let cell:ECRouteItem = this.matrix[r][c];

                if(point.x > (cell.node.x - cell.node.width / 2) && point.x < (cell.node.x + cell.node.width / 2) &&
                   point.y > (cell.node.y - cell.node.height / 2) && point.y < (cell.node.y + cell.node.height / 2) && cell.value != 2)
                {
                    let lastCell:ECRouteItem = this.route[this.route.length - 1];
                    
                    if(!lastCell)
                    {
                        this.onTouchStart(touch);
                        if(this.clickSound)
                        {
                            ECGameController.instance.audio.playSound(this.clickSound);
                        }
                        this.updateMatrix();
                        return;
                    }
                    if((cell.x == lastCell.x - 1 && cell.y == lastCell.y) || 
                        (cell.x == lastCell.x + 1 && cell.y == lastCell.y) ||
                        (cell.y == lastCell.y - 1 && cell.x == lastCell.x) || 
                        (cell.y == lastCell.y + 1 && cell.x == lastCell.x))
                    {
                        for(let r=0; r < this.route.length; r++)
                        {
                            if(this.route[r] == cell)
                            {
                                this.route = this.route.slice(0, r);
                                return;
                            }
                        }
                        if(this.clickSound)
                        {
                            ECGameController.instance.audio.playSound(this.clickSound);
                        }
                        this.route.push(cell);
                    }
                    else
                    {
                        return;
                    }
                }
            }
        }
        this.updateMatrix();
    }

    updateMatrix()
    {
        if(this.isCompleted) return;
        for(let r = 0; r < this.matrix.length; r++)
        {
            for(let c = 0; c < this.matrix[0].length; c++)
            {
                this.setCellStatus(this.matrix[r][c]);
            }
        }

        for(let r=0; r < this.route.length; r++)
        {
            let cell:ECRouteItem = this.route[r];
            if(r + 1 == this.route.length)
            {
                cell.node.opacity = 255;
                cell.sprite.spriteFrame = this.blocks[1];
            }
            else
            {
                cell.node.opacity = 255;
                cell.sprite.spriteFrame = this.blocks[0];
            }
        }
    }

    onTouchEnd(touch)
    {
        if(this.isCompleted) return;
        this.check();
        if(!this.isCompleted)
        {
            for(let r = 0; r < this.matrix.length; r++)
            {
                for(let c = 0; c < this.matrix[0].length; c++)
                {
                    this.setCellStatus(this.matrix[r][c]);
                }
            }
            this.canMove = false;
            this.route = [];
            this.updateMatrix();
        }
        else
        {
            this.unlock(false);
        }
    }

    protected check()
    {
        for(let r = 0; r < this.matrix.length; r++)
        {
            for(let c = 0; c < this.matrix[0].length; c++)
            {
                let cell:ECRouteItem = this.matrix[r][c];
                let has:boolean = false;
                for(let i=0; i < this.route.length; i++)
                {
                    if(this.route[i] == cell)
                    {
                        if(this.answerMatrix[r][c] == 2)
                        {
                            return;
                        }
                        has = true;
                        break;
                    }
                }
                if(!has && this.answerMatrix[r][c] != 2)
                {
                    return;
                }
            }
        }
        this.isCompleted = true;
    }

    protected checkRoute()
    {
        for(let r = 0; r < this.matrix.length; r++)
        {
            for(let c = 0; c < this.matrix[0].length; c++)
            {
                let cell:ECRouteItem = this.matrix[r][c];
                if(cell.value == 2)
                {
                    continue;
                }
                let has:boolean = false;
                for(let i=0; i < this.route.length; i++)
                {
                    if(this.route[i] == cell)
                    {
                        has = true;
                        break;
                    }
                }
                if(!has)
                {
                    return;
                }
            }
        }
        this.isCompleted = true;
    }
}
