import StorageLayer from "./StorageLayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StorageItem extends cc.Component 
{
    @property(cc.Label) key:cc.Label = null;
    @property(cc.EditBox) value:cc.EditBox = null;
    public parent:StorageLayer = null;
    save()
    {
       this.parent.save(this.key.string,this.value.string);
    }

    delete()
    {
        this.parent.delete(this.key.string);
    }
}
