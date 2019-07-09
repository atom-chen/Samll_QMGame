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
        this.isboom = true;         //子弹碰撞之后就禁用碰撞防止造成多重伤害
    },
    init(data){
        this.attack = data.attack;  //攻击力
        this.hit = data.hit;        //命中率
        this.crit = data.crit;      //暴击率
        this.id = data.uuid;        //id(用来辨别是否打中自己)
        this.width = data.width;
        this.killname = data.killname;
        //子弹位移
        var action = cc.moveTo(0.3, this.width, 0);
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
        if(other.node.group == "stone"&&this.isboom){
            this.isboom = false;
            this.node.stopAllActions();
            this.node.getComponent(cc.Animation).play('bullet');
        }else if(other.node.group == "enemy"&&this.isboom){
            if(other.getComponent("EnemyPrefab").gameuuid!=this.id){
                this.isboom = false;
                //命中率
                var ranhit = Math.random();
                if(ranhit<=this.hit){
                    this.node.stopAllActions();
                    this.node.getComponent(cc.Animation).play('bullet');
                    other.getComponent("EnemyPrefab").killername = this.killname;
                    //调用受伤方法
                    //暴击率
                    var rancrit = Math.random();
                    if(rancrit<=this.crit){
                        //TODO 暴击特效，伤害翻倍
                        other.getComponent("EnemyPrefab").HeroDamage(this.attack*2);
                        other.getComponent("EnemyPrefab").ShowBoomImg();
                    }else{
                        other.getComponent("EnemyPrefab").HeroDamage(this.attack);
                    }
                }
            }
        }else if(other.node.group == "Player"&&this.isboom){
            if(other.getComponent("Player").gameuuid!=this.id){
                this.isboom = false;
                //命中率
                var ranhit = Math.random();
                if(ranhit<=this.hit){
                    this.node.stopAllActions();
                    this.node.getComponent(cc.Animation).play('bullet');
                    other.getComponent("Player").killername = this.killname;
                    //调用受伤方法
                    //暴击率
                    var rancrit = Math.random();
                    if(rancrit<=this.crit){
                        //TODO 暴击特效，伤害翻倍
                        other.getComponent("Player").HeroDamage(this.attack*2);
                        other.getComponent("Player").ShowBoomImg();
                    }else{
                        other.getComponent("Player").HeroDamage(this.attack);
                    }
                }
            }
        }
    },
});
