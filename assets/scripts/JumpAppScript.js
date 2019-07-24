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
                wx.aldSendEvent('游戏推广',{'页面' : '猜你喜欢_游戏列表'});
            }else if(this.node.name =="jumpappPrefab"){
                // 阿拉丁埋点
                wx.aldSendEvent('游戏推广',{'页面' : '游戏大厅_游戏列表'});
            }
            else if(this.node.name =="jumpappPrefab_2"){
                // 阿拉丁埋点
                wx.aldSendEvent('游戏推广',{'页面' : '游戏大厅_精品推荐'});
            }
            if(this.node.parent.name == "lucky"){
                // 阿拉丁埋点
                wx.aldSendEvent('游戏推广',{'页面' : '幸运转盘_游戏列表'});
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
