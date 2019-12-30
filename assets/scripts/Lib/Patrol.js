import RobotHero from '../game/RobotHero';

cc.Class({
extends: cc.Component,

properties: {
    master:{
        default:null,
        type:RobotHero,
    }
},


onLoad: function () {

},
enter: function(tick,b3,treeNode){

},
open: function(tick,b3,treeNode){

},
tick: function(tick,b3,treeNode){
    let dt = tick.dt;
    this.master.Patrol(dt);
    return b3.SUCCESS;
},
close: function(tick,b3,treeNode){

},
exit: function(tick,b3,treeNode){

},

});
