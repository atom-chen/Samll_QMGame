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
        username:cc.Label,
        userImg:cc.Sprite,
        duantext:cc.Label,
        duanImg:cc.Sprite,
        text:cc.Label,
        content:cc.Node,
        hook:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // 阿拉丁埋点
        wx.aldSendEvent("游戏大厅",{"dmx_homePage_pv/uv":"页面的访问数"});
        this.startTime = Date.now();
        Global.GetJumpInfo(() => {
            //换一批按钮的翻页所需页面index
            this.guangGaoIndex = Global.GetGuangGaoIndex();
        }, this);
        
        //广告位置
        Global.banner.show();
        Global.banner.style.left = Global.ScreenWidth-(Global.banner.style.realWidth);

        let self = this;
        cc.find("MusicBGM").getComponent("MusicControl").PlayBGM();
        Global.GetUserHeros((res)=>{
            if(res.state ==1){
                Global.hp = res.result[0].Health;
                Global.attack = res.result[0].Damage;
            }
        })
        if (CC_WECHATGAME) {
            if(Global.is_Again){
                cc.find("Canvas/DOYouLikeView").active =true;
                Global.is_Again = false;
            }
            //微信的头像和名字
            var imgurl = Global.avatarUrl +"?aaa=aa.jpg";
            cc.loader.load({url:imgurl, type: 'jpg'},function(err, texture){
                if(texture){ 
                    var spriteFrame = new cc.SpriteFrame(texture);
                    self.userImg.spriteFrame = spriteFrame;
                }
            });
            self.username.string = Global.name;
            for(let i =0;i<Global.SeaonLvl.length;i++){
                if(Global.userlvl == Global.SeaonLvl[i].id){
                    Global.duntext = Global.SeaonLvl[i].name;
                    self.SmallDuanWei();
                    let url = Global.SeaonLvl[i].id+'.png';
                    cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                        self.duanImg.spriteFrame = spriteFrame;
                    });
                }
            }
           // 。。。的转发效果
            wx.showShareMenu();

            wx.onShareAppMessage(function (res) {
                return {
                    title: '是否敢来一战',
                    imageUrl: Global.shareimg,
                    success(res) {
                        console.log("yes");
                    },
                    fail(res) {
                        console.log("failed");
                    },
                };
            });
        }
    },
    onShowAppMsg(){
        // 阿拉丁埋点
        wx.aldSendEvent('分享',{'dmx_share_click()' : '游戏大厅'});
        
        Global.TiaoZhanFriend();
    },
    onPlayBtn(){
        //隐藏广告
        Global.banner.hide();
        let self = this;
        cc.find("Canvas/PiPeiView").active = true;
        //2s显示匹配成功
        this.scheduleOnce(function() {
            self.text.string = "匹配成功";
            self.content.active = false;
            self.hook.active =true;
            cc.director.loadScene("Game.fire");
        }, 2)
        // 阿拉丁埋点（快速开始）
        wx.aldSendEvent("游戏大厅",{"dmx_homePage_quickStart_click":"点击快速开始"});
        wx.aldSendEvent("游戏大厅页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
          });
    },
    onGameReadyBtn(){
        //隐藏广告
        Global.banner.hide();
        // 阿拉丁埋点（荒漠战场）
        wx.aldSendEvent("游戏大厅",{"dmx_homePage_battlefield_click":"点击荒漠战场"});
        wx.aldSendEvent("游戏大厅页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
          });
        cc.director.loadScene("GameReady.fire");
    },
    onOpenSignView() {
        //隐藏广告
        Global.banner.hide();
        // 阿拉丁埋点（累计签到）
        wx.aldSendEvent("游戏大厅",{"dmx_homePage_SignIn_click":"点击累计签到"});
        cc.find("Canvas/SignView").active =true;
    },
    SmallDuanWei(){
        //设置星星
        switch(Global.userlvl){
            case 1:
               this.ComputeStar(100);
                break;
            case 2:
                this.ComputeStar(150);
                break;
            case 3:
                this.ComputeStar(200);
                break;
            case 4:
                this.ComputeStar(350);
                break;
            case 5:
                this.ComputeStar(500);
                break;
            case 6:
                this.ComputeStar(700);
                break;
            case 7:
                this.ComputeStar(1000);
                break;
            case 8:
                this.ComputeStar(1500);
                break;
            default:
                break;
        }
    },
    //计算星星段位不同每颗星星的积分不同
    ComputeStar(jifen){
        for(let i =0;i<Global.SeaonLvl.length;i++){
            if(Global.userlvl == Global.SeaonLvl[i].id){
                var score=0;
                if(Global.userlvl==1){
                    score = (Global.score -Global.SeaonLvl[i].minscore)/jifen;
                }else{
                    score = (Global.score -Global.SeaonLvl[i].minscore +1)/jifen;
                }
                this.ChangeStarText(Math.floor(score));
            }
        }
    },
    ChangeStarText(num){
        let self = this;
        switch(num){
            case 0:
                self.duantext.string = Global.duntext+"III";
                break;
            case 1:
                self.duantext.string = Global.duntext+"II";
                break;
            case 2:
                self.duantext.string = Global.duntext+"I";
                break;
            case 3:
                self.duantext.string = Global.duntext+"I";
                break;
            default:
                break;
        }
    },
    // update (dt) {},
    /**
     * 试玩游戏
     */
    OnClickTryNewGame() {
        this.appid = Global.jumpappObject[this.guangGaoIndex].apid;
        this.path = Global.jumpappObject[this.guangGaoIndex].path;
        // 上线前注释console.log("this.appid==", this.appid);
        // 上线前注释console.log("this.path==", this.path);

        var self = this;
        wx.navigateToMiniProgram({
            appId: self.appid,
            path: self.path,
            // extraData: {
            //   foo: 'bar'
            // },
            /**
             * envVersion的值（develop开发版，trial体验版，release正式版）
             */
            // envVersion: 'develop',
            envVersion: 'release',
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
});
