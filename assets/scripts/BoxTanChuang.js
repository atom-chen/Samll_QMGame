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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.goldnum.string = "x"+Global.boxChest.givevalue;
        this.isvideo = false;
    },
    showAdVedio(){
        Global.showAdVedio(this.Success.bind(this),this.Failed.bind(this));
    },
    Success(){
        this.videbtn.active = false;
        var double = Global.boxChest.givevalue*2;
        this.goldnum.string = "x"+double;
        this.isvideo = true;
    },
    Failed(){
        Global.ShowTip(this.node,"观看完整视频才能获取奖励");
    },
    /**
      * 关闭界面
      */
    onClickClose: function () {
        Global.OpenChest(this.isvideo,(res)=>{
            Global.boxChest = null;
        });
        this.node.destroy();
    },
    // update (dt) {},
});
