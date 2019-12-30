import GameControl from "../game/GameControl";
import HeroControl from "../game/HeroControl";
cc.Class({
extends: cc.Component,

properties: {
    
},
        


onLoad: function () {
    this.playerCtl = cc.find("Canvas/gameworld").getComponent(GameControl).heroScript;
},
enter: function(tick,b3,treeNode){

},
open: function(tick,b3,treeNode){

},
tick: function(tick,b3,treeNode){
    let radio = treeNode.parameter.radio;
    let playerX = this.playerCtl.getPosition();
    let dir = this.node.position.sub(playerX);

    if(Math.sqrt(dir.x*dir.x+dir.y*dir.y) < radio) {
    // if(this.node.getComponent("RobotTrigger").this.isGO == false) {
        console.log("发现玩家!");
        return b3.SUCCESS;
    }else {
        // console.log("没有敌人");
        return b3.FAILURE;
    }
},
close: function(tick,b3,treeNode){

},
exit: function(tick,b3,treeNode){

},

});
