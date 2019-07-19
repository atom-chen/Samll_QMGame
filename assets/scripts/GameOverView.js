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
        killtext:{
            default:null,
            type:cc.Label,
        },
        ranktext:{
            default:null,
            type:cc.Label,
        },
        jb_img:{
            default:null,
            type:cc.Sprite,
        },
        titletext:cc.Node,
        titleshibai:cc.Label,
        goldnum:cc.Label,
        nlnum:cc.Label,
        addscore:cc.Label,
        jifenBar:cc.ProgressBar,
        jifenText:cc.Label,
        duanImg:cc.Sprite,
        duantext:cc.Label,
        VictoryBgm:{
            default:null,
            type:cc.AudioSource,
        },
        LoseBgm:{
            default:null,
            type:cc.AudioSource,
        },
        tanchuangprefab:{
            default:null,
            type:cc.Prefab,
        },
        page_1:cc.Node,
        page_2:cc.Node,
        //2个循环播放的广告
        jumpAppPrefab: {
            default: [],
            type: cc.Node,
        },
        smallGamePrefab:{
            default:null,
            type:cc.Prefab,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        //广告位置
        Global.banner.show();
        Global.banner.style.left = (Global.ScreenWidth-Global.banner.style.realWidth)/2;
        //阿拉丁埋点
        wx.aldSendEvent("游戏进行页面停留时间",{
            "耗时" : (Date.now()-Global.startTime)/1000
          }); 
        // 阿拉丁埋点
        wx.aldSendEvent("游戏结束",{"dmx_finishPage_pv/uv":"页面访问数"});
        this.startTime = Date.now();

        let self =this;
        if(cc.find("Canvas/MaskDuQuan").height<=0||cc.find("Canvas/MaskDuQuan").width<=0){
            var rank = 1;
        }else{
            var rank = Global.enemynumber-Global.dienumber+1;
        }
        var kill = cc.find("Canvas/player").getComponent("Player").killsnumber;
        
        console.log("机器人总数： "+Global.enemynumber);
        console.log("机器人死亡数： "+Global.dienumber);
        this.killtext.string = kill;
        this.ranktext.string = rank;
        if(rank!=1){
            this.LoseBgm.play();
            let url = 'gameover_sb';
            cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                self.jb_img.spriteFrame = spriteFrame;
                self.jb_img.width = self.jb_img.height = 24;
            });
            self.titletext.active =false;
            self.titleshibai.node.active = true;
            if(cc.find("Canvas/player").getComponent("Player").killername!=null){
                let name_string = cc.find("Canvas/player").getComponent("Player").killername;
                self.titleshibai.string = "本轮被玩家"+name_string+"淘汰了";
            }else{
                self.titleshibai.string = "本轮被毒圈淘汰了";
            }
        }else{
            this.VictoryBgm.play();
        }
        Global.GameSettle(kill,rank,(res)=>{
            if(res.state ==1){
                this.curgold =  res.result.Gold;
                self.goldnum.string = "x"+this.curgold;
                self.nlnum.string = "x"+res.result.Diamonds;
                self.addscore.string = "+"+res.result.Score;
                let url = res.result.thelvl+'.png';
                cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                    self.duanImg.spriteFrame = spriteFrame;
                });
                if(res.result.chest.givevalue){
                    Global.boxChest = res.result.chest;
                    Global.endHaveBox = true;
                }
                Global.RefreshUesrInfo((res)=>{
                    Global.gold = res.result.gold;
                    Global.diamond= res.result.diamonds;
                    Global.userlvl = res.result.userlvl;
                    Global.score = res.result.score;
                    for(let i =0;i<Global.SeaonLvl.length;i++){
                        if(Global.userlvl == Global.SeaonLvl[i].id){
                            Global.duntext = Global.SeaonLvl[i].name;
                        }
                    }
                    this.SmallDuanWei();
                });
            }
        });
        this.ChangeJumpAppSelectSprite();
    },
    GameAgain(){
        //隐藏广告
        Global.banner.hide();
        //再来一局按钮线跳到首页出现推广窗口
        Global.is_Again = true;
        wx.aldSendEvent("游戏结束页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
          });
        cc.director.loadScene("GameStart.fire");
    },
    OnFenxiang() {
        if (CC_WECHATGAME) {
            // 阿拉丁埋点
            wx.aldSendEvent('分享',{'dmx_share_click()' : '游戏结束'});

            wx.shareAppMessage({
                title: '这是我的战绩可敢一战',
                imageUrl: Global.shareimg,
                success(res) {
                    console.log("yes");
                },
                fail(res) {
                    console.log("failed");
                },
            });
        }
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
                var curscore =  0;
                if(Global.userlvl==1){
                    score = (Global.score -Global.SeaonLvl[i].minscore)/jifen;
                    curscore = (Global.score -Global.SeaonLvl[i].minscore)%jifen;
                }else{
                    score = (Global.score -Global.SeaonLvl[i].minscore +1)/jifen;
                    curscore = (Global.score -Global.SeaonLvl[i].minscore +1)%jifen;
                }
                this.ChangeStarText(Math.floor(score));
                this.jifenBar.progress = curscore / jifen;
                this.jifenText.string = curscore +"/"+jifen;
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
    showAdVedio(){
        Global.showAdVedio(this.Success.bind(this),this.Failed.bind(this));
    },
    Success(){
        this.page_1.active = false;
        this.page_2.active = false;
        this.curgold = this.curgold*2;
        var tanchuang = cc.instantiate(this.tanchuangprefab);
        tanchuang.getComponent("GameOver_TanChuang").init(this.curgold);
        this.node.addChild(tanchuang);
    },
    Failed(){
        Global.ShowTip(this.node,"观看完整视频才能获的双倍奖励");
    },
    //点点小游戏
    SmallGame(){
        var small = cc.instantiate(this.smallGamePrefab);
        //增加金币
        Global.UserChange(2,1,"结算奖励",this.coinNum,(res)=>{
            if(res.state ==1){
                Global.gold+= this.coinNum;
            }
        });
        this.node.parent.addChild(small);
    }
    // update (dt) {},
});
