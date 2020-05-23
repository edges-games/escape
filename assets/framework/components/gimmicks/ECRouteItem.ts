const {ccclass, property} = cc._decorator;

@ccclass
export default class ECRouteItem extends cc.Component
{
    @property(cc.Sprite) sprite:cc.Sprite = null;
    public value:number = 0;
    public x:number = 0;
    public y:number = 0;
}
