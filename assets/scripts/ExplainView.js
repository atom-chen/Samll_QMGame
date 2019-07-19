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
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.zhezhao = this.node.parent.getChildByName("zhezhao");
    },

    start () {
        //广告位置
        Global.banner.show();
        Global.banner.style.left = (Global.ScreenWidth-Global.banner.style.realWidth)/2;
        this.zhezhao.active = true;
    },
    onClickClose(){
        //隐藏广告
        Global.banner.hide();
        this.node.destroy();
        this.zhezhao.active = false;
    }
    // update (dt) {},
});
