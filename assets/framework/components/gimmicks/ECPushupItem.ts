const {ccclass, property} = cc._decorator;

@ccclass
export default class ECPushupItem extends cc.Component {
    public  spriteOn:cc.Sprite;
    public  spriteOff:cc.Sprite;

	public  x:number = 0;
	public  y:number = 0;

    private _isOn: boolean = false;
    get isOn(): boolean {
        return this._isOn;
    }
    set isOn(value: boolean) {
        this._isOn = value;
        this.spriteOn.node.active = value;
        this.spriteOff.node.active = !value;
    }
}
