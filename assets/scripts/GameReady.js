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
        gglunbo:{
            default:null,
            type:cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.find("MusicBGM").getComponent("MusicControl").PlayBGM();
        // 阿拉丁埋点
        wx.aldSendEvent("游戏准备",{"dmx_preparePage_pv/uv":"页面访问数"});
        this.startTime = Date.now();
        
        //广告位置
        Global.banner.show();
        Global.banner.style.left = 15;
        this.ChangeJumpAppSelectSprite();
    },
    onPlayBtn(){
        //隐藏广告
        Global.banner.hide();
        // 阿拉丁埋点（快速匹配）
        wx.aldSendEvent("游戏准备",{"dmx_preparePage_matching_click":"快速匹配"});
        wx.aldSendEvent("游戏准备页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
          });
        let self = this;
        cc.find("Canvas/PiPeiView").active = true;
        //2s显示匹配成功
        this.scheduleOnce(function() {
            self.text.string = "匹配成功";
            self.content.active = false;
            self.hook.active =true;
            cc.director.loadScene("Game.fire");
        }, 6)
    },
    /**
     * 循环切换广告图片的方法
     */
    ChangeJumpAppSelectSprite() {
        let sprite = this.gglunbo.getChildByName("sprite").getComponent(cc.Sprite);
        this.gglunbo.index = 0;
        this.gglunbo.on("touchend", this.TouchEnd, this);
        this.JumpAppFangSuo(this.gglunbo);
        this.schedule(() => {
            if (this.gglunbo.index < Global.jumpappObject.length - 1) {
                this.gglunbo.index++;
            } else {
                this.gglunbo.index = 0;
            }
            sprite.spriteFrame = Global.jumpappObject[this.gglunbo.index].sprite;
            
        }, 3.0, cc.macro.REPEAT_FOREVER, 0.1);
    },
    /**
    * 游戏广告按钮的放缩
    */
   JumpAppFangSuo: function (node) {
    var self = this;
    this.schedule(function () {
            var action = self.FangSuoFun();
            node.runAction(action);
        }, 1.0, cc.macro.REPEAT_FOREVER, 0.1);
    },

    /**
     * 按钮放缩方法
     */
    FangSuoFun: function () {
        var action = cc.sequence(
            cc.scaleTo(0.5, 1.0, 1.0),
            cc.scaleTo(0.5, 1.2, 1.2),
        );
        return action;
    },
    TouchEnd(event) {
        // 上线前注释console.log("event == ", event.target);
       
        event.stopPropagation();
        // 上线前注释console.log("this.index == ", event.target.index);

        if (CC_WECHATGAME) {
            wx.navigateToMiniProgram({
                appId: Global.jumpappObject[event.target.index].apid,
                path: Global.jumpappObject[event.target.index].path,
                success: function (res) {
                    // 上线前注释console.log(res);
                },
                fail: function (res) {
                    // 上线前注释console.log(res);
                },
            });
        }
    },
    GtoScene(){
        //隐藏广告
        Global.banner.hide();
        cc.director.loadScene("GameStart.fire");
    },
    // update (dt) {},
});
