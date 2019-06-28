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
        tip_prefab:{
            default:null,
            type:cc.Prefab,
        },
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.getComponent(cc.Mask)._clearGraphics.rect(-20000, -20000, 60000 ,60000); 
        this.node.getComponent(cc.Mask)._clearGraphics.fill();

    },

    start () {
        //出现提示
        this.is_suodu= true;
        this.time=0;
        this.speed = 0;
        this.scheduleOnce(function() {
            this.ShowTips();
            this.time = 30;
            this.speed = 50;
            this.is_suodu= true;
        }, 60);
        this.scheduleOnce(function() {
            this.ShowTips();
            this.time = 50;
            this.speed = 80;
            this.is_suodu= true;
        }, 150);
    },
    ShowTips(){
        let tip = cc.instantiate(this.tip_prefab);
        if (tip) {
            cc.find("Canvas").addChild(tip);
            tip.runAction(cc.sequence(cc.blink(5, 5),cc.callFunc(()=>{
                tip.destroy();
            },this)));
        }
    },
    update (dt) {
         if(Global.is_end){
             this.unscheduleAllCallbacks();
             return;
         }
         if(this.node.height<=0){
            Global.is_end = true;
            this.scheduleOnce(function() {
                cc.find("Canvas/GameOverView").active = true;
            }, 2);
            return
         }
         if(!this.is_suodu){
             return;
         }
         if(this.time>=0){
            this.node.width -= dt*this.speed;
            this.node.height -= dt*this.speed;
            //this.node.getComponent(cc.CircleCollider).radius = this.node.width/2;
            this.node.getComponent(cc.BoxCollider).size.width = this.node.width;
            this.node.getComponent(cc.BoxCollider).size.height = this.node.height;
            this.time -=dt;
         }else{
            this.is_suodu = false;
         }
         
     },
     //开始触发
     onCollisionEnter: function (other, self) {
        if(other.node.group == "Player"){
            other.getComponent("Player").is_chidu = false;
        }else if(other.node.group == "enemy"){
            other.getComponent("EnemyPrefab").is_chidu = false;
        }
    },
    //持续触发
    onCollisionStay: function (other, self) {
        if(other.node.group == "Player"){
            other.getComponent("Player").is_chidu = false;
        }else if(other.node.group == "enemy"){
            other.getComponent("EnemyPrefab").is_chidu = false;
        }
    },
    //触发结束
    onCollisionExit: function (other, self) {
        if(other.node.group == "Player"){
            other.getComponent("Player").is_chidu = true;
        }else if(other.node.group == "enemy"){
            other.getComponent("EnemyPrefab").is_chidu = true;
        }
    },
});
