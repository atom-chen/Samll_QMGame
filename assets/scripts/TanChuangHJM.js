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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    init(txt) {
        this.txt = txt; 
    },
    /**
     * 复制获奖码
     */
    onClickCopyPrizeCode: function () {
        // 上线前注释console.log("复制获奖码");
        // // 上线前注释console.log("this.txt == ", this.txt);
        var self = this;
        wx.setClipboardData({
            data: self.txt,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        // 上线前注释console.log("复制成功==111===>：", res.data);
                    },
                    fail: function (res) {
                        // 上线前注释console.log("复制失败==111===>：", res.data);
                    },
                    complete: function (res) {
                        // 上线前注释console.log("复制完成==111===>：", res.data);
                    }
                });
            },
            fail: function (res) {
                // 上线前注释console.log("复制失败==222===>：", res.data);
            },
            complete: function (res) {
                // 上线前注释console.log("复制失败==222===>：", res.data);
            },
        });
    },
    /**
      * 关闭界面
      */
     onClickClose: function () {
        this.node.destroy();
    },
    // update (dt) {},
});
