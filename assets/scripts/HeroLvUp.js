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
        herolv:cc.Label,
        btn_img:cc.Sprite,
        btn_goldnum:cc.Label,
        hp:cc.Label,
        attack:cc.Label,
        addattack:cc.Label,
        nlnum:cc.Label,
        tip_prefab:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let self = this;
        Global.GetUserHeros((res)=>{
            if(res.state ==1){
                this.herolv.string = res.result[0].Lvl.toString();
                this.attack.string = res.result[0].Damage.toString();
                this.daycount = res.result[0].DayCount;
                this.hp.string = res.result[0].Health.toString();
                this.addattack.string = "+"+(2*(res.result[0].Lvl)-1).toString();
                this.nlnum.string = res.result[0].costdimo.toString();
                if(res.result[0].canvideo){
                    this.btn_goldnum.string = "视频升级";
                    var url = "video_icon";
                    cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                        self.btn_img.spriteFrame = spriteFrame;
                    });
                }else{
                    this.btn_goldnum.string = "x"+res.result[0].costgold+" 升级";
                }
                this.costgold = res.result[0].costgold;
                this.costdimo = res.result[0].costdimo;
                this.isvideo = res.result[0].canvideo;
            }
        });
    },
    BuyHerosLvl(){
        // if(Global.gold<this.costgold){
        //     this.ShowTip("金币余额不足，请参与游戏~");
        // }else if(Global.diamond<this.costdimo){
        //     this.ShowTip("拥有能量不足，请参与游戏~");
        // }else if(Global.gold>this.costgold&&Global.diamond>this.costdimo){

        // }
        Global.BuyHerosLvl(this.isvideo,(res)=>{
            if(res.state ==1){
                console.log("6666");
            }
        });
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
    // update (dt) {},
});
