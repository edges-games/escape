import ECPianoDetailEventData from "./ECPianoDetailEventData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECPianoDetailKey extends cc.Component
{
    @property(ECPianoDetailEventData) piano:ECPianoDetailEventData = null;
    private sprite:cc.Sprite = null;

    onLoad()
    {
        this.sprite = this.getComponentInChildren(cc.Sprite);
        this.sprite.node.active = false;
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this);
    }

    onTouchStart(touch) {

        this.sprite.node.active = true;
        this.piano.onTouchKey(this.node.name);
    }

    onTouchEnd(touch) {

        this.sprite.node.active = false;
    }

}
