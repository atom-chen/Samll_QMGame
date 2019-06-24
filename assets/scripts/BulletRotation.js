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
        Rocker:{
            default:null,
            type:require("Skill"),
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.player = cc.find("Canvas/player/hero");
    },

     update (dt) {
        if(this.Rocker.dir.mag()<0.5){
            return;
        }
         //方向计算
         var r = Math.atan2(this.Rocker.dir.y,this.Rocker.dir.x);
         var degree = r * 180/(Math.PI);
        //  degree = 360 - degree + 90;
        if(this.player.scaleX==-1){
            this.node.rotation = degree+180;
        }else{
            this.node.rotation = -degree;
        }
        //this.node.rotation = -degree;
     },
});
