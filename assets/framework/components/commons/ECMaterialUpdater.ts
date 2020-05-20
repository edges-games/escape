const {ccclass, property} = cc._decorator;

@ccclass
export default class MaterialUpdater extends cc.Component
{
    private material: cc.Material = null;
    private renderComponent:cc.RenderComponent = null;
    private time:number = 0;
    @property maxTime = 0;
    onLoad()
    {
        this.renderComponent = this.getComponent(cc.RenderComponent);
        
    }

    update(dt)
    {
        this.time += dt;
        if(this.maxTime != 0 && this.time > this.maxTime) this.time = 0;
        this.material = this.getComponent(cc.RenderComponent).getMaterial(0);
        this.material.setProperty("time", this.time);
        this.renderComponent.setMaterial(0, this.material);
    }
}
