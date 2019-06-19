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
        this.time = 1;
        this.col = true;
        this.speed = 400;
        
        this.schedule(function(){
            this.node.getComponent(cc.Animation).play('skill_boom');
        },0,0,this.time);
    },
    init(){
        
    },
    update (dt) {
        if(this.col){
            if(this.time>0){
                this.time-=dt;
                this.node.x += this.dirVec.x*dt*this.speed ;
                this.node.y += this.dirVec.y*dt*this.speed ;
            }else{
                this.time =0;
                this.col = false;
                //this.node.getComponent(cc.Animation).play('skill_boom');
            }
            var top = this.player.map.height / 2;
            var bottom = -top;
            var left = - this.player.map.width / 2;
            var right = -left;
            var outScreen = this.node.x < left || this.node.x > right || this.node.y < bottom || this.node.y > top;
            if (outScreen) {
                this.node.destroy();
            }
        }
    },
    onBoomDestroy(){
        this.node.destroy();
    },
    onCollisionEnter: function (other, self) {
        if(other.node.group == "enemy"&&this.col&&other.getComponent("EnemyManager").trigger.behit){
            this.col = false;
            this.node.getComponent(cc.Animation).play('skill_boom');
            other.getComponent("EnemyManager").EnemyDamage(1);
            other.getComponent("EnemyManager").killername = this.player.Heroname.string;
            other.getComponent("EnemyManager").killsuuid = this.player.gameuuid;
            this.player.damage +=1;//造成伤害+1
        }
    },
});
