import ECBaseLayer from "./ECBaseLayer";
import ECGameController from "../core/ECGameController";
import ECUIGroup from "./ECUIGroup";
import ECLocalization from "../core/ECLocalization";
import { ECStrings } from "../consts/ECConsts";
import ECNative from "../native/ECNative";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECStandupLayer extends ECBaseLayer
{
    @property(cc.Node) continueButton:cc.Node = null;
    @property(cc.AudioSource) bgm:cc.AudioSource = null;

    onEnable()
    {
        if(ECGameController.instance.continueScene)
        {
            this.continueButton.active = true;
        }
        else
        {
            this.continueButton.active = false;
        }
        if(!this.bgm.isPlaying)
        {
            this.bgm.play();
        }
        
    }

    onDisable()
    {
        this.bgm.stop();
    }


    newGame()
    {
        if(this.continueButton.active)
        {
            ECUIGroup.instance.showMessage(["Warning",ECLocalization.format(ECStrings.LK_CLEAR_SAVE_DATA),1,(result)=>{
                if(result == "Yes")
                {
                    this.playNewGame();
                }
            }]);
        }
        else
        {
            this.playNewGame();
        }
    }

    playNewGame()
    {
        ECGameController.instance.clearSaveData(ECGameController.instance.properties.retainSaveKeys);
        ECGameController.instance.master.loadFlags();
        ECGameController.instance.loadSaveData();

        cc.tween(ECGameController.instance.mask)
        .call(()=>{ECGameController.instance.mask.active=true;})
        .to(1,{opacity:255})
        .call(()=>
        {
            cc.resources.load("opening",cc.Prefab,function(error,prefab)
            {
                let openning:cc.Node = cc.instantiate(prefab);
                this.node.parent.addChild(openning);
                this.node.active = false;
                cc.tween(ECGameController.instance.mask).to(1,{opacity:0})
                .delay(3)
                .call(()=>{ECGameController.instance.mask.active=false;})
                .start();
            }.bind(this));
        }).start();
    }

    continueGame()
    {
        ECGameController.instance.changeScene(ECGameController.instance.continueScene,false,()=>{
            ECGameController.instance.startGame();      
            ECUIGroup.instance.hideStandup();
            ECUIGroup.instance.showHUD();});
    }

    review()
    {
        ECNative.goReview(ECLocalization.format(ECStrings.LK_REVIEW_DIALOG_TITLE),ECLocalization.format(ECStrings.LK_REVIEW_DIALOG_CONTENT));
    }

    public showSetting()
    {
        ECUIGroup.instance.showSetting();
    }
}
