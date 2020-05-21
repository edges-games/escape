import BaseLayer from "./ECBaseLayer";
import { ECEvents } from "../consts/ECConsts";
import ECGameController from "../core/ECGameController";
import Native from "../native/ECNative";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECUIGroup extends cc.Component {

    @property(cc.Canvas) Canvas: cc.Canvas = null;
    @property(cc.Prefab) standupPrefab: cc.Prefab = null;
    @property(cc.Prefab) hudPrefab: cc.Prefab = null;
    @property(cc.Prefab) settingPrefab: cc.Prefab = null;
    @property(cc.Prefab) shopPrefab: cc.Prefab = null;
    @property(cc.Prefab) itemBoxPrefab: cc.Prefab = null;
    @property(cc.Prefab) itemPrefab: cc.Prefab = null;
    @property(cc.Prefab) textPrefab: cc.Prefab = null;
    @property(cc.Prefab) hintPrefab: cc.Prefab = null;
    @property(cc.Prefab) hintDetailPrefab: cc.Prefab = null;
    @property(cc.Prefab) scrapPrefab: cc.Prefab = null;
    @property(cc.Prefab) scrapDetailPrefab: cc.Prefab = null;
    @property(cc.Prefab) titlePrefab: cc.Prefab = null;
    @property(cc.Prefab) detailPrefab: cc.Prefab = null;
    @property(cc.Prefab) chatPrefab: cc.Prefab = null;
    @property(cc.Prefab) messagePrefab: cc.Prefab = null;
    @property(cc.Prefab) markPrefab: cc.Prefab = null;
    @property(cc.Prefab) mapPrefab: cc.Prefab = null;
    @property(cc.Prefab) attentionPrefab: cc.Prefab = null;
    @property(cc.Prefab) splashPrefab: cc.Prefab = null;
    private _Standup: cc.Node = null;
    private _HUD: cc.Node = null;
    private _Setting: cc.Node = null;
    private _Shop: cc.Node = null;
    private _Map: cc.Node = null;
    private _ItemBox: cc.Node = null;
    private _Text: cc.Node = null;
    private _Hint: cc.Node = null;
    private _HintDetal: cc.Node = null;
    private _Item: cc.Node = null;
    private _Scrap: cc.Node = null;
    private _ScrapDetail: cc.Node = null;
    private _Title: cc.Node = null;
    private _Detail: cc.Node = null;
    private _Chat: cc.Node = null;
    private _Message: cc.Node = null;
    private _Mark: cc.Node = null;
    private _Attention: cc.Node = null;
    private _Splash: cc.Node = null;
    static instance:ECUIGroup = null;

    onInitialize ()
    {
        ECUIGroup.instance = this;
        cc.systemEvent.on(ECEvents.ShowPanel,this.onShowPanel.bind(this));
        cc.systemEvent.on(ECEvents.HidePanel,this.onHidePanel.bind(this));

        this._Standup = new cc.Node();
        this.node.addChild(this._Standup);
        this._HUD = new cc.Node();
        this.node.addChild(this._HUD);
        this._Setting = new cc.Node();
        this.node.addChild(this._Setting);
        this._Detail = new cc.Node();
        this.node.addChild(this._Detail);
        this._Map = new cc.Node();
        this.node.addChild(this._Map);
        this._ItemBox = new cc.Node();
        this.node.addChild(this._ItemBox);
        this._Chat = new cc.Node();
        this.node.addChild(this._Chat);
        this._Mark = new cc.Node();
        this.node.addChild(this._Mark);
        this._Text = new cc.Node();
        this.node.addChild(this._Text);
        this._Hint = new cc.Node();
        this.node.addChild(this._Hint);
        this._HintDetal = new cc.Node();
        this.node.addChild(this._HintDetal);
        this._Shop = new cc.Node();
        this.node.addChild(this._Shop);
        this._Item = new cc.Node();
        this.node.addChild(this._Item);
        this._Scrap = new cc.Node();
        this.node.addChild(this._Scrap);
        this._ScrapDetail = new cc.Node();
        this.node.addChild(this._ScrapDetail);
        this._Title = new cc.Node();
        this.node.addChild(this._Title);
        this._Message = new cc.Node();
        this.node.addChild(this._Message);
        this._Attention = new cc.Node();
        this.node.addChild(this._Attention);
        this._Splash = new cc.Node();
        this.node.addChild(this._Splash);

        this.showLaver(this.detailPrefab, this._Detail, false);
        this.showLaver(this.textPrefab, this._Text, true);
        this.showLaver(this.itemPrefab, this._Item, false);
        this.showLaver(this.scrapDetailPrefab, this._ScrapDetail, false);
        this.showLaver(this.titlePrefab, this._Title, false);
    }

    private showLaver(layerPrefab:cc.Prefab, parent:cc.Node, active:boolean = true, args:any = null)
    {
        if(parent.childrenCount == 0)
        {
            let layer:cc.Node = cc.instantiate(layerPrefab);
            let baseLayer:BaseLayer = layer.getComponent(BaseLayer);
            let widgets:cc.Widget[] = layer.getComponentsInChildren(cc.Widget);
        
            for(let i=0;i<widgets.length;i++)
            {
                widgets[i].target = this.Canvas.node;
                widgets[i].right = 0;
                widgets[i].top = 0;
                widgets[i].left = 0;
                widgets[i].bottom = 0;
            }
            parent.addChild(layer);
            baseLayer.onInitialize();
            if(active)
            {
                baseLayer.show(args);
            }
            else
            {
                layer.active = false;
            }
            
        }
        else
        {
            parent.getComponentInChildren(BaseLayer).show(args);
        }
    }

    public closeAllPanel()
    {

    }

    public showStandup()
    {
        this.showLaver(this.standupPrefab, this._Standup);
    }

    public showSplash()
    {
        this.showLaver(this.splashPrefab, this._Splash);
    }

    public hideSplash()
    {
        this._Splash.destroy();
    }

    public showAttention()
    {
        this.showLaver(this.attentionPrefab, this._Attention);
    }

    public hideAttention()
    {
        this._Attention.destroy();
    }

    public hideStandup()
    {
        if(this._Standup.childrenCount > 0)
        {
            this._Standup.destroyAllChildren();
        }
    }

    public hideSetting()
    {
        if(this._Setting.childrenCount > 0)
        {
            this._Setting.getComponentInChildren(BaseLayer).node.active = false;
        }
    }

    public showHUD()
    {
        this.showLaver(this.hudPrefab, this._HUD);
    }

    public hideHUD()
    {
        if(this._HUD.childrenCount > 0)
        {
            this._HUD.getComponentInChildren(BaseLayer).node.active = false;
        }
    }

    public isShowingPanel()
    {
        return  false;
 
    }

    public onShowPanel(panel,param)
    {
        if(panel == "Map")
        {

        }
        else if(panel == "Chat")
        {

        }
        else if(panel == "Item")
        {

        }
    }

    public onHidePanel(panel)
    {
        if(panel == "Map")
        {
  
        }
        else if(panel == "Detail")
        {
   
        }
        else if(panel == "Item")
        {
 
        }
    }

    public showHint()
    {
        this.showLaver(this.hintPrefab, this._Hint);
    }

    public showItemBox()
    {
        this.showLaver(this.itemBoxPrefab, this._ItemBox);
    }

    public showShop()
    {
        this.showLaver(this.shopPrefab, this._Shop);
    }

    public showMap()
    {
        this.showLaver(this.mapPrefab, this._Map);
    }

    public showMovie()
    {
        Native.showUnityVideoAd((result)=>{if(result == "completed") ECGameController.instance.getCoin(1);});
    }

    public showSetting()
    {
       this.showLaver(this.settingPrefab, this._Setting);
    }

    public showScrap()
    {
        this.showLaver(this.scrapPrefab, this._Scrap);
    }

    public showScrapDetail(data:any)
    {
        this.showLaver(this.scrapDetailPrefab, this._ScrapDetail, true, data);
    }
    
    public showChat()
    {
        this.showLaver(this.chatPrefab, this._Chat);
    }

    public showMessage(data:any)
    {
        this.showLaver(this.messagePrefab, this._Message, true, data);
    }

    public showHintDetal(data:any)
    {
        this.showLaver(this.hintDetailPrefab, this._HintDetal, true, data);
    }
}
