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
        text:cc.Label,
        number:cc.Label,
        img:cc.Sprite,
        videoBtn:cc.Node,
        showappBtn:cc.Node,
        receivePrefab:cc.Prefab,
        tip_prefab:cc.Prefab,
        isSign_img:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (typeof (wx) !== "undefined") {
            var self = this;
            wx.onShow(function () {
                self.ShowTip("分享成功");
            })
        }
    },
    onEnable(){
        this.GetUserSignInfo();
    },
    start () {
        
    },
    GetUserSignInfo(){
        var self = this;
        Global.GetUserSignInfo((res)=>{
            if(res.state == 1){
                if(res.result.istoday){
                    if(res.result.days ==1){
                        self.text.string = (res.result.days).toString();
                    }else{
                        self.text.string = (res.result.days-1).toString();
                    }
                    //TODO 已经签到图片改变
                    var imgurl = "text_xuanyao";
                    cc.loader.loadRes(imgurl, cc.SpriteFrame, function (err, spriteFrame) {
                        self.img.spriteFrame = spriteFrame;
                    });
                    self.videoBtn.active = false;
                    self.showappBtn.active = true;
                    self.isSign_img.active = true;
                }else{
                    var day = res.result.days-1;
                    if(day<0){
                        day = 0;
                    }
                    self.text.string = day;
                    this.num = res.result.gold;
                    self.number.string = "x"+this.num;
                }
            }
        });
    },
    //看视频领取
    OnVideoBtn(){
        this.ShowTip("观看视频成功");
        this.scheduleOnce(function() {
            var receive = cc.instantiate(this.receivePrefab);
            let data = {
                number:this.num,
            }
            receive.getComponent("RewardPrefab").init(data);
            this.node.addChild(receive);
        },1)
    },
    ShowTip(text){
        let tip = cc.instantiate(this.tip_prefab);
        if (tip) {
            this.node.addChild(tip);
            let src = tip.getComponent(require("TipShow"));
            if (src) {
                src.label.string = text;
            }
        }
    },
    onShowApp(){
        if (CC_WECHATGAME) {
           
            wx.shareAppMessage({
                title: '被这游戏分分钟虐的怀疑人生，我就问问：还有谁？',
                imageUrl: Global.shareimg,
                success(res) {
                    console.log("yes");
                },
                fail(res) {
                    console.log("failed");
                },
            });
        }
    }
    // update (dt) {},
});
