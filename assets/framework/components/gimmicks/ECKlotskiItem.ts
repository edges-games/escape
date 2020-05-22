const {ccclass} = cc._decorator;

@ccclass
export default class ECKlotskiItem extends cc.Component 
{
    public x:number;
    public y:number;
    public sizeX:number;
    public sizeY:number;
    public minX:number;
    public minY:number;
    public maxX:number;
    public maxY:number;
    public type:number;
    public sprite:cc.Sprite;
}
