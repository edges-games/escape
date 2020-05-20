const {ccclass, property} = cc._decorator;

@ccclass
export default class ECProperties extends cc.Component 
{
    @property(cc.JsonAsset) naitve:cc.JsonAsset = null;
    @property(cc.JsonAsset) game:cc.JsonAsset = null;
    @property(cc.JsonAsset) retains:cc.JsonAsset = null;
    public dictionary:{[key:string]:any} = {};
    public retainSaveKeys:string[] = [];

    onLoad()
    {
        this.retainSaveKeys = this.retains.json;
        this.dictionary = this.game.json;
    }
}
