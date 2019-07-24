/**
 * Created By Zhou Xiaolong on 2019/4/28.
 * 抽奖界面
 */

cc.Class({
    extends: cc.Component,

    properties: {
        //转盘
        ZhuanPan: {
            default: null,
            type: cc.Node
        },
        //奖励界面
        JiangLiPrefab: {
            default: null,
            type: cc.Prefab
        },
        //获奖列表界面
        HuoJiangListPrefab: {
            default: null,
            type: cc.Prefab
        },
        //遮罩
        img_zhezhao: {
            default: null,
            type: cc.Node
        },
        //三个光效
        lightEffect: {
            default: [],
            type: cc.Node,
        },
        tip_prefab: {
            default: null,
            type: cc.Prefab
        },
        myPrize:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //奖励列表的数字
        this.Arr_AwardList = [50, 0, 300, 3, 200, 1, 100, 0.2];
        this.txt_ChouJiangCount = this.node.getChildByName("jinrishengyucishu").getChildByName("txt_ChouJiangCount");
        this.txt_ChouJiangCount_label = this.txt_ChouJiangCount.getComponent(cc.Label);

        //抽奖剩余次数显示
        this.btn_queding_fen = this.node.getChildByName("btn_fen").getComponent(cc.Button);
        // this.btn_queding_hui .active = false;
        // common.Zcount = 1;
        // // 上线前注释console.log("Zcount == ", common.Zcount);
        if (Global.Zcount <= 0) {
            this.btn_queding_fen.interactable = false;
        } else {
            this.btn_queding_fen.interactable = true;
        }
        this.myPrize.getComponent(cc.Widget).target = this.myPrize.parent.parent;
        this.myPrize.getComponent(cc.Widget).left = -40;
        this.myPrize.getComponent(cc.Widget).updateAlignment();
    },

    start() {
        Global.GetZhuanPanLog();
        //页面停留开始时间
        this.startTime = Date.now();

        this.txt_ChouJiangCount_label.string = Global.Zcount;

        this.cha = this.node.getChildByName("btn_close");
        // 上线前注释console.log("this.cha == ", this.cha);

        this.img_zhezhao.active = false;
        this.img_zhezhao.parent = this.node.parent;
        this.img_zhezhao.zIndex = 1;
        // this.cha.parent = this.node.parent;
        // this.cha.position = this.node.parent.getChildByName("redbag").position;
        for (let i = 0; i < this.lightEffect.length; i++) {
            let action = Global.LightRotate();
            // 上线前注释console.log("action == ", action);
            this.lightEffect[i].runAction(action);
        }
        //广告位置
        Global.banner.show();
        Global.banner.style.left = Global.ScreenWidth-(Global.banner.style.realWidth);
        Global.banner.style.top = Global.ScreenHeight - Global.banner.style.realHeight;
    },

    // update (dt) {},

    /**
     * 点击关闭界面按钮
     */
    onClickComeback() {
        //隐藏广告
        Global.banner.hide();

        Global.showGameLoop = true;
        wx.aldSendEvent("游戏大厅_幸运转盘关闭按钮");
        wx.aldSendEvent("游戏大厅_幸运转盘页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
        });

        if (Global.onAddLuckyCount == 1) {
            this.node.destroy();
            //this.cha.destroy();
            this.img_zhezhao.destroy();
            Global.whetherShowLucky = false;
        } else {
            this.scheduleOnce(() => {
                this.node.destroy();
                //this.cha.destroy();
                this.img_zhezhao.destroy();
            }, 1.0);
        }
    },

    /**
     * 金币抽奖方法
     */
    onClickCoin() {
        if (Global.gold >= 500) {
            this.img_zhezhao.active = true;
            wx.aldSendEvent("游戏大厅_幸运转盘金币抽奖");
            this.onRequestChouJiang();
            Global.UserChange(2,1, "金币抽奖扣除",-500,(res)=>{
                if(res.state ==1){
                    Global.gold -=500;
                    cc.game.emit('UserChang');
                }
            });
        } else {
            //需要提示
            this.ShowTip(this.node, "金币余额不足，请参与游戏获得");
        }
    },

    /**
     * 视频抽奖方法
     */
    onClickVedio() {
        // 上线前注释console.log("视频抽奖方法");
        this.img_zhezhao.active = true;
        // 阿拉丁埋点
        wx.aldSendEvent('视频广告',{'页面' : '幸运转盘_视频抽奖'});
        Global.showAdVedio(this.VedioPlaySuccess.bind(this), this.VedioPlayFailed.bind(this));
    },

    /**
     * 视频观看成功
     */
    VedioPlaySuccess() {
        // 阿拉丁埋点
        wx.aldSendEvent('视频广告',{'是否有效' : '是'});
        this.onRequestChouJiang();
        this.txt_ChouJiangCount_label.string = Global.Zcount - 1;
        if (Global.Zcount >= 1) {
            Global.Zcount--;
            Global.UpdateZP();
        }
        if (Global.Zcount == 0) {
            this.btn_queding_fen.interactable = false;
        }
    },

    /**
     * 视频观看失败
     */
    VedioPlayFailed() {
        // 阿拉丁埋点
        wx.aldSendEvent('视频广告',{'是否有效' : '否'});
        this.img_zhezhao.active = false;
        this.ShowTip(this.node, "观看完视频才能获得奖励哦");
    },

    /**
     * 点击奖励列表按钮
     */
    onClickPrizeList() {
        wx.aldSendEvent("游戏大厅_幸运转盘我的奖品");
        //隐藏广告
        Global.banner.hide();
        if (this.HuoJiangListPrefab) {
            var huoJiangListPrefab = cc.instantiate(this.HuoJiangListPrefab);
            this.node.addChild(huoJiangListPrefab);
        }
    },

    /**
     * 请求抽奖接口的操作
     */
    onRequestChouJiang: function () {
        var self = this;
        Global.RunZhuanPan((res) => {      //获取到接口返回值
            self.index = res.result-1;
            self.DrawALotteryOrRaffle(res.result-1);
        });
    },

    /**
     * 抽奖方法(前端表现)
     */
    DrawALotteryOrRaffle: function (num) {
        //多旋转的角度
        this.rotationNum = (num) * (360 / 8) + (360 / 8 / 2);
        //左右的效果角度
        this.random_1 = Math.floor(Math.random() * 40 - 22);
        // // 上线前注释console.log("num == ", num);
        // // 上线前注释console.log("this.rotationNum == ", this.rotationNum);

        var action = this.DialRotateAction();
        this.ZhuanPan.runAction(action);
        var self = this;
        this.scheduleOnce(function () {
            var action_1 = cc.sequence(
                cc.rotateBy(0.2, 0),
                cc.rotateBy(1.5, self.random_1 / -1),
            ).easing(cc.easeInOut(3.0));
            self.ZhuanPan.runAction(action_1);
        }, 6.0);
        this.scheduleOnce(function () {
            self.img_zhezhao.active = false;
            //调用弹窗
            var jiangliPrefab = cc.instantiate(self.JiangLiPrefab);
            console.log("转盘："+num);
            switch (num) {
                case 3:
                case 5:
                case 7:
                    // jiangliPrefab.getComponent("LuckyAward").init(0, self.Arr_AwardList[num]);
                    // 上线前注释console.log("111111111111111111111111", jiangliPrefab, self.Arr_AwardList[self.index]);
                    // 上线前注释console.log("jiangliPrefab.getComponent1111", jiangliPrefab.getComponent("MessageBoxLayer"));
                    jiangliPrefab.getComponent("MessageBoxLayer").init("LuckyLayer", 3, self.Arr_AwardList[self.index]);
                    // 上线前注释console.log("222222222222222222222222");
                    break;
                case 0:
                case 2:
                case 4:
                case 6:
                    // jiangliPrefab.getComponent("LuckyAward").init(1, self.Arr_AwardList[num]);

                    // 上线前注释console.log("33333333333333333333", jiangliPrefab, self.Arr_AwardList[self.index]);
                    // 上线前注释console.log("jiangliPrefab.getComponent2222", jiangliPrefab.getComponent("MessageBoxLayer"));

                    jiangliPrefab.getComponent("MessageBoxLayer").init("LuckyLayer", 2, self.Arr_AwardList[self.index]);
                    // 上线前注释console.log("44444444444444444444");
                    break;
                default:
                    break;
            }
            self.node.parent.addChild(jiangliPrefab, 200);
            // self.img_zhezhao.active = false;
        }, 8.0);

        //暂时是自动初始化
        this.scheduleOnce(function () {
            if (self.ZhuanPan.rotation != 0) {
                self.ZhuanPan.rotation = 0;
            }
        }, 10.0);
    },

    /**
     * 转盘转动方法
     */
    DialRotateAction: function () {
        var self = this;
        var action = cc.sequence(
            cc.rotateBy(5.0, 360 * 5),
            cc.rotateBy(1.0, self.rotationNum + self.random_1),
        ).easing(cc.easeInOut(3.0));
        return action;
    },
    //提示
    ShowTip(text){
        let tip = cc.instantiate(this.tip_prefab);
        if (tip) {
            this.node.addChild(tip);
            let src = tip.getComponent(require("TipShow"));
            if (src) {
                src.label.string = text;
            }
        }
    },
});
