import ECBaseLayer from "./ECBaseLayer";
import ECChatItem from "./ECChatItem";
import { ECEvents, ECSaveKeys } from "../consts/ECConsts";
import ECGameController from "../core/ECGameController";
import ECLocalStorage from "../core/ECLocalStorage";
import ECTouchEvent from "../components/events/ECTouchEvent";
import ECUtils from "../core/ECUtils";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ECChatLayer extends ECBaseLayer
{
    @property(cc.Prefab) chatItmePrefab:cc.Prefab = null;
    @property(cc.Node) content:cc.Node = null;
    @property(cc.ScrollView) scrollView:cc.ScrollView = null;
    @property({type:cc.AudioClip}) newMessage:cc.AudioClip = null;
    @property(cc.Node) newIcon:cc.Node = null;

    beginTouchPoint: cc.Vec2;

    onInitialize()
    {
        this.content.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.content.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        cc.systemEvent.on(ECEvents.ChatMessage,this.onChatMessage,this);
        this.newIcon.active = false;
        this.content.destroyAllChildren();
        this.content.setContentSize(0,0);
    }

    onChatMessage(message:string)
    {
        let currentContent = ECLocalStorage.getItem(ECSaveKeys.ChatContent);
        if(!currentContent || !currentContent.includes(message))
        {
            if(this.newMessage)
            {
                ECGameController.instance.audio.playSound(this.newMessage);
            }
            this.newIcon.active = true;
        }

        if(!currentContent)
        {
            currentContent = message;
        }
        else
        {
            currentContent = JSON.stringify(JSON.parse(currentContent).concat(JSON.parse(message)));
        }
        
        ECLocalStorage.setItem(ECSaveKeys.ChatContent,currentContent,true);

    }

    onTouchStart(touch) {
        this.beginTouchPoint = touch.getLocation();
    }

    onTouchEnd(touch) {
        if(this.beginTouchPoint.sub(touch.getLocation()).mag() > 30)
        {
            return;
        }
        ECUtils.touchEvents(this.content.getComponentsInChildren(ECTouchEvent),touch.getLocation());
    }

    show(args:any[])
    {
        this.newIcon.active = false;
        let currentContent = ECLocalStorage.getItem(ECSaveKeys.ChatContent);
        if(currentContent)
        {
            this.createContent(currentContent);
        }
        super.show();
    }

    createContent(content:string)
    {
        this.content.destroyAllChildren();
        this.content.setContentSize(0,0);
        this.scrollView.scrollToTop();
        let data = JSON.parse(content);

        let height:number = 0;
        for(let i=0;i<data.length;i++)
        {
            let chatItem:ECChatItem= cc.instantiate(this.chatItmePrefab).getComponent(ECChatItem);
            chatItem.format(data[i]);
            this.content.addChild(chatItem.node);
            chatItem.node.y = -height;
            height += data[i]["Height"];
        }
        
        this.content.setContentSize(cc.winSize.width,height);
        if(this.scrollView.node.height < this.scrollView.content.height)
        {
            this.scrollView.scrollToBottom();
        }
    }
}
