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
        gglunbo:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        Global.banner.style.left = Global.ScreenWidth-(Global.banner.style.realWidth);
        this.ChangeJumpAppSelectSprite()
    },
    /**
     * 点击关闭界面按钮
     */
    onClickComeback() {
        //隐藏广告
        Global.banner.hide();
        this.node.destroy();
        Global.showGameLoop = true;

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
        event.stopPropagation();
        // 阿拉丁埋点
        wx.aldSendEvent('游戏推广',{'页面' : '游戏宝箱_游戏轮播'});

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
