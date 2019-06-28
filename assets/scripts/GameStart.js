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
        let self = this;
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
        Global.TiaoZhanFriend();
    },
    onPlayBtn(){
        let self = this;
        cc.find("Canvas/PiPeiView").active = true;
        //2s显示匹配成功
        this.scheduleOnce(function() {
            self.text.string = "匹配成功";
            self.content.active = false;
            self.hook.active =true;
            cc.director.loadScene("Game.fire");
        }, 2)
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
});
