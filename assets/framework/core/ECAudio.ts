import ECGameController from "./ECGameController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECAudio extends cc.Component 
{

    @property(cc.AudioSource) BGMPlayer:cc.AudioSource = null;
    @property(cc.AudioSource) LoopSoundPlayer:cc.AudioSource = null;
    private lastBGM:cc.AudioClip = null;
    private lastLoopSound:cc.AudioClip = null;

    playBGM(music: cc.AudioClip,fadeIn:number = 0) 
    {
        if(ECGameController.instance.EnableMusic)
        {
            if(this.BGMPlayer.clip != music)
            {
                this.lastBGM = music;
                if(music)
                {
                    this.BGMPlayer.clip = music;
                    this.BGMPlayer.play();
                    if(fadeIn != 0)
                    {
                        this.BGMPlayer.volume = 0;
                        cc.tween(this.BGMPlayer).to(fadeIn,{volume:1},{ easing: 'quintIn'}).start();
                    }
                    else
                    {
                        this.BGMPlayer.volume = 1;
                    }
                }
                else
                {
                    this.BGMPlayer.stop();
                    this.BGMPlayer.clip = null;
                }
            }
        }
    }

    playBGMAsync(sound: string)
    {
        if(ECGameController.instance.EnableSound)
        {
            cc.loader.loadRes(sound,cc.AudioClip,function(error,music)
            {
                this.lastBGM = music;
                this.BGMPlayer.clip = music;
                this.BGMPlayer.play();
            }.bind(this));
        }
    }

    stopBGM(fadeIn:number = 0)
    {
        this.BGMPlayer.stop();
        this.BGMPlayer.clip = null;
        this.lastBGM = null;
    }

    playSound(sound: cc.AudioClip,volume:number=1)
    {
        if(sound && ECGameController.instance.EnableSound)
        {
            cc.audioEngine.setEffectsVolume(volume);
            cc.audioEngine.playEffect(sound,false);
        }
    }

    playSoundAsync(sound: string,volume:number=1)
    {
        if(ECGameController.instance.EnableSound)
        {
            cc.loader.loadRes(sound,cc.AudioClip,function(error,clip)
            {
                cc.audioEngine.setEffectsVolume(volume);
                cc.audioEngine.playEffect(clip,false);
            }.bind(this));
        }
    }

    playSoundLoop(sound: cc.AudioClip)
    {
        if(ECGameController.instance.EnableSound)
        {
            if(this.LoopSoundPlayer.clip != sound)
            {
                this.lastLoopSound = sound;
                this.LoopSoundPlayer.clip = sound;
                this.LoopSoundPlayer.play();
            }
        }
    }

    playSoundLoopAsync(sound: string)
    {
        if(ECGameController.instance.EnableSound)
        {
            if(ECGameController.instance.EnableSound)
            {
                cc.loader.loadRes(sound,cc.AudioClip,function(error,clip)
                {
                    if(this.LoopSoundPlayer.clip != sound)
                    {
                        this.lastLoopSound = clip;
                        this.LoopSoundPlayer.clip = clip;
                        this.LoopSoundPlayer.play();
                    }
                }.bind(this));
            }
        }
    }

    stopSound()
    {
        cc.audioEngine.stopAllEffects();
    }

    stopSoundLoop()
    {
        this.LoopSoundPlayer.stop();
        this.lastLoopSound = null;
    }
}
