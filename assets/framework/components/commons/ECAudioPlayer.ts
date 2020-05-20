import ECGameController from "../../core/ECGameController";
const {ccclass,property} = cc._decorator;

@ccclass
export default class ECAudioPlayer extends cc.Component 
{
    @property playOnStart:boolean = false;
    @property playOnTouch:boolean = false;
    @property(cc.AudioSource) source:cc.AudioSource = null;

    onLoad () 
    {
        if(this.playOnTouch)
        {
            // this.node.on(cc.Node.EventType.TOUCH_START, function () {
            //     // if(this.playOnTouch && ECGameController.instance.EnableSound)
            //     // {
            //     //     this.source.play();
            //     // }
            //     return true;
            // }, this);
            this.node.on(cc.Node.EventType.TOUCH_END, function () {
                if(this.playOnTouch && ECGameController.instance.EnableSound)
                {
                    this.source.play();
                }
            }, this);
            // this.node.on(cc.Node.EventType.TOUCH_CANCEL, function () {

            // }, this);
            // this.node.on(cc.Node.EventType.TOUCH_MOVE, function () {
            // }, this);
        }
    }

    start()
    {
        if(this.playOnStart && ECGameController.instance.EnableSound)
        {
            this.source.play();
        }
    }
}
