/**
 * Created by Zhou Xiaolong on 2019/04/29;
 * 奖品列表界面
 */

cc.Class({
    extends: cc.Component,

    properties: {
        //时间显示预制体
        TimePrefab: {
            default: null,
            type: cc.Prefab
        },
        //获奖物品列表预制体（未领取）
        PrizeWeiPrefab: {
            default: null,
            type: cc.Prefab
        },
        //获奖物品列表预制体（已领取）
        PrizeYiPrefab: {
            default: null,
            type: cc.Prefab
        },
        //列表容器
        PrizeScrollview: {
            default: null,
            type: cc.ScrollView
        },
        gglunbo:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //模拟奖品列表数据
        this.PrizeListData = Global.PrizeListData;
        
        this.content = this.PrizeScrollview.content;

        this.btn_canyuhuojiang = this.node.getChildByName("btn_canyuhuojiang");

        //判断是否有记录
        if (this.PrizeListData.length == 0) {
            this.onShowRecordButton();
        } else {
            this.onShowRecordButton();
            //展示记录
            for (let i = 0; i < this.PrizeListData.length; i++) {
                var timeItem = cc.instantiate(this.TimePrefab);
                var txt_dateTime = timeItem.getChildByName("txt_dateTime");
                var txt_dateTime_label = txt_dateTime.getComponent(cc.Label);
                txt_dateTime_label.string = this.PrizeListData[i].date;
                this.content.addChild(timeItem);
                for (let j = 0; j < this.PrizeListData[i].list.length; j++) {
                    if (this.PrizeListData[i].list[j].state == 0) {
                        var prizeItem = cc.instantiate(this.PrizeWeiPrefab);
                        // prizeItem.getComponent("LuckyPrizeGetCode").init(i, j);
                        var txt_jiangpinList_num = prizeItem.getChildByName("txt_jiangpinList_num");
                        var txt_jiangpinList_num_label = txt_jiangpinList_num.getComponent(cc.Label);
                        txt_jiangpinList_num_label.string = this.PrizeListData[i].list[j].title + "元";
                        this.content.addChild(prizeItem);
                    } else {
                        var prizeItem = cc.instantiate(this.PrizeYiPrefab);
                        var txt_jiangpinList_num = prizeItem.getChildByName("txt_jiangpinList_num");
                        var txt_jiangpinList_num_label = txt_jiangpinList_num.getComponent(cc.Label);
                        txt_jiangpinList_num_label.string = this.PrizeListData[i].list[j].title + "元";
                        this.content.addChild(prizeItem);
                    }
                }
            }
        }
    },

    start () {
        this.ChangeJumpAppSelectSprite();
    },

    // update (dt) {},

    /**
     * 关闭界面
     */
    onClickClose: function () {
        //广告位置
        Global.banner.show();
        this.node.destroy();
    },

    /**
     * 控制是否显示无记录
     */
    onShowRecordButton: function () {
        if (this.PrizeListData.length <= 0) {
            this.btn_canyuhuojiang.active = true;
        } else {
            this.btn_canyuhuojiang.active = false;
        }
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
});
