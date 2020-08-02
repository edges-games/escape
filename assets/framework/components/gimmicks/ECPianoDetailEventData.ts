import ECDetailEventData from "./ECDetailEventData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECPianoDetailEventData extends ECDetailEventData
{
    @property music:string = "";
    private currentMusic:string = "";

    onTouchKey(key)
    {
        cc.resources.load("audios/se/se_piano_" + key, cc.AudioClip, function (err, clip) {
            var audioID = cc.audioEngine.playEffect(clip, false);
        });
        this.currentMusic += key;

        if(this.currentMusic.includes(this.music))
        {
            this.unlock(false);
        }
    }
}
