
import SaveDataItem from "./SaveDataItem";
import ECGameController from "../../framework/core/ECGameController";
import ECUIGroup from "../../framework/ui/ECUIGroup";
import ECLocalStorage from "../../framework/core/ECLocalStorage";
import { ECSaveKeys } from "../../framework/consts/ECConsts";
const {ccclass, property} = cc._decorator;

@ccclass
export default class SaveDataLayer extends cc.Component
{
    @property(cc.Prefab) saveDataPrefab:cc.Prefab = null;
    @property(cc.Node) itemParent:cc.Node = null;

    public onShowing()
    {
        this.itemParent.destroyAllChildren();

        let value = cc.sys.localStorage.getItem("SYS_SAVE_DATA_KEYS");
        let keys = [];
        if(value)
        {
            keys = JSON.parse(value);
        }

        for(let i=0;i<keys.length;i++)
        {
            let data:any = JSON.parse(cc.sys.localStorage.getItem(keys[i]));
            var saveDataNode = cc.instantiate(this.saveDataPrefab);
            var saveDataItem:SaveDataItem = saveDataNode.getComponent(SaveDataItem);
            saveDataItem.data = data;
            saveDataItem.key = keys[i];
            saveDataItem.parent = this;
            saveDataItem.format();
            this.itemParent.addChild(saveDataNode);
        }
    }

    newGame()
    {
        let data = {};
        let keys:string[] = ECLocalStorage.getSaveKeys();
        for(let i=0; i < keys.length; i++)
        {
            let key:string = keys[i];
            let value = cc.sys.localStorage.getItem(key);
            if(value)
            {
                data[key] = value;
            }
        }

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        data["data_name"] = yyyy + "/" + mm + "/" + dd + "\n" + (ECGameController.instance.currentScene ? ECGameController.instance.currentScene.node.name : "startup");

        let value:string = JSON.stringify(data);
        cc.log(value);
        cc.sys.localStorage.setItem(this.getSaveDataKey(), value);

        this.onShowing();
    }

    getSaveDataKey():string
    {
        let value = cc.sys.localStorage.getItem("SYS_SAVE_DATA_KEYS");
        let keys = [];
        let newKey = "";
        if(!value)
        {
            newKey = "SYS_SAVE_DATA_1";
            keys.push(newKey);
            
        }
        else
        {
            keys = JSON.parse(value);

            let max:number = 1;
            for(let i=0;i<keys.length;i++)
            {
                let num:number = parseInt(keys[i].replace("SYS_SAVE_DATA_",""));
                if(num > max)
                {
                    max = num;
                }
            }
            newKey = "SYS_SAVE_DATA_" + (max + 1);
            keys.push(newKey);
        }

        cc.sys.localStorage.setItem("SYS_SAVE_DATA_KEYS", JSON.stringify(keys));
        return newKey;
    }

    loadSaveData(key:string)
    {
        let value = cc.sys.localStorage.getItem(key);

        if(value)
        {
            cc.log(value);
            let saveDatas = JSON.parse(value);

            ECGameController.instance.clearSaveData([ECSaveKeys.EnableSound,ECSaveKeys.EnableMusic,ECSaveKeys.EnableVibration]);
            for(let key in saveDatas)
            {
                cc.sys.localStorage.setItem(key, saveDatas[key]);
            }

            ECGameController.instance.master.loadFlags();
            ECGameController.instance.loadSaveData();

            ECGameController.instance.changeScene(ECGameController.instance.continueScene,false,()=>{
                ECGameController.instance.audio.stopBGM();
                ECGameController.instance.lightEventParent.destroyAllChildren();
                ECGameController.instance.globleEventParent.destroyAllChildren();
                ECUIGroup.instance.hideSetting();
                ECUIGroup.instance.hideStandup();
                ECUIGroup.instance.showHUD();
                this.node.parent.destroy();
            });
        }
    }

    deleteSaveData(key:string)
    {
        let value = cc.sys.localStorage.getItem("SYS_SAVE_DATA_KEYS");

        if(value)
        {
            let keys = JSON.parse(value);
            const index = keys.indexOf(key);
            if (index > -1) {
                keys.splice(index, 1);
            }
            cc.sys.localStorage.removeItem(key);
            cc.sys.localStorage.setItem("SYS_SAVE_DATA_KEYS",JSON.stringify(keys));
        }

        this.onShowing();
    }

    close()
    {
        this.node.destroy();
    }
}
