const {ccclass, property} = cc._decorator;

@ccclass
export default class ECPlatformActive extends cc.Component {

    @property IOS:boolean = false;
    @property Android:boolean = false;

    start () 
    {
        this.node.active = false;

        if(this.IOS && cc.sys.os == cc.sys.OS_IOS)
        {     
            this.node.active = true;
        }

        if(this.Android && cc.sys.os == cc.sys.OS_ANDROID)
        {
            this.node.active = true;
        }
    }
}
