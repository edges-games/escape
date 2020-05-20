import ECBaseLayer from "./ECBaseLayer";
import ECItemDetail from "./ECItemDetail";
import ECItemButton from "./ECItemButton";
import { ECEvents } from "../consts/ECConsts";
import ECGameController from "../core/ECGameController";
import ECItemPageButton from "./ECItemPageButton";
import ECLocalization from "../core/ECLocalization";
import ECUIGroup from "./ECUIGroup";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECItemBoxLayer extends ECBaseLayer
{
    @property(cc.Node) itemsFrame:cc.Node = null;
    @property(cc.Node) itemsParent:cc.Node = null;
    @property(cc.Node) detailParent:cc.Node = null;
    @property(cc.Prefab) itemButtonPrefab:cc.Prefab = null;
    @property(cc.Prefab) itemDetailPrefab:cc.Prefab = null;
    @property(cc.Sprite) bagButton:cc.Sprite = null;
    @property(cc.Prefab) pageButtonPrefab:cc.Prefab = null;
    @property(cc.Node) lockPanel:cc.Node = null;
    @property(cc.Node) pageSelector:cc.Node = null;
    @property(cc.Node) pageButtonParent:cc.Node = null;
    @property(cc.Node) backButton:cc.Node = null;
    @property(cc.Node) useItemLabel:cc.Node = null;
    @property(cc.Integer) totalPageCount:number = 0;
    @property(cc.Integer) countOfPage:number = 10;
    @property(cc.Integer) countOfRow:number = 5;
    @property(cc.Integer) spaceOfPage:number = 500;
    @property(cc.Integer) currentPage:number = 0;
    @property(cc.Vec3)  offset:cc.Vec3 = new cc.Vec3(80,80,0);
    @property({type:cc.AudioClip}) itemSelect = null;
    @property({type:cc.AudioClip}) itemChanged = null;
    @property({type:cc.AudioClip}) itemError = null;
    @property(cc.Component.EventHandler) onDismantle:cc.Component.EventHandler = null;
 
    public items:ECItemButton[] = [];
    public selected:ECItemButton[] = [];
    public detailItems:ECItemDetail[] = [];
    private beginPos:cc.Vec3 = null;
    private beginTouchPoint:cc.Vec2 = null;
    private startMove:boolean = false;

    onInitialize()
    {
        cc.systemEvent.on(ECEvents.EquipItem,this.onItemEquip.bind(this));

        //监听触摸开始事件
        this.itemsFrame.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        //监听触摸移动事件
        this.itemsFrame.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        //监听作用域内触摸抬起事件
        this.itemsFrame.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
    }

    public equip()
    {
        if(this.selected.length == 1)
        {
            ECGameController.instance.equipItem(this.selected[0].item);
            this.hide();
        }
    }

    protected onShowing()
    {
        this.backButton.active = (false);
        this.resetItems();
        this.lockPanel.active = (false);
        this.onItemEquip();
        if(!ECGameController.instance.currentItem)
        {
            this.useItemLabel.active = true;
        }
    }

    onItemEquip()
    {
        if(ECGameController.instance.currentItem)
        {
            cc.loader.loadRes("items/" + ECGameController.instance.currentItem + "_u",
             cc.SpriteFrame,function (err, spriteFrame) {
                 this.bagButton.spriteFrame = spriteFrame; 
                }.bind(this));

                this.useItemLabel.active = false;
        }
        else
        {
            cc.loader.loadRes("items/btn_close",
             cc.SpriteFrame,function (err, spriteFrame) {this.bagButton.spriteFrame = spriteFrame; }.bind(this));
             this.useItemLabel.active = true;
        }
    }

    public resetItems()
    {
        this.totalPageCount = Math.floor(ECGameController.instance.items.length / this.countOfPage +  (ECGameController.instance.items.length % this.countOfPage == 0 ? 0 : 1));

        if(this.currentPage != 0)
        {
            if(this.currentPage >= this.totalPageCount)
            {
                this.currentPage = this.totalPageCount - 1;
            }
        }

        this.itemsParent.destroyAllChildren();
        this.itemsParent.position = new cc.Vec3(this.currentPage * - this.spaceOfPage,0,0);
        this.selected = [];
        this.detailParent.destroyAllChildren();
        this.items = [];
        this.pageButtonParent.destroyAllChildren();
        this.pageSelector.active = false;
        let x = 0;
        let y = 0;
        for(let i = 0; i < ECGameController.instance.items.length; i++)
        {
            let sp:ECItemButton = cc.instantiate(this.itemButtonPrefab).getComponent(ECItemButton);
            sp.item = ECGameController.instance.items[i];
            sp.initialize(this.node,"ItemBoxLayer","onSelectItem");
            cc.loader.loadRes("items/" + sp.item,cc.SpriteFrame,
                function(error,spriteFrame){
                    sp.sprite.spriteFrame = spriteFrame;
                }
            )
            this.itemsParent.addChild(sp.node);

            x = Math.floor(i / this.countOfPage) * this.spaceOfPage;

            if(i % this.countOfPage == 0)
            {
                y = 0;
            }
            sp.node.position = new cc.Vec3(i % this.countOfRow * this.offset.x + x, Math.floor( y / this.countOfRow)*-this.offset.y, 0);
            this.items.push(sp);

            if(ECGameController.instance.currentItem)
            {
                if(sp.item == ECGameController.instance.currentItem)
                {
                    this.selectItem(sp,false);
                }
            }

            y++;
        }

        if(this.totalPageCount > 1)
        {
            let startX:number = (60 * this.totalPageCount) /-2 + 60 /2 ;
            for(let i=0;i<this.totalPageCount;i++)
            {
                let button:ECItemPageButton = cc.instantiate(this.pageButtonPrefab).getComponent(ECItemPageButton);
                this.pageButtonParent.addChild(button.node);
                button.page = i;
                button.itemBox = this;
                button.node.position = new cc.Vec3(i * 60 + startX,0,0);
            }

            this.updatePageSelector();
        }
    }
   
    public changePage(page)
    {
        this.currentPage = page;
        this.updatePage();
    }
   
    public updatePage()
    {
        this.updatePageSelector();

        cc.tween(this.itemsParent).to(0.2,{x:this.currentPage * - this.spaceOfPage}).start();
    }
      

    public updatePageSelector()
    {
        if(this.pageButtonParent.childrenCount > 0)
        {
            this.pageSelector.active = true;

            let pages:ECItemPageButton[] = this.pageButtonParent.getComponentsInChildren(ECItemPageButton);

            for(let i=0;i<pages.length;i++)
            {
                let page:ECItemPageButton = pages[i]
                if(page.page == this.currentPage)
                {
                    this.pageSelector.x = page.node.x;
                }
            }
        }
    }

    public combine()
    {
        this.lockPanel.active = true;
        if(this.selected.length == 2)
        {
            let newItem:string = ECGameController.instance.combineItem(this.selected[0].item, this.selected[1].item);
            if(newItem)
            {
                this.combineCoroutine(newItem);
                ECGameController.instance.audio.playSound(this.itemChanged);
            }
            else
            {
                ECGameController.instance.audio.playSound(this.itemError);
                this.lockPanel.active = false;
            }
        }
        else
        {
            ECGameController.instance.audio.playSound(this.itemError);
            this.lockPanel.active = false;
        }

    }


    public combineCoroutine(newItem:string)
    {
        let usetime:number = 0.5;
        cc.tween(this.detailItems[0].node).to(usetime,{x:0,opacity:0}).start();
        cc.tween(this.detailItems[1].node).to(usetime,{x:0,opacity:0}).start();

        cc.tween(this.node).delay(usetime).call(
            ()=>
            {
                this.resetItems();

                for(let i=0;i<this.items.length;i++)
                {
                    if(this.items[i].item == newItem)
                    {
                        this.selectItem(this.items[i],false);
                        break;
                    }
                }

                this.lockPanel.active = false;
            }
        ).start();
    }

    public dismantle()
    {
        if(this.selected.length == 1)
        {
            if(this.onDismantle)
            {
                if(this.onDismantle.target.getComponent((this.onDismantle as any)._componentName)[this.onDismantle.handler](this,this.selected[0].item))
                {
                    return;
                }
            }

            let newItems:string[] = ECGameController.instance.dismantleItem(this.selected[0].item);
            
            if(newItems.length > 0)
            {
                this.resetItems();

                for(let i=0;i<this.items.length;i++)
                {
                    let button:ECItemButton = this.items[i];
                    for(let j=0;j<newItems.length;j++)
                    {
                        let item:string = newItems[j];

                        if(button.item == item)
                        {
                            this.selectItem(button,false);
                        }
                    }
                }
                ECGameController.instance.audio.playSound(this.itemChanged);
            }
            else
            {
                ECGameController.instance.audio.playSound(this.itemError);
            }
        }
        else
        {
            ECGameController.instance.audio.playSound(this.itemError);
        }
    }

    public onSelectItem(node)
    {
        this.selectItem(node.getComponent(ECItemButton));
    }

    public selectItemByName(itemName:string)
    {
        for(let i=0;i<this.items.length;i++)
        {
            if(this.items[i].item == itemName)
            {
                this.selectItem(this.items[i]);
            }
        }
    }

    public selectItem(item:ECItemButton,playSound:boolean = true)
    {
        if(this.selected.length > 1)
        {
            for(let i=0;i<this.items.length;i++)
            {
                this.items[i].setSelected(false);
            }
            this.selected = [];
        }

        item.setSelected(!item.selected);
        if(playSound)
        {
            ECGameController.instance.audio.playSound(this.itemSelect);
        }
        if(item.selected)
        {
            this.selected.push(item);
        }
        else
        {
            if(item.item == ECGameController.instance.currentItem)
            {
                ECGameController.instance.currentItem = "";
                cc.systemEvent.emit(ECEvents.EquipItem);
            }
            const index = this.selected.indexOf(item);
            if (index > -1) {
                this.selected.splice(index, 1);
            }
        }
        if(this.selected.length > 1)
        {
            ECGameController.instance.currentItem = "";
            cc.systemEvent.emit(ECEvents.EquipItem);
        }

        this.updateDetail();
    }

    public updateDetail()
    {
        this.detailParent.destroyAllChildren();
        this.detailItems = [];
        this.backButton.active = (false);

        for(let i=0;i<this.selected.length;i++)
        {
            let button:ECItemButton = this.selected[i];

            let II:ECItemDetail = cc.instantiate(this.itemDetailPrefab).getComponent(ECItemDetail);
            II.useItemCamera = this.selected.length == 1;
            II.initialize();
            cc.loader.loadRes("items/" + this.selected[i].item,cc.SpriteFrame,
            function(error,spriteFrame){{II.setSpriteTexture(spriteFrame);}});
            this.detailParent.addChild(II.node);
            this.detailItems.push(II);
            II.text.string = ECLocalization.format("LK_"+this.selected[i].item.toUpperCase()+"_NAME");
            II.desc.string = ECLocalization.format("LK_"+this.selected[i].item.toUpperCase()+"_DESC");
            for(let i=0;i<this.detailItems.length;i++)
            {
                this.detailItems[i].node.position = new cc.Vec3((this.detailItems.length==1?0:-110 )+ i * 220, 0, 0);
                
            }

            if(this.selected.length > 1)
            {
                II.targetSprite.node.setContentSize(200,200);
                II.desc.node.active = (false);
                II.text.node.y = 100;
                II.targetSprite.node.y = -50;
               
            }
            else
            {
                if(ECGameController.instance.master.items[button.item].back)
                {
                    this.backButton.active = true;
                }
            }
        }

        if(this.selected.length > 0)
        {
            this.useItemLabel.active = false;
        }
        else
        {
            this.useItemLabel.active = true;
        }
    }

    onTouchStart(touch)
    {
        this.startMove = false;
        this.beginTouchPoint = touch.getLocation();
        this.beginPos = this.itemsParent.position;
    }

    onTouchMove(touch)
    {
        let pos:cc.Vec2 = touch.getLocation();
        if(this.startMove || Math.abs(this.beginTouchPoint.x - pos.x) > 10)
        {
            this.startMove = true;
            this.itemsParent.position = new cc.Vec3(this.beginPos.x + (pos.x - this.beginTouchPoint.x), 0, 0);
        }
    }

    onTouchEnd(touch)
    {
        let pos:cc.Vec3 = touch.getLocation();

        if(Math.abs(pos.x - this.beginTouchPoint.x) > 30)
        {
            if(pos.x > this.beginTouchPoint.x)
            {
                this.currentPage--;
                if(this.currentPage < 0)
                {
                    this.currentPage = 0;
                }
                this.updatePage();
            }
            else
            {
                this.currentPage++;
                if(this.currentPage >= this.totalPageCount)
                {
                    this.currentPage = this.totalPageCount - 1;
                }
                this.updatePage();
            }
        }
        else
        {
            this.updatePage();
        }

        if(this.beginTouchPoint.sub(touch.getLocation()).mag() > 30)
        {
            return;
        }

        for(let i= this.itemsParent.childrenCount -1 ; i >= 0; i--)
        {
            const world = (this.itemsParent.children[i].getComponent(cc.BoxCollider) as any).world
        
            if (cc.Intersection.pointInPolygon(touch.getLocation(), world.points)) {
                this.onSelectItem(this.itemsParent.children[i]);
            }
        }
    }

    protected onHidden()
    {
        cc.systemEvent.emit(ECEvents.PanelHid, ECUIGroup.instance.isShowingPanel()?  "Sub" + this.node.name:  this.node.name);
    }
}
