import ECBaseLayer from "./ECBaseLayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECMessageLayer extends ECBaseLayer
{
    @property(cc.Label) title:cc.Label = null;
    @property(cc.Label) message:cc.Label = null;

    @property(cc.Node) ok:cc.Node = null;
    @property(cc.Node) yes:cc.Node = null;
    @property(cc.Node) no:cc.Node = null;

    private callback:any = null;

    public show(args:any = null)
    {
        if(args[3])
        {
            this.callback = args[3];
        }

        this.title.string = args[0];
        this.message.string = args[1];


        if(args[2] == 1)
        {
            this.ok.active = false;
            this.yes.active = true;
            this.no.active = true;    
        }
        else
        {
            this.ok.active = true;
            this.yes.active = false;
            this.no.active = false;
    
        }

        super.show();
    }

    onClick(event:any, customData:any)
    {
        if(this.callback)
        {
            this.callback(customData);
        }
        this.hide();
    }
}
