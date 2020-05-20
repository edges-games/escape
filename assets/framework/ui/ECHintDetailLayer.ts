import ECBaseLayer from "./ECBaseLayer";
import ECLocalization from "../core/ECLocalization";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HintDetailLayer extends ECBaseLayer {

    @property(cc.Label) title:cc.Label = null;
    @property(cc.Label) content:cc.Label = null;

    public show(args:any)
    {
        this.title.string = ECLocalization.format("LK_" + args.flag.toUpperCase() + "_TITLE");
        this.content.string = ECLocalization.format("LK_" + args.flag.toUpperCase() + "_CONTENT");
        super.show();
    }
}
