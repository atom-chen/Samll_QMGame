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
        btn:cc.Button,
        videobtn:cc.Button,
        videoimg:cc.Node,
        videolabel:cc.Node,
        tip_prefab:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.GetUserHeros();
    },
    GetUserHeros(){
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
                    this.videobtn.node.active = true;
                }else{
                    this.btn_goldnum.string = "x"+res.result[0].costgold+" 升级";
                }
                if(this.daycount<=0){
                    //按钮致灰，修改图片和文字颜色
                    this.videobtn.interactable = false;
                    this.videoimg.color = this.videobtn.disabledColor;
                    this.videolabel.color = this.videobtn.disabledColor;
                    this.btn.interactable = false;
                    this.btn_img.node.color = this.btn.disabledColor;
                    this.btn_goldnum.node.color = this.btn.disabledColor;
                }
                this.costgold = res.result[0].costgold;
                this.costdimo = res.result[0].costdimo;
                this.isvideo = res.result[0].canvideo;
                Global.hp = res.result[0].Health;
                Global.attack = res.result[0].Damage;
            }
        });
    },
    BuyHerosLvl(){
        if(Global.gold<this.costgold){
            this.ShowTip("金币余额不足，请参与游戏获得~");
        }else if(Global.diamond<this.costdimo){
            this.ShowTip("拥有能量不足，请参与游戏获得~");
        }else if(Global.gold>this.costgold&&Global.diamond>this.costdimo){
            Global.BuyHerosLvl(this.isvideo,(res)=>{
                if(res.state ==1){
                    this.GetUserHeros();
                    Global.gold = res.result.gold;
                    Global.diamond = res.result.diamonds;
                    this.ShowTip("升级成功");
                    cc.game.emit('UserChang');
                }
            });
        }
    },
    VideoBuyHerosLvl(){
        if(Global.diamond<this.costdimo){
            this.ShowTip("拥有能量不足，请参与游戏获得~");
        }else{
            // this.ShowTip("观看视频成功");
            // 阿拉丁埋点
            wx.aldSendEvent('dmx_advertising_click()',{'page' : '游戏准备'});
            Global.showAdVedio(this.Success.bind(this),this.Failed.bind(this));
        }
    },
    Success(){
        // 阿拉丁埋点
        wx.aldSendEvent('dmx_advertising_click()',{'valid' : '是'});
        Global.BuyHerosLvl(this.isvideo,(res)=>{
            if(res.state ==1){
                this.GetUserHeros();
                Global.gold = res.result.gold;
                Global.diamond = res.result.diamonds;
                this.ShowTip("升级成功");
                cc.game.emit('UserChang');
            }
        });
    },
    Failed(){
        // 阿拉丁埋点
        wx.aldSendEvent('dmx_advertising_click()',{'valid' : '否'});
        this.ShowTip("观看完整视频才能获取奖励");
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
