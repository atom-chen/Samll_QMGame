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
        timelabel:cc.Label,
        probar:cc.ProgressBar,
        gameview:cc.Node,
        winview:cc.Node,
        windoubleview:cc.Node,
        loseview:cc.Node,
        //2个循环播放的广告
        jumpAppPrefab: {
            default: [],
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.isClick = false;
        this.clicktime = 1;
        this.OpenGameView();
        this.ChangeJumpAppSelectSprite();
        Global.banner.show();
        Global.banner.style.left = (Global.ScreenWidth-Global.banner.style.realWidth)/2;
        Global.banner.style.top = Global.ScreenWidth;
    },
    OpenGameView(){
        this.gameview.active = true;
        this.loseview.active = false;
        this.time =20;
        this.schedule(this.doCountdownTime,1);
    },
    onClickGameBtn(){
        this.isClick = true;
        this.probar.progress += 0.2;
        this.schedule(function (){
            this.isClick =false;
        },1);
        if(this.probar.progress >=1){
            this.gameview.active = false;
            this.OpenWinView();
            Global.banner.style.top = Global.ScreenHeight - Global.banner.style.realHeight;
        }
    },
    //倒计时
    doCountdownTime(){
        //每秒更新显示信息
        if (this.time > 0 ) {
            this.time -= 1;
            var second = this.time;
            second = second < 10 ? ('0' + second) : second;
            this.timelabel.string ="00:"+second;
            this.countDownShow(this.time);
        }
    },
    countDownShow(temp){
        if(temp<=0){
            this.unschedule(this.doCountdownTime);
            this.gameview.active = false;
            this.loseview.active = true;
        }
    },
    GameAgain(){
        //隐藏广告
        Global.banner.hide();
        //再来一局按钮线跳到首页出现推广窗口
        Global.is_Again = true;
        cc.director.loadScene("GameStart.fire");
    },
    OpenWinView(){
        this.winview.active = true;
        this.glodnum = Math.round(Math.random()*20) +30;
        this.winview.getChildByName("goldnum").getComponent(cc.Label).string = "x"+this.glodnum;
    },
    showAdVedio(){
        Global.showAdVedio(this.Success.bind(this),this.Failed.bind(this));
    },
    Success(){
       this.winview.active = false;
       this.windoubleview.active = true;
       this.glodnum = this.glodnum *2;
       this.windoubleview.getChildByName("goldnum").getComponent(cc.Label).string = "x"+this.glodnum;
    },
    Failed(){
        Global.ShowTip(this.node,"观看完整视频才能获的双倍奖励");
    },
    HaveGlobBtn(){
        //增加金币
        Global.UserChange(2,1,"点点小游戏",this.glodnum,(res)=>{
            if(res.state ==1){
                Global.gold+= this.glodnum;
            }
        });
        //隐藏广告
        Global.banner.hide();
        //再来一局按钮线跳到首页出现推广窗口
        Global.is_Again = true;
        cc.director.loadScene("GameStart.fire");
    },

    /**
     * 循环切换广告图片的方法
     */
    ChangeJumpAppSelectSprite() {
        let Arr_jumpApp_Sprite = [];
        for (let i = 0; i < this.jumpAppPrefab.length; i++) {
            let sprite = this.jumpAppPrefab[i].getChildByName("sprite");
            let temp = sprite.getComponent(cc.Sprite);
            Arr_jumpApp_Sprite.push(temp);
            this.jumpAppPrefab[i].index = i;
            this.jumpAppPrefab[i].on("touchend", this.TouchEnd, this);
            this.JumpAppFangSuo(this.jumpAppPrefab[i]);
        }
        this.schedule(() => {
            for (let j = 0; j < this.jumpAppPrefab.length; j++) {
                // // 上线前注释console.log(" Arr_jumpApp_Sprite[j].index == ", Arr_jumpApp_Sprite[j].index);
                if (this.jumpAppPrefab[j].index < Global.jumpappObject.length - 1) {
                    this.jumpAppPrefab[j].index++;
                } else {
                    this.jumpAppPrefab[j].index = 0;
                }
                Arr_jumpApp_Sprite[j].spriteFrame = Global.jumpappObject[this.jumpAppPrefab[j].index].sprite;
            }
        }, 3.0, cc.macro.REPEAT_FOREVER, 0.1);
    },

    /**
    * 游戏广告按钮的放缩
    */
    JumpAppFangSuo: function (node) {
        var self = this;
        this.schedule(function () {
            var action = self.FangSuoFun();
            node.runAction(action);
        }, 1.0, cc.macro.REPEAT_FOREVER, 0.1);
    },

    /**
     * 按钮放缩方法
     */
    FangSuoFun: function () {
        var action = cc.sequence(
            cc.scaleTo(0.5, 1.0, 1.0),
            cc.scaleTo(0.5, 1.2, 1.2),
        );
        return action;
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
    update (dt) {
        if(!this.isClick){
            if(this.clicktime>0){
                this.clicktime -=dt;
            }else{
                this.clicktime =1;
                if(this.probar.progress-0.2>=0){
                    this.probar.progress -=0.2;
                }else{
                    this.probar.progress =0;
                }
            }
        }
        
    },
});
