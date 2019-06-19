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
        goldtext:cc.Label,
        diamondtext:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let self = this;
        this.ChangGold();
        //监听刚改变金币或者钻石时发送
        cc.game.on('UserChang',function(){
            self.ChangGold();
        },this)
    },
    ChangGold(){
        if(Global.gold>10000){
            let num = Global.gold/10000;
            this.goldtext.string = Math.floor(num*100)/100 +"w";
        }else{
            this.goldtext.string = Global.gold;
        }
        if(Global.diamond>10000){
            let num = Global.diamond/10000;
            this.diamondtext.string = Math.floor(num*100)/100 +"w";
        }else{
            this.diamondtext.string = Global.diamond;
        }
    }
    // update (dt) {},
});
