const {ccclass, property} = cc._decorator;

@ccclass
export default class ECRouteDetailCell extends cc.Component
{
    public value:number = 0;
    public x:number = 0;
    public y:number = 0;
    @property(cc.Sprite) sprite:cc.Sprite = null;
    @property({type:cc.SpriteFrame}) on:cc.SpriteFrame = null;
    @property({type:cc.SpriteFrame}) off:cc.SpriteFrame = null;
}
