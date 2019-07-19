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
        coinNum_Label:cc.Label,
        smallgame:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.coinNum_Label.string = "x" + this.coinNum;
    },
    init(coinNum) {
        this.coinNum = coinNum;
    },
    /**
      * 关闭界面
      */
     onClickClose: function () {
        var small = cc.instantiate(this.smallgame);
        this.node.parent.active = false;
        this.node.parent.parent.addChild(small);
        //增加金币
        Global.UserChange(2,1,"结算双倍奖励",this.coinNum,(res)=>{
            if(res.state ==1){
                Global.gold+= this.coinNum;
            }
        });
        this.node.destroy();
    },
    // update (dt) {},
});
