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
        qiu:cc.Node,
        pageView:cc.PageView,
        text:cc.Label,
        content:cc.Node,
        hook:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        wx.aldSendEvent("游戏匹配_页面访问数");
        //页面停留开始时间
        this.startTime = Date.now();
        this.num=0;
        this.schedule(function() {
            this.qiu.setSiblingIndex(this.num);
            if(this.num==2){
                this.num=0;
            }
            this.num++;
        }, 0.5);
        this.GuidePage();
        let self = this;
        //6s显示匹配成功
        this.scheduleOnce(function() {
            self.text.string = "匹配成功";
            self.content.active = false;
            self.hook.active =true;
            cc.director.loadScene("Game.fire");
            wx.aldSendEvent("游戏匹配_页面停留时间",{
                "耗时" : (Date.now()-this.startTime)/1000
            });
        }, 6)
    },
    //轮播引导
    GuidePage(){
        this.schedule(() => {
            //一共多少页
           let count = this.pageView.getPages().length;        
           //取当前页下序号 
           let index = this.pageView.getCurrentPageIndex();
           //为最后一页，index为0，否则+1
           index = index >= count ? 0 : index + 1;
           //执行切换                
           this.pageView.scrollToPage(index, 2);
       }, 1.5);
       
    },
    // update (dt) {
        
    // },
});
