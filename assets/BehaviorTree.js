//Don't modify this if you want to re-modify the behaviortree in the future
//#########################################{"class":"go.TreeModel","nodeDataArray":[{"catagory":"Composite","color":"lightgreen","key":-1,"loc":"137.5 198.65","name":"Root","parameter":"{}","src":"icon/root.svg","textEditable":false,"type":"Root"},{"catagory":"Action","color":"lightcoral","key":-2,"loc":"516.5000000000002 253.64999999999986","name":"Attack","parameter":"{}","parent":-6,"src":"icon/customaction.svg","textEditable":true,"type":"Action"},{"catagory":"Condition","color":"palegoldenrod","key":-3,"loc":"524.4999999999995 148.64999999999995","name":"Look","parameter":"{\"radio\":150}","parent":-6,"src":"icon/customcondition.svg","textEditable":true,"type":"Condition"},{"catagory":"Composite","color":"lightblue","key":-7,"loc":"264.4999999999999 205.64999999999984","name":"Priority","parameter":"{}","parent":-1,"src":"icon/priority.svg","textEditable":true,"type":"Priority"},{"catagory":"Composite","color":"lightblue","key":-6,"loc":"366.5000000000001 171.64999999999998","name":"Sequence","parameter":"{}","parent":-7,"src":"icon/sequence.svg","textEditable":true,"type":"Sequence"},{"catagory":"Action","color":"lightcoral","key":-8,"loc":"389.49999999999994 283.6500000000001","name":"Patrol","parameter":"{}","parent":-7,"src":"icon/customaction.svg","textEditable":true,"type":"Action"}]}#############################################


cc.Class({
extends: cc.Component,
editor: {
inspector: 'packages://behaviortree-editor/bt-inspector.js'
},
properties: {
},
onLoad: function () {
let b3 = require('b3core.0.1.0module');
let self = this;
let  Attack = b3.Class(b3.Action);
Attack.prototype.name = 'Attack';
Attack.prototype.__Action_initialize = Attack.prototype.initialize;
Attack.prototype.initialize = function(settings){
         settings = settings || {};
         this.__Action_initialize();
         this.parameter = settings.parameter;
}
Attack.prototype.enter = function(tick){
           return self.getComponent('Attack').enter(tick,b3,this);
}
Attack.prototype.open = function(tick) {
           return self.getComponent('Attack').open(tick,b3,this);
}
Attack.prototype.tick = function(tick) {
           return self.getComponent('Attack').tick(tick,b3,this);
}
Attack.prototype.close = function(tick) {
           return self.getComponent('Attack').close(tick,b3,this);
}
Attack.prototype.exit = function(tick) {
           return self.getComponent('Attack').exit(tick,b3,this);
}
let  Look = b3.Class(b3.Condition);
Look.prototype.name = 'Look';
Look.prototype.__Condition_initialize = Look.prototype.initialize;
Look.prototype.initialize = function(settings){
         settings = settings || {};
         this.__Condition_initialize();
         this.parameter = settings.parameter;
}
Look.prototype.enter = function(tick){
           return self.getComponent('Look').enter(tick,b3,this);
}
Look.prototype.open = function(tick) {
           return self.getComponent('Look').open(tick,b3,this);
}
Look.prototype.tick = function(tick) {
           return self.getComponent('Look').tick(tick,b3,this);
}
Look.prototype.close = function(tick) {
           return self.getComponent('Look').close(tick,b3,this);
}
Look.prototype.exit = function(tick) {
           return self.getComponent('Look').exit(tick,b3,this);
}
let  Patrol = b3.Class(b3.Action);
Patrol.prototype.name = 'Patrol';
Patrol.prototype.__Action_initialize = Patrol.prototype.initialize;
Patrol.prototype.initialize = function(settings){
         settings = settings || {};
         this.__Action_initialize();
         this.parameter = settings.parameter;
}
Patrol.prototype.enter = function(tick){
           return self.getComponent('Patrol').enter(tick,b3,this);
}
Patrol.prototype.open = function(tick) {
           return self.getComponent('Patrol').open(tick,b3,this);
}
Patrol.prototype.tick = function(tick) {
           return self.getComponent('Patrol').tick(tick,b3,this);
}
Patrol.prototype.close = function(tick) {
           return self.getComponent('Patrol').close(tick,b3,this);
}
Patrol.prototype.exit = function(tick) {
           return self.getComponent('Patrol').exit(tick,b3,this);
}
let tree = new b3.BehaviorTree();
tree.root = new b3.Sequence({parameter:{},children:[new b3.Priority({parameter:{},children:[new b3.Sequence({parameter:{},children:[new Look({parameter:{'radio':150}}),new Attack({parameter:{}})]}),new Patrol({parameter:{}})]})]});
this.tree = tree;
this.blackboard = new b3.Blackboard();
this.b3 = b3;
},
tick: function(target,dt){
let t = {};
if(target != undefined){t = target;}
this.tree.tick(t,this.blackboard,dt)
}});
