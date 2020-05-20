import { ECEvents } from "../../consts/ECConsts";
import ECEffect from "../../core/ECEffect";
import ECGameController from "../../core/ECGameController";

const {ccclass, property} = cc._decorator;

@ccclass class EffectData{Group:string;Trigger:string;Parent:string;Rate:number;Prefab:string;Actions:string;LeftTime:number;Delay:number;Params:string[]};
@ccclass
export default class EffectEmitter extends cc.Component 
{
    @property(cc.JsonAsset) effects:cc.JsonAsset = null;
    @property(cc.Node) gameEffectParent:cc.Node = null;
    @property(cc.Node) uiEffectParent:cc.Node = null;
    private effectData:{[key: string]: EffectData[]} = null;

    onLoad () 
    {
        let effects:EffectData[] = this.effects.json;
        this.effectData = {};
        for(let i=0;i<effects.length;i++)
        {
            if(!this.effectData[effects[i].Trigger])
            {
                this.effectData[effects[i].Trigger] = [];
            }

            this.effectData[effects[i].Trigger].push(effects[i]);
        }

        cc.systemEvent.on(ECEvents.PanelHid, this.onPanelHid, this);
        cc.systemEvent.on(ECEvents.SceneChanged, this.onSceneChanged, this);
        cc.systemEvent.on(ECEvents.LightTwinkle, this.onLightTwinkle, this);
        cc.systemEvent.on(ECEvents.Raycast, this.onRaycast, this);
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }

    getEffectDataByRate(effectData:EffectData[]): EffectData[]
    {
        let group:{[key:string]:number[]} = {};
        for(let i=0;i<effectData.length;i++)
        {
            let rate = Math.max(effectData[i].Rate, 100);
            for(let r=0;r<rate;r++)
            {
                if(!group[effectData[i].Group])
                {
                    group[effectData[i].Group] = [];
                }
                if(r < effectData[i].Rate)
                {
                    group[effectData[i].Group].push(i);
                }
                else
                {
                    group[effectData[i].Group].push(-1);
                }
            }
        }

        let effects:EffectData[] = [];
        for(let key in group)
        {
            let randomIndex = group[key][Math.floor(Math.random() * group[key].length)];
            if(randomIndex != -1)
            {
                effects.push(effectData[randomIndex]);
            }
        }
      
        return effects;
        
    }
    
    onRaycast(param:string)
    {
        this.emitEffect(ECEvents.Raycast,param);
    }

    onPanelHid(panel:string)
    {
        this.emitEffect(ECEvents.PanelHid,panel);
    }

    onLightTwinkle(light:string)
    {
        this.emitEffect(ECEvents.LightTwinkle,light);
    }

    onSceneChanged(scene:string)
    {
        this.emitEffect(ECEvents.SceneChanged,scene);
    }

    emitEffect(trigger:string,param:string = null)
    {
        let self = this;
        let effects:EffectData[] = this.getEffectDataByRate(this.effectData[trigger]);
        for(let i=0;i<effects.length;i++)
        {
            let data = effects[i];
            if((trigger == ECEvents.PanelHid || trigger == ECEvents.SceneChanged) && !data.Params.includes(param))
            {
                continue;
            }
            setTimeout(() => 
            {
                if(ECGameController.instance.locker.active)
                {
                    return;
                }
                let parent:cc.Node = data.Parent == "UI" ? this.uiEffectParent: this.gameEffectParent;
                if(data.Actions)
                {
                    cc.loader.loadRes(data.Actions,cc.JsonAsset,function(error,jsonAsset)
                    {
                        cc.loader.loadRes(data.Prefab,cc.Prefab,function(error,prefab)
                        {
                            self.createEffect(parent, data, prefab, jsonAsset.json);
                        });
                    });
                }
                else
                {
                    cc.loader.loadRes(data.Prefab,cc.Prefab,function(error,prefab)
                    {
                        self.createEffect(parent, data, prefab, []);
                    });
                }
            }, data.Delay * 1000);
        }
    }

    createEffect(parent:cc.Node, data:EffectData, prefab:cc.Prefab, actions:any[])
    {
        let effectNode:cc.Node = cc.instantiate(prefab);
        let ecEffect:ECEffect = effectNode.addComponent(ECEffect);
        ecEffect.actionData = actions;
        ecEffect.lifeTime = data.LeftTime || 0;
        parent.addChild(effectNode);
    }
}

