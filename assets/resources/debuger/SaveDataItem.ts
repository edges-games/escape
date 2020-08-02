import SaveDataLayer from "./SaveDataLayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SaveDataItem extends cc.Component 
{
    @property(cc.Label) title:cc.Label = null;
    public parent:SaveDataLayer = null;
    public data:any = null;
    public key:string = "";

    format()
    {
        this.title.string = this.key.replace("SYS_SAVE_DATA_","") + "." +  this.data["data_name"];
    }

    load()
    {
        this.parent.loadSaveData(this.key);
    }

    delete()
    {
        this.parent.deleteSaveData(this.key);
    }
}
