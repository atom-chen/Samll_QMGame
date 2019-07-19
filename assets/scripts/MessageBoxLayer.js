/**
 * Created by Zhou Xiaolong on 2019/04/29;
 * 弹窗界面脚本
 */

cc.Class({
    extends: cc.Component,

    properties: {
        Arr_Node: {
            default: [],
            type: cc.Node,
        },

        Arr_Label: {
            default: [],
            type: cc.Label,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {
       

        this.Arr_Node[this.index - 1].active = true;
        if (this.Arr_Node[this.index - 1].getChildByName("guangxiao")) {
            let guangxiao = this.Arr_Node[this.index - 1].getChildByName("guangxiao");
            // 上线前注释console.log("guangxiao == ", guangxiao);
            let action = Global.LightRotate();
            // 上线前注释console.log("action == ", action);
            guangxiao.runAction(action);
            this.coinNum_Label = this.Arr_Label[this.index - 1].getComponent(cc.Label);
        }
        switch (this.index - 1) {
            case 0:
                this.node.getChildByName("btn_close").active =false;
                this.coinNum_Label.string = "x" + this.coinNum;
                break;
            case 1:
                if (this.coinNum) {
                    if (this.txt == "SignLayer") {
                        this.coinNum_Label.string = "x" + this.coinNum * 2;
                    } else if (this.txt == "LuckyLayer") {
                        this.coinNum_Label.string = "x" + this.coinNum;
                    }
                }
                break;
            case 2:
                if (this.coinNum) {
                    this.coinNum_Label.string = "x" + this.coinNum + "元";
                }
                break;
            case 3:

                break;
            default:
                break;
        }
    },

    // update (dt) {},

    init(txt, index, coinNum) {
        this.txt = txt;
        this.index = index;
        this.coinNum = coinNum;
    },

    /**
     * 领取奖励方法
     */
    onClickGetAward: function (event) {
        // 上线前注释console.log("领取奖励方法");
        this.event = event;
        // switch (this.layerName) {
        //     case "SignLayer":
        //         //添加广告
        //         // // 上线前注释console.log("添加广告");
        //         common.showAdVedio(this.SignDoubleSuccess.bind(this));
        //         break;
        //     case "Gameing":
        //         //添加广告
        //         // // 上线前注释console.log("添加广告");
        //         common.showAdVedio(this.SignDoubleSuccess.bind(this));
        //         break;
        //     default:
        //         break;
        // }
        Global.showAdVedio(this.CoinDoubleSuccess.bind(this), this.CoinDoubleFailed.bind(this));
    },

    /**
     * 观看视频完成后处理方法
     */
    CoinDoubleSuccess() {
        // 上线前注释console.log("观看视频完成后处理方法");
        this.event.target.active = false;

        Global.UserSign(3);
        // 阿拉丁埋点
        wx.aldSendEvent('游戏广告',{'valid' : '成功观看'});
    },

    /**
     * 观看视频失败
     */
    CoinDoubleFailed() {
        // 上线前注释console.log("观看视频失败");
        Global.ShowTip(this.node, "观看完视频才会有奖励哦");
        // 阿拉丁埋点
        wx.aldSendEvent('游戏广告',{'valid' : '未成功观看'});
    },

    /**
      * 关闭界面
      */
    onClickClose: function () {
        if (this.txt == "LuckyLayer"&&this.index == 2) {
            Global.UserChange(2,1, "金币抽奖扣除",this.coinNum,(res)=>{
                if(res.state ==1){
                    Global.gold +=this.coinNum;
                    cc.game.emit('UserChang');
                }
            });
        }else if(this.index == 1){
            
        }
        this.node.destroy();
    },
    onShowAppMsg(){
        
        Global.TiaoZhanFriend();
    },
});
