import ECEvent from "./ECEvent";
import ECGameController from "../../core/ECGameController";
import { ECFlagStatus } from "../../consts/ECConsts"

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECRaycastEvent extends ECEvent 
{
    @property(cc.Prefab) prefab:cc.Prefab = null;
    private colliders:cc.Collider[] = [];
    private point:cc.Vec2 = null;

    start()
    {
        let size:cc.Size = this.node.getContentSize();
        if(size.width != 0 && size.height != 0)
        {
            let x = Math.floor((Math.random() * size.width)) - size.width / 2;
            let y = Math.floor((Math.random() * size.height)) - size.height / 2;

            this.node.setPosition(x,y);
        }
    }

    onInitialize()
    {
        super.onInitialize();

        if(this.flag)
        {
            if(this.getFlagStatus(this.flag) != ECFlagStatus.Start)
            {
                return;
            }
        }

        
        let boxColliders = this.getComponents(cc.BoxCollider);
        for(let i=0;i<boxColliders.length;i++)
        {
            this.colliders.push(boxColliders[i]);
        }

        let polygonColliders = this.getComponents(cc.PolygonCollider);
        for(let i=0;i<polygonColliders.length;i++)
        {
            this.colliders.push(polygonColliders[i]);
        }

        let self = this;
        var step = function() 
        {
            this.point = ECGameController.instance.flashLight.node.parent.convertToWorldSpaceAR(ECGameController.instance.flashLight.node.position);
            for(let i=0;i<self.colliders.length;i++)
            {
                const world = (self.colliders[i] as any).world
                if (cc.Intersection.pointInPolygon(self.point, world.points))
                {
                    self.unschedule(step);
                    self.onCast();
                }
            }
        }
        this.schedule(step, 0.1, cc.macro.REPEAT_FOREVER, 0)
    }

    onCast()
    {
        if(this.actionData.length > 0)
        {
            ECGameController.instance.excuteActions(this, this.actionData);
        }
        else
        {
            if(this.prefab)
            {
                setTimeout(() => {
                    let node:cc.Node = cc.instantiate(this.prefab);
                    node.parent = this.node;
                }, 0);
            }

            if(this.flag)
            {
                this.setFlagStatus(this.flag,this.completeHidden ? ECFlagStatus.CompleteHidden : ECFlagStatus.Complete);
            }
        }
    }
}