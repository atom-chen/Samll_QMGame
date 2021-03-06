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
        goldnum:cc.Label,
        videbtn:cc.Node,
        gglunbo:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.goldnum.string = "x"+Global.boxChest.givevalue;
        this.isvideo = false;
        //页面停留开始时间
        this.startTime = Date.now();

        this.ChangeJumpAppSelectSprite();
    },
    showAdVedio(){
        // 阿拉丁埋点
        wx.aldSendEvent('视频广告',{'页面' : '游戏宝箱_双倍领取'});
        Global.showAdVedio(this.Success.bind(this),this.Failed.bind(this));
    },
    Success(){
        // 阿拉丁埋点
        wx.aldSendEvent('视频广告',{'是否有效' : '是'});
        this.videbtn.active = false;
        var double = Global.boxChest.givevalue*2;
        this.goldnum.string = "x"+double;
        this.isvideo = true;
    },
    Failed(){
        // 阿拉丁埋点
        wx.aldSendEvent('视频广告',{'是否有效' : '否'});
        Global.ShowTip(this.node,"观看完整视频才能获取奖励");
    },
    /**
      * 关闭界面
      */
    onClickClose: function () {
        //隐藏广告
        Global.banner.hide();
        Global.OpenChest(this.isvideo,(res)=>{
            Global.boxChest = null;
        });
        this.node.destroy();

        wx.aldSendEvent("游戏大厅_游戏宝箱(双倍领取)页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
        });
    },
    /**
     * 循环切换广告图片的方法
     */
    ChangeJumpAppSelectSprite() {
        let sprite = this.gglunbo.getComponent(cc.Sprite);
        this.gglunbo.index = 0;
        this.gglunbo.on("touchend", this.TouchEnd, this);
       
        this.schedule(() => {
            if (this.gglunbo.index < Global.jumpappObject.length - 1) {
                this.gglunbo.index++;
            } else {
                this.gglunbo.index = 0;
            }
            if(Global.jumpappObject[this.gglunbo.index].lunbo!=null){
                sprite.spriteFrame = Global.jumpappObject[this.gglunbo.index].lunbo;
            }else{
                sprite.spriteFrame = Global.jumpappObject[this.gglunbo.index].sprite;
            }
        }, 3.0, cc.macro.REPEAT_FOREVER, 0.1);
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
    // update (dt) {},
});
