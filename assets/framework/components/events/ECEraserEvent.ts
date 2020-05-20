import ECGameController from "../../core/ECGameController";
import { ECFlagStatus } from "../../consts/ECConsts"
import ECTouchEvent from "./ECTouchEvent";
const {ccclass, property} = cc._decorator;

@ccclass
export default class ECEraserEvent extends ECTouchEvent
{
    @property(cc.Mask) mask:cc.Mask = null;
    @property(cc.Node) completedNode:cc.Node = null;
    private points:[number[]] = [[]];
    private checkPoints:[number[]] = [[]];
    private completed:boolean = false;

    onInitialize ()
    {
        super.onInitialize();
        if(!this.flag || this.getFlagStatus(this.flag) != ECFlagStatus.Start) return;
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.completedNode.opacity = 0;
        for(let x = 0; x < this.node.width; x += 30)
        {
            for(let y = 0; y < this.node.height; y += 30)
            {
                this.checkPoints.push([x-this.node.width/2,-y+this.node.height/2]);
            }
        }
    }

    onTouched()
    {
        return true;
    }

    onDestroy ()
    {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
    }

    onTouchStart (event) 
    {
        if(this.checkItem()) this.onTouchMoved(event);
    }

    onTouchMoved(event) 
    {
        if(this.needItem && ECGameController.instance.currentItem != this.needItem) return;
        if(this.completed) return;
        let start:cc.Vec2  = this.node.convertToNodeSpaceAR(event.touch.getLocation());

        if(start.x < this.node.x - this.node.width / 2 || 
            start.x > this.node.width / 2 || 
            start.y < this.node.y - this.node.height / 2 ||
            start.y > this.node.height / 2)
            return;

        let end:cc.Vec2  = this.node.convertToNodeSpaceAR(event.touch.getPreviousLocation());
    
        let distance:number = start.sub(end).mag();
        if (distance > 30)
        {
            let d:number = Math.floor(distance);
            for (let i = 0; i < d; i++)
            {
                let difx = end.x - start.x;
                let dify = end.y - start.y;
                let delta = i / distance;
                let y = start.y + (dify * delta);

                this.addCircle(start.x + (difx * delta), y);
            }
        }
        this.addCircle(start.x,start.y,true);
    }

    checkFinish()
    {
        let hits:number = 0;
        for(let c=0;c<this.checkPoints.length;c++)
        {
            let x = this.checkPoints[c][0];
            let y = this.checkPoints[c][1];
            for(let i=0;i<this.points.length;i++)
            {
            let xs = this.points[i][0] - x, ys = this.points[i][1] - y;		
                    xs *= xs;
                    ys *= ys;
                if(Math.sqrt( xs + ys ) < 50)
                {
                    hits++;
                    break;
                }
            }
        }

        if(hits / this.checkPoints.length > 0.55)
        {
            this.completed = true;
            cc.tween(this.completedNode).call(()=>{ECGameController.instance.locker.active = true;}).to(1,{opacity:255})
            .call(()=>{ECGameController.instance.locker.active = false;
            if(this.flag)
            {
                this.setFlagStatus(this.flag, ECFlagStatus.CompleteHidden);
            }
            }).start();
            this.onDestroy();
        }
    }

    addCircle (x,y,fill = false) 
    {
        for(let i=0;i<this.points.length;i++)
        {
          let xs = this.points[i][0] - x, ys = this.points[i][1] - y;		
                xs *= xs;
                ys *= ys;
            if(Math.sqrt( xs + ys ) < 10)
            {
                return;
            }
        }
        this.points.push([x,y]);
        let graphics:cc.Graphics = (this.mask as any)._graphics;
        graphics.roundRect(x-30,y-20,60,40,10)
        graphics.lineWidth = 2
        if(fill)
        {
            graphics.fill();
        }
        this.checkFinish();
        
    }
}