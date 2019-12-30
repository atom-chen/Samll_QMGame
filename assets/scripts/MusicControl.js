// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Bgm: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.game.addPersistRootNode(this.node);
        this.PlayBGM();
        if (CC_WECHATGAME) {
            wx.onAudioInterruptionEnd(function(){
                //强行暂停音乐 如果不暂停，调用resumeMusic是无效的，因为是微信让声音消失了
                cc.audioEngine.pauseMusic();
                //恢复音乐播放，比如调用 
                cc.audioEngine.resumeMusic();
                //self.refreshBG();
                //console.log('refreshBG');
            });
        }
    },

    start () {
    },
    PlayBGM(){
        if(cc.audioEngine.isMusicPlaying()){
            return;
        }
        this.current = cc.audioEngine.playMusic(this.Bgm,true);
    },
    StopBGM(){
        cc.audioEngine.stopMusic(this.current);
    },
    // update (dt) {
        
    // },
});
