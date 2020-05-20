import ECGameController from "./ECGameController";

const {ccclass} = cc._decorator;

@ccclass
export default class ECUtils {

    static stopTween(tween:any) {
        (tween&& tween._finalAction.target) && tween.stop();
    }

    public static getProperty(key:string):any
    {
        return ECGameController.instance.properties.dictionary[key];
    }

    public static touchEvents(children:any[], point, process:any = null):any
    {
        for(let i= children.length -1 ; i >= 0; i--)
        { 
            if(children[i].node.activeInHierarchy)
            {
                for(let c=0;c<children[i].colliders.length;c++)
                {
                    const world = (children[i].colliders[c] as any).world
                    if (cc.Intersection.pointInPolygon(point, world.points)) {
                        if(process && process(children[i]))
                        {
                            return children[i];
                        }
                        if(children[i].onTouched())
                        {
                            return children[i];
                        }
                    }
                }
            }
        }
        return null;
    }
}
