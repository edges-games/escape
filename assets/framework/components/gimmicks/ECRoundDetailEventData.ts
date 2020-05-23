import ECDetailEventData from "./ECDetailEventData";
import ECRoundItem from "./ECRoundItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECRoundDetailEventData extends ECDetailEventData 
{
    @property([ECRoundItem]) items:ECRoundItem[] = [];
    @property([cc.Integer]) passwords:number[] = [];
    private excuting:boolean;

    onInitialize()
    {
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
    }

    onTouchStart(touch)
    {
        if(this.isCompleted) return;
        
		for (let i=0;i<this.items.length;i++)
		{
			let item:ECRoundItem = this.items[i];

			if(item != null)
			{
				const world = (item.getComponent(cc.PolygonCollider) as any).world;
				if (cc.Intersection.pointInPolygon(touch.getLocation(), world.points))
				{
					this.clickRound(item);
					return;
				}
			}
		}
    }
    
    onDestroy()
    {
        this.node.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
    }

    public clickRound(item:ECRoundItem)
    {
        if(!this.excuting)
        {
            this.excuting = true;
        
            let index:number = item.index;
            index++;
            if(index >= item.angles.length)
            {
                index = 0;
            }
            item.index = index;
            cc.tween(item.node).to(0.5,{angle:-item.angles[item.index]}).call(()=>{this.onRoteted(item)}).start();
        }
    }

    onRoteted(item:ECRoundItem)
    {
        this.excuting = false;
        if(item.index == item.angles.length - 1)
        {
            item.index = 0;
            item.node.angle = 0;
        }
        this.check();
        if(this.isCompleted)
        {
            this.unlock(false);
        }
    }

    check()
    {
        for(let i = 0;i<this.passwords.length;i++)
        {
            if(this.passwords[i] != this.items[i].index)
            {
                return;
            }
        }
        this.isCompleted = true;
    }
}
