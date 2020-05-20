import ECBaseLayer from "./ECBaseLayer";
import ECGameController from "../core/ECGameController";
import { ECEvents } from "../consts/ECConsts";
import ECUIGroup from "./ECUIGroup";
import ECScrapItem from "./ECScrapItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECScrapLayer extends ECBaseLayer {

    @property(cc.Prefab) scrapItemPrefab:cc.Prefab = null;
    @property(cc.Node) scrapItemParent:cc.Node = null;

    protected onShowing()
    {
        for(let i= 0; i < ECGameController.instance.master.scraps.length;i++)
        {
            var scrapData:any = ECGameController.instance.master.scraps[i];
            var scrapItemNode = cc.instantiate(this.scrapItemPrefab);
            var scrapItem: ECScrapItem = scrapItemNode.getComponent(ECScrapItem);
            scrapItem.data = scrapData;
            scrapItem.format();
            this.scrapItemParent.addChild(scrapItemNode);
        }

        this.getComponentInChildren(cc.ScrollView).scrollToTop();
    }

    protected onHidden()
    {
        this.scrapItemParent.destroyAllChildren();
        cc.systemEvent.emit(ECEvents.PanelHid, ECUIGroup.instance.isShowingPanel()?  "Sub" + this.node.name:  this.node.name);
    }
}
