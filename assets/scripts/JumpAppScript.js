// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        sprite:{
            default:null,
            type:cc.Sprite,
        },

        labelGame:{
            default:null,
            type:cc.Label,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.index = 0;
    },

    start () {
        this.node.on("touchend",this.TouchEnd,this );
    },

    TouchEnd(event){
        event.stopPropagation();
        if (CC_WECHATGAME)
        {
            if(this.node.name =="gameggPrefab"){
                // 阿拉丁埋点
                wx.aldSendEvent('游戏推广',{'dmx_flowGame_click()' : '猜你喜欢'});
            }else{
                // 阿拉丁埋点
                wx.aldSendEvent('游戏推广',{'dmx_flowGame_click()' : '游戏大厅'});
            }
            wx.navigateToMiniProgram({
                appId:Global.jumpappObject[this.index].apid,
                path:Global.jumpappObject[this.index].path,
                success:function(res){
                    console.log(res);
                },
                fail:function(res){
                    console.log(res);
                },
            });
        }
    }

    // update (dt) {},
});
