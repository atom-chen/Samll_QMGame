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
        number:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    init:function(data){
        this.signNum = data.number;
        this.number.string = "x"+data.number;
    },
    onClose(){
        Global.UserSign(2,(res)=>{
            if(res.state ==1){
                cc.find("Canvas/SignView").getComponent("SignView").GetUserSignInfo();
                Global.UserChange(1,1,"签到",this.signNum,(res)=>{
                    if(res.state ==1){
                        Global.diamond+= this.signNum;
                        cc.game.emit('UserChang');
                    }
                });
            }
        });
        
        this.node.destroy();
    }
    // update (dt) {},
});
