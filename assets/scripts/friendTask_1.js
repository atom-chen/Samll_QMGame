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
        textlabel:cc.Label,
        baoji:cc.Label,
        btn_yq:cc.Node,
    },
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    init(data){
        this.textlabel.string = data.remark;
        this.baoji.string = "+"+data.attr[0].values +"%";
        if(data.isfinish){
            this.btn_yq.active = false;
        }
    },
    /**
     * 去邀请按钮方法
     */
    onClickInviteFriend: function (event) {
        // 阿拉丁埋点
        wx.aldSendEvent('邀请',{'页面' : '好友助力_邀请模块'});

        if (CC_WECHATGAME) {
            // 上线前注释console.log(Global.shareimg);
            wx.shareAppMessage({
                title: '被这游戏分分钟虐的怀疑人生，我就问问：还有谁？',
                imageUrl: Global.shareimg,
                query: "introuid=" + Global.Introuid,
                success(res) {
                    // 上线前注释console.log("yes");
                },
                fail(res) {
                    // 上线前注释console.log("failed");
                },
                complete(res) {
                    // 上线前注释console.log("complete");
                }
            });
        }
    },
    // update (dt) {},
});
