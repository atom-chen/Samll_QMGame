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
        gglunbo:{
            default:null,
            type:cc.Node,
        },
        gglunbo_2:{
            default:null,
            type:cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.find("MusicBGM").getComponent("MusicControl").PlayBGM();
        // 阿拉丁埋点
        wx.aldSendEvent("游戏准备_页面访问数");
        this.startTime = Date.now();
        
        this.ChangeJumpAppSelectSprite();
        this.ChangeJumpAppSelectSprite_2();
    },
    onPlayBtn(){
        // 阿拉丁埋点（快速匹配）
        wx.aldSendEvent("游戏准备_快速匹配");
        wx.aldSendEvent("游戏准备_页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000+6
        });
        cc.find("Canvas/PiPeiView").active = true;
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
        // 阿拉丁埋点
        wx.aldSendEvent('游戏推广',{'页面' : '战前准备_图片推广'});
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
        wx.aldSendEvent("游戏准备_页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
          });
        cc.director.loadScene("GameStart.fire");
    },
    /**
     * 循环切换广告图片的方法
     */
    ChangeJumpAppSelectSprite_2() {
        let sprite = this.gglunbo_2.getComponent(cc.Sprite);
        this.gglunbo_2.index = 0;
        this.gglunbo_2.on("touchend", this.Touchlunbo, this);
       
        this.schedule(() => {
            if (this.gglunbo_2.index < Global.jumpappObject.length - 1) {
                this.gglunbo_2.index++;
            } else {
                this.gglunbo_2.index = 0;
            }
            if(Global.jumpappObject[this.gglunbo_2.index].lunbo!=null){
                sprite.spriteFrame = Global.jumpappObject[this.gglunbo_2.index].lunbo;
            }else{
                sprite.spriteFrame = Global.jumpappObject[this.gglunbo_2.index].sprite;
            }
        }, 3.0, cc.macro.REPEAT_FOREVER, 0.1);
    },
    Touchlunbo(event) {
        // 上线前注释console.log("event == ", event.target);
        // 阿拉丁埋点
        wx.aldSendEvent('游戏推广',{'页面' : '战前准备_游戏轮播'});
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
    // update (dt) {},
});
