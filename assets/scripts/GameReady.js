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
        text:cc.Label,
        content:cc.Node,
        hook:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.find("MusicBGM").getComponent("MusicControl").PlayBGM();
        // 阿拉丁埋点
        wx.aldSendEvent("dmx_preparePage_pv/uv");
        //广告位置
        Global.banner.show();
        Global.banner.style.width = 378;
        Global.banner.style.left = 15;
    },
    onPlayBtn(){
        //隐藏广告
        Global.banner.hide();
        // 阿拉丁埋点（快速匹配）
        wx.aldSendEvent("dmx_preparePage_matching_click");
        let self = this;
        cc.find("Canvas/PiPeiView").active = true;
        //2s显示匹配成功
        this.scheduleOnce(function() {
            self.text.string = "匹配成功";
            self.content.active = false;
            self.hook.active =true;
            cc.director.loadScene("Game.fire");
        }, 2)
    },
    // update (dt) {},
});
