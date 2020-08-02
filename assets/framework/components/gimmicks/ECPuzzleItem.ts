const {ccclass} = cc._decorator;

@ccclass
export default class ECPuzzleItem extends cc.Component 
{
	public x:number;
	public y:number;
    public code:number;
	public sprite:cc.Sprite;
}