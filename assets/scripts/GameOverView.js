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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let self =this;
        var kill = cc.find("Canvas/player").getComponent("Player").killsnumber;
        var rank = Global.enemynumber-Global.dienumber+1;
        this.killtext.string = kill;
        this.ranktext.string = rank;
        if(rank!=1){
            let url = 'gameover_sb';
            cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                self.jb_img.spriteFrame = spriteFrame;
            });
            self.titletext.active =false;
            self.titleshibai.node.active = true;
        }
        Global.GameSettle(kill,rank,(res)=>{
            if(res.state ==1){
                self.goldnum.string = "x"+res.result.Gold;
                self.nlnum.string = "x"+res.result.Diamonds;
                self.addscore.string = "+"+res.result.Score;
                let url = res.result.thelvl+'.png';
                cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                    self.duanImg.spriteFrame = spriteFrame;
                });
                Global.RefreshUesrInfo();
            }
        });
        this.SmallDuanWei();
    },

    GameAgain(){
        //再来一局按钮线跳到首页出现推广窗口
        Global.is_Again = true;
        cc.director.loadScene("GameStart.fire");
    },
    OnFenxiang() {
        if (CC_WECHATGAME) {
            
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
    // update (dt) {},
});
