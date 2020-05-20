import { ECEvents, ECActionTypes, ECFlagStatus } from "../consts/ECConsts";
import ECScene from "./ECScene";
import ECAudio from "./ECAudio";
import ECMasterData, { ItemData } from "./ECMasterData";
import ECProperties from "../consts/ECProperties";
import ECFlashLight from "../components/commons/ECFlashLight";
import ECSaveKeys from "../consts/ECSaveKeys";
import ECLocalStorage from "./ECLocalStorage";
import ECEvent from "../components/events/ECEvent";
import Native from "../native/ECNative";
import { ECShake } from "../action/ECShake";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ECGameController extends cc.Component 
{
    @property(cc.Camera) gameCamera: cc.Camera = null;
    @property(cc.Camera) uiCamera: cc.Camera = null;
    @property(cc.Camera) renderCamera: cc.Camera = null;
    @property(cc.Sprite) targetSprite: cc.Sprite = null;
    @property(ECAudio) public audio:ECAudio = null;
    @property(cc.Node) public mask:cc.Node = null;
    @property(cc.Node) public locker:cc.Node = null;
    @property(cc.Node) gameScene: cc.Node = null;
    @property(cc.Node) lightEventParent: cc.Node = null;
    @property(cc.Node) globleEventParent: cc.Node = null;
    @property(ECMasterData) public master:ECMasterData = null;
    @property(ECProperties) properties:ECProperties = null;
    @property public EnableSound:boolean = true;
    @property public EnableMusic:boolean = true;
    @property public EnableVibration:boolean = true;
    @property(ECFlashLight) flashLight: ECFlashLight = null;
    public static instance:ECGameController = null;
    public items:string[] = [];
    public currentItem = "";
    public hasMap:boolean = false;
    public hasMessage:boolean = false;
    
    public currentScene:ECScene = null;
    public coin:number = 0;
    public continueScene:string = "";

    private totalMarkCount:number = 0;
    public playRound = 0;

    onLoad () 
    {
        ECGameController.instance = this;
        cc.director.getCollisionManager().enabled = true;
        this.globleEventParent.destroyAllChildren();
        this.lightEventParent.destroyAllChildren();
        this.gameScene.destroyAllChildren();
        this.master.onInitialize();

        this.totalMarkCount = 0;
        for(let key in this.master.flags)
        {
            if(key.startsWith("mark_"))
            {
                this.totalMarkCount++;
            }
        }

        // Save keys
        let keys:string[] = Object.keys(ECSaveKeys);

        for(let flag in this.master.flags)
        {
            if(flag == ECSaveKeys.EnableMusic ||
               flag == ECSaveKeys.EnableSound ||
               flag == ECSaveKeys.EnableVibration)
            {
                continue;
            }
            keys.push(flag);
        }

        for(let i = 0; i < this.properties.dictionary.save_keys.length; i++)
        {
            keys.push(this.properties.dictionary.save_keys[i]);
        }

        ECLocalStorage.registSaveKeys(keys);
        // Save keys

        cc.systemEvent.on(ECEvents.GetFlashLight,this.onUpdateFlashLight.bind(this));
        cc.systemEvent.on(ECEvents.GetMap,()=>{;this.hasMap = true;ECLocalStorage.setItem(ECSaveKeys.EnableMap,true,true)});
        cc.systemEvent.on(ECEvents.GetMessage,()=>{;this.hasMessage = true;ECLocalStorage.setItem(ECSaveKeys.EnableMessage,true,true)});
        cc.systemEvent.on(ECEvents.GetItem, this.onGetItem.bind(this), this);
        cc.systemEvent.on(ECEvents.GotoScene,this.changeScene.bind(this));
        cc.systemEvent.on(ECEvents.Effect,this.onEffect.bind(this));
        cc.systemEvent.on(ECEvents.GlobalEvent,this.onGlobalEvent.bind(this));
        cc.systemEvent.on(ECEvents.Event,this.onEvent.bind(this));
        this.loadSaveData();
        this.flashLight.onInitialize();
    }

    public startGame()
    {
        let json = ECLocalStorage.getItem(ECSaveKeys.GlobalEvents);
        if(json)
        {
            let globalEvents:{} = JSON.parse(json);

            for(let k in globalEvents)
            {
                let e:{url:string,flag:string} = globalEvents[k];
                cc.loader.loadRes(e.url,cc.Prefab,function(error,prefab)
                {
                    let node:cc.Node = cc.instantiate(prefab);
                    node.parent = ECGameController.instance.globleEventParent;
                    node.getComponent(ECEvent).onInitialize();
                }.bind(this))
            }
        }
    }

    public overGame()
    {
        this.audio.stopBGM();
        this.audio.stopSoundLoop();
        this.currentScene = null;
        this.gameScene.destroyAllChildren();
        this.globleEventParent.destroyAllChildren(); 
        this.lightEventParent.destroyAllChildren(); 
    }

    onEvent(url)
    {
        cc.loader.loadRes(url,cc.Prefab,function(error,prefab)
        {
            let node:cc.Node = cc.instantiate(prefab);
            node.parent = ECGameController.instance.currentScene.node;
            node.getComponent(ECEvent).onInitialize();
        }.bind(this))
    }

    onGlobalEvent(url,flag)
    {
        let json = ECLocalStorage.getItem(ECSaveKeys.GlobalEvents);
        if(!json)
        {
            json = "{}";
        }
        let globalEvents:{} = JSON.parse(json);
        globalEvents[flag] = {url:url,flag:flag};
        ECLocalStorage.setItem(ECSaveKeys.GlobalEvents,JSON.stringify(globalEvents));

        cc.loader.loadRes(url,cc.Prefab,function(error,prefab)
        {
            let node:cc.Node = cc.instantiate(prefab);
            node.parent = ECGameController.instance.globleEventParent;
            node.getComponent(ECEvent).onInitialize();
        }.bind(this))
    }

    public onEffect(url:string)
    {
        cc.loader.loadRes(url,cc.Prefab,function(error,prefab)
        {
            let effect:cc.Node = cc.instantiate(prefab);
            effect.parent = ECGameController.instance.gameScene;
        }.bind(this))
    }

    public onGetItem(item:string)
    {
        this.items.push(item);
        this.saveItem();
    }

    private onUpdateFlashLight()
    {
        this.flashLight.node.active = this.hasFlashLight() || this.hasFlashLight2();
        if(!ECGameController.instance.hasFlashLight2())
        {
            this.flashLight.Light.active = false;
            this.flashLight.Dark.active = true;
        }
        else
        {
            this.flashLight.Light.active = true;
            this.flashLight.Dark.active = false;
        }
    }

    public hasFlashLight():boolean
    {
        for(let i=0;i<this.items.length;i++)
        {
            if(this.items[i] == this.properties.dictionary.item_flashlight)
            {
                return true;
            }
        }
        return false
    }

    public hasFlashLight2():boolean
    {
        for(let i=0;i<this.items.length;i++)
        {
            if(this.items[i] == this.properties.dictionary.item_flashlight2)
            {
                return true;
            }
        }
        return false
    }

    public getCoin(coin:number)
    {
        this.coin += parseInt(coin as any);
        cc.systemEvent.emit(ECEvents.UpdateCoin, this.coin);
        ECLocalStorage.setItem(ECSaveKeys.Coin,this.coin,true);
        ECGameController.instance.audio.playSoundAsync(this.properties.dictionary.se_update_coin);
    }

    public useCoin(coin:number)
    {
        this.coin -= parseInt(coin as any);
        cc.systemEvent.emit(ECEvents.UpdateCoin, this.coin);
        ECLocalStorage.setItem(ECSaveKeys.Coin,this.coin,true);
        ECGameController.instance.audio.playSoundAsync(this.properties.dictionary.se_update_coin);
    }

    changeScene(scene:string,quick:boolean = false,onChanging=null,canBack=false)
    {
        if(quick) 
        {
            this.changeSceneQuick(scene,quick,canBack,null);
        }
        else
        {
            // if you want to change profomance of transition do it here.
            cc.tween(this.mask)
            .call(()=>{this.mask.active=true;})
            .to(1,{opacity:255})
            .call(()=>{if(onChanging)onChanging();this.changeSceneQuick(scene,quick,canBack,
            ()=>{
                cc.tween(this.mask).call(()=>{cc.systemEvent.emit(ECEvents.ShowTitle, scene);})
                .to(1,{opacity:0})
                .delay(3)
                .call(()=>{this.currentScene.initilaizeEvents(); this.mask.active=false;})
                .start();
            });}).start();
        }
    }

    changeSceneQuick(scene,quick,canBack,callback)
    {
        if(quick)
        {
            this.locker.active = true;
        }
 
        cc.loader.loadRes("scenes/" + scene, function (err, prefab){
            var newNode:cc.Node = cc.instantiate(prefab);
            let newScene:ECScene = newNode.getComponent(ECScene);
            if(this.currentScene && newScene.previousScene)
            {
                newScene.previousPosition = this.currentScene.node.getChildByName("Background").position;
            }
            if(this.currentScene && canBack)
            {
                newScene.previousPosition = this.currentScene.previousPosition;
            }
            
            this.currentScene = newScene;
            this.currentScene.canBack = canBack;
            this.continueScene = this.currentScene.node.name;
            ECLocalStorage.setItem(ECSaveKeys.ContinueScene,this.currentScene.node.name,true);
            let texture:cc.RenderTexture = new cc.RenderTexture();
            texture.initWithSize(cc.winSize.width,cc.winSize.height);
            this.renderCamera.targetTexture = texture;
            let spriteFrame = new cc.SpriteFrame();
            spriteFrame.setTexture(texture);

            this.targetSprite.spriteFrame = spriteFrame;
            this.currentScene.onSceneStart();
            if(quick)
            {
                this.currentScene.initilaizeEvents();
            }
            this.lightEventParent.destroyAllChildren();
            this.gameScene.destroyAllChildren();
            this.gameScene.addChild(newNode);
            newNode.position = cc.Vec3.ZERO;
            cc.systemEvent.emit(ECEvents.SceneChanged,this.continueScene);
            if(callback)
            {
                callback();
            }
            if(quick)
            {
                this.locker.active = false;
            }
        }.bind(this));
    }

    setFlagStatus(flag, status, update, autoSave)
    {
        if(!this.master.flags[flag]) cc.error("There no flag called :" + flag);
        
        this.master.flags[flag].status = status;
        if(update)
        {
            cc.systemEvent.emit(ECEvents.UpdateFlag,flag);
        }
        ECLocalStorage.setItem(flag,status,autoSave);
    }

    getFlagStatus(flag):string
    {
        if(!this.master.flags[flag]) cc.error("There no flag called :" + flag);
        return this.master.flags[flag].status;
    }

    getFlagRound(flag):number
    {
        if(!this.master.flags[flag]) cc.error("There no flag called :" + flag);
        return this.master.flags[flag].round;
    }

    // アイテムを装備する
    equipItem(item:string)
    {
        this.currentItem = item;
        cc.systemEvent.emit(ECEvents.EquipItem);
        this.saveItem();

    }

    // アイテムを合成する
    combineItem(itemA:string, itemB:string):string
    {
        let newitem:string = "";

        for (const key in this.master.items)
        {
            let d:ItemData = this.master.items[key];
            if((d.fromA == itemA || d.fromA == itemB)&&(d.fromB == itemA || d.fromB == itemB))
            {
                newitem = d.item;
                break;
            }
        }

        if(newitem != "")
        {
            this.items.push(newitem);
            this.expendItem(itemA,false);
            this.expendItem(itemB,false);
            this.saveItem();
            cc.systemEvent.emit(ECEvents.UpdateItem);
        }
        return newitem;
    }

    // アイテムを分解する
    dismantleItem(item:string):string[]
    {
        let ids:string[] = [];
        for (const key in this.items)
        {
            let d:ItemData = this.master.items[this.items[key]];
            if(d.item == item)
            {

                if(d.toA != "")
                {
                    ids.push(d.toA);
                    this.items.push(d.toA);

                }

                if(d.toB != "")
                {
                    ids.push(d.toB);
                    this.items.push(d.toB);
                }

                if(ids.length > 0)
                {
                    this.expendItem(item);
                    cc.systemEvent.emit(ECEvents.UpdateItem);
                }
                break;
            }
        }

        return ids;
    }

    // アイテムを消費する
    expendItem(item:string,save:boolean = true)
    {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }

        if(this.currentItem == item)
        {
            this.currentItem = "";
            cc.systemEvent.emit(ECEvents.EquipItem);
        }

        if(save)
        {
            this.saveItem();
        }
    }

    // アイテムを却下する
    demountItem() {
        this.currentItem = "";
        this.saveItem();
    }

    hasItem(item:string)
    {
        for(let i= 0;i<this.items.length;i++)
        {
            if(item == this.items[i])
            {
                return true;
            }
        }
    }

    saveItem()
    {
        ECLocalStorage.setItem(ECSaveKeys.Items,JSON.stringify(this.items),true);
        ECLocalStorage.setItem(ECSaveKeys.CurrentItem,this.currentItem,true);
    }

    saveSettings()
    {
        ECLocalStorage.setItem(ECSaveKeys.EnableSound,this.EnableSound,true);
        ECLocalStorage.setItem(ECSaveKeys.EnableMusic,this.EnableMusic,true);
        ECLocalStorage.setItem(ECSaveKeys.EnableVibration,this.EnableVibration,true);
    }
    
    clearSaveData(except:string[] = []) 
    {
        ECLocalStorage.clearSaveData(except);
    }

    loadSaveData()
    {
        this.continueScene = ECLocalStorage.getItem(ECSaveKeys.ContinueScene);
        this.EnableSound = ECLocalStorage.getItem(ECSaveKeys.EnableSound) || true;
        this.EnableMusic = ECLocalStorage.getItem(ECSaveKeys.EnableMusic) || true;
        this.EnableVibration = ECLocalStorage.getItem(ECSaveKeys.EnableVibration) || true;
        this.items = ECLocalStorage.getItem(ECSaveKeys.Items)? JSON.parse(ECLocalStorage.getItem(ECSaveKeys.Items)):[];
        this.hasMap = ECLocalStorage.getItem(ECSaveKeys.EnableMap) || false;
        this.hasMessage = ECLocalStorage.getItem(ECSaveKeys.EnableMessage) || false;
        this.currentItem = ECLocalStorage.getItem(ECSaveKeys.CurrentItem) || "";
        this.coin = ECLocalStorage.getItem(ECSaveKeys.Coin)? parseInt(ECLocalStorage.getItem(ECSaveKeys.Coin)) : 0;
        this.playRound = ECLocalStorage.getItem("PLAY_ROUND") ? parseInt(ECLocalStorage.getItem("PLAY_ROUND")) : 0;
        for(let key in this.master.flags)
        {
            let flag:string = this.master.flags[key].flag;
            if(ECLocalStorage.getItem(flag))
            {
                this.master.flags[key].status = ECLocalStorage.getItem(flag);
            }
        }

        this.onUpdateFlashLight();
    }

    // イベントが開始、完了するときに実行する動作です。
    excuteActions(target:any, actionData:any,addEnd = true)
    {
        let tween:cc.Tween<cc.Node> = actionData.length > 0 ? cc.tween(this.node): null;
        for(let i=0; i<actionData.length; i++)
        {
            let action = actionData[i];
            let type = action["Type"];
            let params = action["Params"];

            if(type == ECActionTypes.Lock)
            {
                tween.call(()=>{ECGameController.instance.locker.active = true;});
            }
            else if(type == ECActionTypes.Unlock)
            {
                tween.call(()=>{ECGameController.instance.locker.active = false;});
            }
            else if(type == ECActionTypes.Delay)
            {
                tween.delay(params[0]);
            }
            else if(type == ECActionTypes.GotoScene)
            {
                tween.call(()=>{ECGameController.instance.changeScene(params[0],params[1])});
            }
            else if(type == ECActionTypes.Native)
            {
                tween.call(()=>
                {
                    if(params[0] == "Vibrate")
                    {
                        Native.vibrate(parseInt(params[1]));
                    }
                });
            }
            else if(type == ECActionTypes.GotoDetail)
            {
                tween.call(()=>{cc.systemEvent.emit(ECEvents.GotoDetail, params[0]);});
            }
            else if(type == ECActionTypes.UpdateFlag)
            {
                tween.call(()=>
                {
                    let status = ECFlagStatus.Stay;
                    if(params[1] == "Start")
                    {
                        if(this.getFlagStatus(params[0]) != ECFlagStatus.Stay)
                        {
                            return;
                        }
                        status = ECFlagStatus.Start;
                    }
                    else if(params[1] == "Complete")
                    {
                        status = ECFlagStatus.Complete;
                    }
                    else if(params[1] == "CompleteHidden")
                    {
                        status = ECFlagStatus.CompleteHidden;
                    }
                    
                    this.setFlagStatus(params[0], status, true, false);
                });
            }
            else if(type == ECActionTypes.ShakeCamera)
            {
                let camera:cc.Node = null;
                if(params[0] == "UICamera")
                {
                    camera = this.uiCamera.node;
                }
                else if(params[0] == "GameCamera")
                {
                    camera = this.gameCamera.node;
                }
                tween.call(()=>{camera.runAction(ECShake.create(params[1],params[2],params[3]));});
            }
            else if(type == ECActionTypes.ShowText)
            {
                tween.call(()=>{cc.systemEvent.emit(ECEvents.ShowText,params[0])});
            }
            else if(type == ECActionTypes.ShowPanel)
            {
                tween.call(()=>{cc.systemEvent.emit(ECEvents.ShowPanel,params[0],params[1])});
            }
            else if(type == ECActionTypes.HidePanel)
            {
                tween.call(()=>{cc.systemEvent.emit(ECEvents.HidePanel,params[0])});
            }
            else if(type == ECActionTypes.Emit)
            {
                if(params[0] == ECEvents.GetItem)
                {
                    tween.call(()=>{
                        this.items.push(params[1]);
                        ECLocalStorage.setItem(ECSaveKeys.Items,JSON.stringify(this.items));
                    });
                }
                else
                {
                    tween.call(()=>{cc.systemEvent.emit(params[0],params[1],params[2])});
                }
            }
            else if(type == ECActionTypes.PlaySound)
            {
                if(params[1])
                {
                    tween.call(()=>{this.audio.playSoundLoopAsync(params[0])});
                }
                else
                {
                    tween.call(()=>{this.audio.playSoundAsync(params[0])});
                }
            }
            else if(type == ECActionTypes.StopSound)
            {
                tween.call(()=>
                {
                    if(!params || params[0])
                    {
                        this.audio.stopSound();
                    }
                    else
                    {
                        this.audio.stopSoundLoop();
                    }
                });
            }
            else if(type == ECActionTypes.PlayBGM)
            {
                tween.call(()=>{this.audio.playBGMAsync(params[0])});
            }
            else if(type == ECActionTypes.StopBGM)
            {
                tween.call(()=>{this.audio.stopBGM()});
            }
            else if(type == ECActionTypes.Call)
            {
                tween.call(()=>
                {
                    target.node.getComponent(params[0])[params[1]](params[2]);
                });
            }
            else if(type == ECActionTypes.To)
            {
                tween.call(()=>
                {
                    let sprite:cc.Node = null;
                    if(!params[0])
                    {
                        sprite = target.node;
                    }
                    else if(params[0].startsWith("$SCENE/"))
                    {
                        sprite = cc.find(params[0].replace("$SCENE/",""), this.currentScene.node);
                    }
                    else
                    {
                        sprite = cc.find(params[0], target.node);
                    }
                    if(!sprite) cc.warn("Cannot find child:"+params[0]);
                    let p = null;
                    if(params[2] == "Position")
                    {
                        if(params[3])
                        {
                            let values = params[3].split(",");
                            if(values.length == 1)
                            {
                                sprite.x = parseInt(values[0]);
                            }
                            else if(values.length == 2)
                            {
                                sprite.x = parseInt(values[0]);
                                sprite.y = parseInt(values[1]);
                            }
                            else if(values.length == 2)
                            {
                                sprite.x = parseInt(values[0]);
                                sprite.y = parseInt(values[1]);
                                sprite.z = parseInt(values[2]);
                            }
                        }

                        if(params[4])
                        {
                            p = {};
                            let values = params[4].split(",");
                            if(values.length == 1)
                            {
                                p.x = parseInt(values[0]);
                            }
                            else if(values.length == 2)
                            {
                                p.x = parseInt(values[0]);
                                p.y = parseInt(values[1]);
                            }
                            else if(values.length == 2)
                            {
                                p.x = parseInt(values[0]);
                                p.y = parseInt(values[1]);
                                p.z = parseInt(values[2]);
                            }
                        }
                    }
                    else if(params[2] == "Fade")
                    {
                        sprite.opacity = parseInt(params[3]||0);
                        let o:number = parseInt(params[4]||0);
                        p = {opacity: o};
                    }
                    else if(params[2] == "Active")
                    {
                        sprite.active = params[3];
                        return;
                    }
                    else if(params[2] == "Scale")
                    {
                        if(params[3])
                        {
                            let values = params[3].split(",");
                            if(values.length == 1)
                            {
                                sprite.scaleX = parseInt(values[0]);
                                sprite.scaleY = parseInt(values[0]);
                                sprite.scaleZ = parseInt(values[0]);
                            }
                            else if(values.length == 2)
                            {
                                sprite.scaleX = parseInt(values[0]);
                                sprite.scaleY = parseInt(values[1]);
                            }
                            else if(values.length == 2)
                            {
                                sprite.scaleX = parseInt(values[0]);
                                sprite.scaleY = parseInt(values[1]);
                                sprite.scaleZ = parseInt(values[2]);
                            }
                        }

                        if(params[4])
                        {
                            p = {};
                            let values = params[4].split(",");
                            if(values.length == 1)
                            {
                                p.scaleX = parseInt(values[0]);
                                p.scaleY = parseInt(values[0]);
                                p.scaleZ = parseInt(values[0]);
                            }
                            else if(values.length == 2)
                            {
                                p.scaleX = parseInt(values[0]);
                                p.scaleY = parseInt(values[1]);
                            }
                            else if(values.length == 2)
                            {
                                p.scaleX = parseInt(values[0]);
                                p.scaleY = parseInt(values[1]);
                                p.scaleZ = parseInt(values[2]);
                            }
                        }
                        p = {scale: parseInt(params[4])};
                    }
                    
                    cc.tween(sprite).to(params[1],p).start();
                });
            }
            else
            {
                cc.error("Unknown action type:" + type);
            }
        }

        if(tween != null)
        {
            let ecEvent :ECEvent = target as ECEvent;
            if(addEnd && ecEvent && this.master.flags[ecEvent.flag])
            {
                let flag:string = ecEvent.flag;
                let completeHidden:boolean = ecEvent.completeHidden;
                tween.call(()=>
                {
                    this.setFlagStatus(flag,completeHidden? ECFlagStatus.CompleteHidden: ECFlagStatus.Complete,true,true)
                    ECLocalStorage.save();
                });
            }
            else
            {
                tween.call(()=>
                {
                    ECLocalStorage.save();
                });
            }
            tween.start();
        }
    }

    getTotalMarkCount()
    {
        return this.totalMarkCount;
    }

    getCurrentMarkCount():number
    {
        let total:number = 0;
        for(let key in this.master.flags)
        {
            if(key.startsWith("mark_"))
            {
                if(this.master.flags[key].status == ECFlagStatus.CompleteHidden || this.master.flags[key].status == ECFlagStatus.Complete)
                {
                    total++;
                }
            }
        }
        return total;
    }
}
