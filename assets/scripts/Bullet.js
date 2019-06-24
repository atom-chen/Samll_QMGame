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
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.player =  cc.find("Canvas/player").getComponent("Player");
    },
    init(data){
        this.width = data.width;
        var action = cc.moveTo(5, 240, 0);
        this.node.runAction(cc.sequence(action,cc.callFunc(()=>{
            this.node.destroy();
        },this)));
    },
    update (dt) {
        
    },
    onBoomDestroy(){
        this.node.destroy();
    },
    onCollisionEnter: function (other, self) {
        if(other.node.group == "gem"&&other.node.name == "item_stonePrefab"){
            this.node.stopAllActions();
            this.node.getComponent(cc.Animation).play('bullet');
        }
    },
});
