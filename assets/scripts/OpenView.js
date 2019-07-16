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

    // onLoad () {},

    start () {

    },
    //按钮点击功能（打开画布下的界面）
    onOpen: function (event, customEventData) {
        var node = event.target;
        var button = node.getComponent(cc.Button);
        
        cc.find("Canvas/"+customEventData).active =true;
        if(customEventData == "PopupView"){
            // 阿拉丁埋点
            wx.aldSendEvent("游戏进行",{"dmx_marchPage_quitGame_click":"退出游戏"});
        }
        
    },
    //按钮点击功能（关闭画布下的界面）
    onClose: function (event, customEventData) {
        var node = event.target;
        var button = node.getComponent(cc.Button);
        
        cc.find("Canvas/"+customEventData).active =false;
    },
    GtoScene:function (event, customEventData){
        var node = event.target;
        cc.director.loadScene(customEventData+".fire");

    },
    DestroyView:function(event, customEventData){
        var node = event.target;
        var button = node.getComponent(cc.Button);
        
        cc.find("Canvas/"+customEventData).destroy();
        
    },
    OnFengxiang(){
        // 阿拉丁埋点
        wx.aldSendEvent('分享',{'dmx_share_click()' : '游戏准备'});
        Global.TiaoZhanFriend();
    },
    PopupGotoGameStart(){
        // 阿拉丁埋点
        wx.aldSendEvent("游戏进行",{"dmx_marchPage_confirmQuit_click":"确定退出"});

        wx.aldSendEvent("游戏进行页面停留时间",{
            "耗时" : (Date.now()-Global.startTime)/1000
          }); 
        cc.director.loadScene("GameStart.fire");
    }
    // update (dt) {},
});
