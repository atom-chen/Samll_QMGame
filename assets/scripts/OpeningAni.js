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
        yun_1:{
            default:null,
            type:cc.Node,
        },
        yun_2:{
            default:null,
            type:cc.Node,
        },
        tip:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let self = this;
        this.yun_1pos = this.yun_1.position;
        this.hide1pos = cc.v2(-625, 0);
        this.yun_2pos = this.yun_2.position;
        this.hide2pos = cc.v2(625, 0);
        this.yun_1.runAction(cc.moveTo(3, self.hide1pos));
        this.yun_2.runAction(cc.moveTo(3, self.hide2pos));
        this.scheduleOnce(function() {
            this.node.destroy();
            this.tip.active =true;
        }, 3);
    },

    // update (dt) {},
});
