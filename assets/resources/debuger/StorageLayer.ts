import ECGameController from "../../framework/core/ECGameController";
import ECLocalStorage from "../../framework/core/ECLocalStorage";
import StorageItem from "./StorageItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StorageLayer extends cc.Component
{
    @property(cc.Prefab) storeItemPrefab:cc.Prefab = null;
    @property(cc.Node) itemParent:cc.Node = null;
    private isShowinfo:boolean = true;
    
    public onShowing()
    {
        this.itemParent.destroyAllChildren();

        let keys = ECLocalStorage.getSaveKeys(["PLAY_ROUND"]);

        setTimeout(() => {
            for(let key in keys)
            {
                let flag = keys[key];
                let value:any = cc.sys.localStorage.getItem(flag);
                if(value)
                {
                    let data:any = cc.sys.localStorage.getItem(flag);
                    var saveDataNode = cc.instantiate(this.storeItemPrefab);
                    var saveDataItem:StorageItem = saveDataNode.getComponent(StorageItem);
                    saveDataItem.key.string = flag;
                    saveDataItem.value.string = value;
                    saveDataItem.parent = this;
                    this.itemParent.addChild(saveDataNode);
                }
            }
        }, 1);
    }

    delete(key)
    {
        cc.sys.localStorage.removeItem(key);
        ECGameController.instance.master.loadFlags();
        ECGameController.instance.loadSaveData();
        this.onShowing();
    }

    save(key,value)
    {
        cc.sys.localStorage.setItem(key, value);
        ECGameController.instance.loadSaveData();
    }

    clear()
    {
        cc.sys.localStorage.clear();
        ECGameController.instance.master.loadFlags();
        ECGameController.instance.loadSaveData();
        this.onShowing();
    }

    close()
    {
        this.node.destroy();
    }
}
