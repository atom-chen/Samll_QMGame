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
        taskprefab:{
            default: null,
            type: cc.Prefab,
        },
        content:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        //页面停留开始时间
        this.startTime = Date.now();
        let self = this;
        Global.GetIntiveMission((res)=>{
            if(res.state==1){
                for(let i=0;i<res.result.length;i++){
                    let task = cc.instantiate(self.taskprefab);
                    task.getComponent("friendTask_1").init(res.result[i]);
                    self.content.addChild(task);
                }
            }
        });
        //广告位置
        Global.banner.show();
        Global.banner.style.left = (Global.ScreenWidth-Global.banner.style.realWidth)/2;

        this.guangGaoIndex = Global.GetGuangGaoIndex();
    },
    
    onClickClose: function () {
        //隐藏广告
        Global.banner.hide();
        this.node.destroy();
        Global.showGameLoop = true;
        wx.aldSendEvent("游戏大厅_好友助力页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
        });
    },
    OnClickTryNewGame() {
        // 阿拉丁埋点
        wx.aldSendEvent('游戏推广',{'页面' : '好友助力_逗趣推广'});
        
        this.appid = Global.jumpappObject[this.guangGaoIndex].apid;
        this.path = Global.jumpappObject[this.guangGaoIndex].path;
        // 上线前注释console.log("this.appid==", this.appid);
        // 上线前注释console.log("this.path==", this.path);

        var self = this;
        wx.navigateToMiniProgram({
            appId: self.appid,
            path: self.path,
            success(res) {
                // 打开成功
                // // 上线前注释console.log("跳转成功", res);
            },
            fail(res) {
                // // 上线前注释console.log("跳转失败", res);
            },
            complete(res) {
                // // 上线前注释console.log("跳转结果", res);
            }
        })
    },
    // update (dt) {},
});
