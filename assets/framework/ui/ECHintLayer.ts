import ECBaseLayer from "./ECBaseLayer";
import ECGameController from "../core/ECGameController";
import { HintData } from "../core/ECMasterData";
import ECHintItem from "./ECHintItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECHintLayer extends ECBaseLayer {

    @property(cc.Prefab) HintItemPrefab:cc.Prefab = null;
    @property(cc.Node) HintItemParent:cc.Node = null;

    protected onShowing()
    {
        for(let i= 0; i < ECGameController.instance.master.hints.length;i++)
        {
            var hintData:HintData = ECGameController.instance.master.hints[i];
            if(!hintData.scene || hintData.scene == ECGameController.instance.currentScene.node.name)
            {
                var hintItemNode = cc.instantiate(this.HintItemPrefab);
                var hintItem: ECHintItem = hintItemNode.getComponent(ECHintItem);
                hintItem.data = hintData;
                hintItem.format();
                this.HintItemParent.addChild(hintItemNode);
            }
        }

        this.getComponentInChildren(cc.ScrollView).scrollToTop();
    }

    onHidden()
    {
        this.HintItemParent.destroyAllChildren();
    }
}
