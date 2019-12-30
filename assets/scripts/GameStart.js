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
        prefab_tip: {
            default: null,
            type: cc.Prefab
        },
        //抽奖界面预制体
        luckyLayer: {
            default: null,
            type: cc.Prefab,
        },
        gglunbo:{
            default:null,
            type:cc.Node,
        },
        explainPrefab:{
            default: null,
            type: cc.Prefab,
        },
        friendPrefab:{
            default: null,
            type: cc.Prefab,
        },
        boxjiangliPrefab:{
            default: null,
            type: cc.Prefab,
        },
        boxmsglabe:cc.Label,
        boxtime:cc.Label,
        boxImg:cc.Node,
        boxImg_yi:cc.Node,
        btn_2:cc.Node,
        lift_bg:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // iphoneX 刘海适配问题
        //if(cc.sys.isNative && cc.sys.platform == cc.sys.IPHONE){
            var size = cc.view.getFrameSize();
            var isIphoneX = (size.width == 812 && size.height == 375) 
                   ||(size.width == 375 && size.height == 812)
                   ||(size.width == 896 && size.height == 414);
            if(isIphoneX){
                // var cvs = this.node.parent.getComponent(cc.Canvas);
                // cvs.fitHeight = true;
                // cvs.fitWidth = true;
                this.lift_bg.getComponent(cc.Widget).left +=35;
                this.lift_bg.getComponent(cc.Widget).updateAlignment();
                this.node.parent.getChildByName("btn_2").x += 35;
                
            }
         //}
    },
    start () {
        wx.onAudioInterruptionEnd(function(){
            //强行暂停音乐 如果不暂停，调用resumeMusic是无效的，因为是微信让声音消失了
            cc.audioEngine.pauseMusic();
            //恢复音乐播放，比如调用 cc.audioEngine.resumeMusic();
            cc.find("MusicBGM").getComponent("MusicControl").PlayBGM();
            //self.refreshBG();
            console.log('refreshBG');
        });
        cc.find("MusicBGM").getComponent("MusicControl").PlayBGM();
        this.onCreateGameLoop();
        // 阿拉丁埋点
        wx.aldSendEvent("游戏大厅_页面访问数");
        
        Global.prefab_tip = this.prefab_tip;
        this.startTime = Date.now();
        //换一批按钮的翻页所需页面index
        this.guangGaoIndex = Global.GetGuangGaoIndex();

        this.ChangeJumpAppSelectSprite();
        // //广告位置
        // Global.banner.show();
        // Global.banner.style.left = Global.ScreenWidth-(Global.banner.style.realWidth);
        //隐藏广告
        Global.banner.hide();

        let self = this;
        Global.GetUserHeros((res)=>{
            if(res.state ==1){
                Global.hp = res.result[0].Health;
                Global.attack = res.result[0].Damage;
                Global.Crit = res.result[0].Crit;
            }
        })
        if (CC_WECHATGAME) {
            if(Global.is_Again){
                Global.showGameLoop = false;
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
        this.HaveBoxChest();
    },
    //判断是否有宝箱
    HaveBoxChest(){
        this.isOpenBox = false;
        if(Global.boxChest){  //进去游戏时自己有宝箱
            //宝箱消失时间(一个小时没领取宝箱消失)
            var closeboxtime = Math.round(Global.boxChest.closetime/1000) - Math.round(Date.now() / 1000);
            if(closeboxtime>0){
                this.timeStamp = Math.round(Global.boxChest.canopentime/1000) -Math.round(Date.now() / 1000);
                if(this.timeStamp>0){
                    var minute  = Math.floor((this.timeStamp%3600)/60);
                    var second = this.timeStamp %3600%60;
                    minute = minute < 10 ? ('0' + minute) : minute;
                    second = second < 10 ? ('0' + second) : second;
                    this.boxmsglabe.node.active = false;
                    this.boxtime.node.active = true;
                    this.boxtime.string = minute+":"+second;
                    //倒计时
                    this.schedule(this.doCountdownTime,1);
                    this.boxImg.active = false;
                    this.boxImg_yi.active = true;
                }else{
                    this.boxmsglabe.node.active = true;
                    this.boxtime.node.active = false;
                    this.boxmsglabe.string = "已开启";
                    this.isOpenBox = true;
                    this.boxImg.active = true;
                    this.boxImg_yi.active = false;
                    this.BOXAnim();
                }
            }
        }
        
    },
    //宝箱按钮方法
    onClickBox(){
        if(this.isOpenBox){
            this.boxmsglabe.node.active = true;
            this.boxtime.node.active = false;
            this.boxmsglabe.string = "暂未开启";
            this.stopGiftAnim();
            this.boxImg.active = false;
            this.boxImg_yi.active = true;
            wx.aldSendEvent("游戏大厅_惊喜宝箱");
            var tanchuangbox = cc.instantiate(this.boxjiangliPrefab);
            this.node.parent.addChild(tanchuangbox);
        }
    },
    //倒计时
    doCountdownTime(){
        //每秒更新显示信息
        if (this.timeStamp > 0 ) {
            this.timeStamp -= 1;
            var minute  = Math.floor((this.timeStamp%3600)/60);
            var second = this.timeStamp %3600%60;
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            this.boxtime.string = minute+":"+second;
            this.countDownShow(this.timeStamp);
        }
    },
    countDownShow(temp){
        if(temp<=0){
            this.unschedule(this.doCountdownTime);
            this.boxmsglabe.node.active = true;
            this.boxtime.node.active = false;
            this.boxmsglabe.string = "已开启";
            this.isOpenBox = true;
            this.boxImg.active = true;
            this.boxImg_yi.active = false;
            this.BOXAnim();
        }
    },
    //礼盒可领取时动画
    BOXAnim(){
        var boxAnim = cc.repeatForever(
            cc.sequence(
                cc.skewTo(0.5,-10,10),
                cc.skewTo(0.5,10,-10)
            )
        )
        this.boxImg.runAction(boxAnim);
    },
    stopGiftAnim(){
        this.boxImg.stopAllActions();
        this.boxImg.rotation =0;
    },
    onShowAppMsg(){
        // 阿拉丁埋点
        wx.aldSendEvent('分享',{'页面' : '游戏大厅_分享游戏'});
        
        Global.TiaoZhanFriend();
    },
    onPlayBtn(){
        Global.showGameLoop = false;
        //隐藏广告
        Global.banner.hide();
        let self = this;
        cc.find("Canvas/PiPeiView").active = true;
        
        // 阿拉丁埋点（快速开始）
        wx.aldSendEvent("游戏大厅_快速开始");
        wx.aldSendEvent("游戏大厅_页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000+6
        });
    },
    onGameReadyBtn(){
        this.clubButton.hide();
        //隐藏广告
        Global.banner.hide();

        wx.aldSendEvent("游戏大厅_页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
        });
        cc.director.loadScene("GameReady.fire");
    },
    onOpenSignView() {
        Global.showGameLoop = false;
        //隐藏广告
        Global.banner.hide();
        // 阿拉丁埋点（累计签到）
        wx.aldSendEvent("游戏大厅_累计签到");
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
    update (dt) {
        if (Global.whetherShowSign == true && Global.onAddSignCount == 0) {
            Global.onAddSignCount++;
            this.onOpenSignView();
        }else if (Global.whetherShowLucky == true && Global.onAddLuckyCount == 0&&!Global.whetherShowSign) {
            Global.onAddLuckyCount++;
            this.onClickLucky();
        }else if (Global.whetherShowFriend&& Global.onAddFriendCount == 0&&!Global.whetherShowLucky) {
            Global.onAddFriendCount++;
            Global.whetherShowFriend = false;
            this.onOpenFriendView();
        }
        if(Global.showGameLoop&&this.btn_2.active){
            this.clubButton.show();
            this.btn_2.active = false;
        }else if(!Global.showGameLoop){
            this.onHideGameLoop();
        }
    },
    onClickLucky(){
        Global.showGameLoop = false;
        wx.aldSendEvent("游戏大厅_幸运转盘");
        let lucky = cc.instantiate(this.luckyLayer);
        this.node.parent.addChild(lucky);
    },
    onClickExplain(){
        wx.aldSendEvent("游戏大厅_游戏说明");
        let explain = cc.instantiate(this.explainPrefab);
        this.node.parent.addChild(explain);
    },
    /**
     * 图片的试玩游戏跳转
     */
    OnClickTryNewGame(event, customEventData) {
        if(customEventData == "tuiguang"){
            // 阿拉丁埋点
            wx.aldSendEvent('游戏推广',{'页面' : '游戏大厅_推广小游戏'});
        }else if(customEventData == "jingpin"){
            // 阿拉丁埋点
            wx.aldSendEvent('游戏推广',{'页面' : '游戏大厅_精品游戏'});
        }
        else if(customEventData == "sign"){
            // 阿拉丁埋点
            wx.aldSendEvent('游戏推广',{'页面' : '累计签到_逗趣推广'});
        }
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
        event.stopPropagation();
        // 阿拉丁埋点
        wx.aldSendEvent('游戏推广',{'页面' : '游戏大厅_游戏轮播'});
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
    //好友助力页面
    onOpenFriendView(){
        Global.showGameLoop = false;
        wx.aldSendEvent("游戏大厅_好友助力");
        let firend = cc.instantiate(this.friendPrefab);
        this.node.parent.addChild(firend);
    },
    /**
     * 创建游戏圈按钮
     */
    onCreateGameLoop() {

        this.gameQuan = this.node.parent.getChildByName("btn_2");
        //console.log("gameQuan=="+this.gameQuan.position);
        // this.x = 320+(this.btn_2.parent.x+this.gameQuan.x);
        // this.y = 360+(this.btn_2.parent.y+this.gameQuan.y);
        this.x = 320+this.gameQuan.x;
        this.y = 360+this.gameQuan.y;

        //上线前注释console.log("xxxxxxxyyyyyy==", this.x, this.y);
        //获取逻辑屏幕宽高
        let windowSize = cc.view.getVisibleSize();
        // 上线前注释console.log("windowSize =获取逻辑屏幕宽高= ", windowSize.width, windowSize.height);

        //得出该位置对应于左上的比例
        var leftRatio = this.x / windowSize.width;
        var topRatio = this.y / windowSize.height;

        //获得实际手机的屏幕宽高
        let sysInfo = wx.getSystemInfoSync();
        // 上线前注释console.log("sysInfo =获得实际手机的屏幕宽高= ", sysInfo.windowWidth, sysInfo.windowHeight);

        //得出应该放置的对应于left和top的距离
        this.leftPos = sysInfo.windowWidth * leftRatio;
        this.topPos = sysInfo.windowHeight * topRatio;
        // 上线前注释console.log("leftPos == ", this.leftPos, "topPos==", this.topPos);

        this.realWidth = ((this.gameQuan.width / 2) / windowSize.width) * sysInfo.windowWidth;
        this.shijigaodu = Math.abs((this.gameQuan.y / windowSize.height) * sysInfo.windowHeight) + (sysInfo.windowHeight / 2) - this.realWidth / 2;
        //创建游戏圈按钮
        let self = this;
        if (Global.TheGameLoop == null) {
            Global.TheGameLoop = this.clubButton = wx.createGameClubButton({
                //icon: 'white',
                type:"image",
                image:"https://img.zaohegame.com/staticfile/wx039e71b55cba9869/lift_icon2.png",
                style: {
                    left:self.leftPos - (self.gameQuan.width / 2),
                    top: self.shijigaodu - self.gameQuan.height,
                    width: self.gameQuan.width,
                    height: self.gameQuan.height,
                }
            });
            //self.clubButton.show();
        } else {
            Global.showGameLoop = true;
            this.clubButton = Global.TheGameLoop;
            // this.clubButton.style.left = this.leftPos - (this.gameQuan.width / 2);
            // this.clubButton.style.top = this.shijigaodu - this.gameQuan.height;
            this.clubButton.show();
        }
    },
    onHideGameLoop(){
        this.btn_2.active = true;
        this.clubButton.hide();
    },
});
