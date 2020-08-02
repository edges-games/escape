const {ccclass, property} = cc._decorator;

@ccclass
export default class ECItemButton extends cc.Component 
{
    @property(cc.Sprite) sprite:cc.Sprite = null;
    @property(cc.Sprite) focus:cc.Sprite = null;
    public selected:boolean = false;
    public item:string = "";

    public setSelected(selected:boolean)
    {
        this.selected = selected;
        this.focus.node.active = this.selected;
    }

    initialize(target:cc.Node,component:string,handler:string)
    {
        this.focus.node.active = false;
        this.selected = false;
    }
}
