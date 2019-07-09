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
        enemy:{
            default:null,
            type:cc.Node,
        },
        skill_bullet:{
            default:null,
            type:cc.Prefab,
        },
        gun:{
            default:null,
            type:cc.Node,
        },
        is_trigger:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.dir = cc.v2(-1,0);
        this.FangXiang();

        this.cd = this.enemy.getComponent("EnemyPrefab").cd;
        this.is_Cd = false;
        this.isGO = true;
        this.map =  cc.find("Canvas/gamebg");
        this.gameuuid = this.enemy.getComponent("EnemyPrefab").gameuuid;
        this.isNoturn = false;
    },

    update (dt) {
        if(this.is_Cd){
            if(this.cd>0){
                this.cd-=dt;
            }else{
                this.is_Cd =false;
                this.cd=this.enemy.getComponent("EnemyPrefab").cd;
            }
        }
        // if(this.is_trigger && !Global.is_end &&this.isGO){
        //     var vx = this.dir.x * this.enemy.getComponent("EnemyPrefab").speed;
        //     var vy = this.dir.y * this.enemy.getComponent("EnemyPrefab").speed;

        //     var sx = vx * dt;
        //     var sy = vy * dt;
        //     //移动
        //     this.enemy.x += sx;
        //     this.enemy.y += sy;
            
        //     // this.enemy.getComponent("EnemyPrefab").player.rotation = degree;
        //     //人物移动不能超过地图边界
        //     if(this.enemy.x<0 && Math.abs(this.enemy.x -this.enemy.width/2)>=(this.map.width/2)){
        //         this.is_trigger =false;
        //     }else if(this.enemy.x>0 && Math.abs(this.enemy.x +this.enemy.width/2)>=(this.map.width/2)){
        //         this.is_trigger =false;
        //     }else if(this.enemy.y>0 && Math.abs(this.enemy.y +this.enemy.height/2)>=(this.map.height/2)){
        //         this.is_trigger =false;
        //     }else if(this.enemy.y<0 && Math.abs(this.enemy.y -this.enemy.height/2)>=(this.map.height/2)){
        //         this.is_trigger =false;
        //     }
        // }
    },
    //方向计算
    FangXiang(){
        //方向计算
        var r = Math.atan2(this.dir.y,this.dir.x);
        var degree = r * 180/(Math.PI);
        degree = 360 - degree + 90;
        //(0~180)抢朝向是正的(180~360)抢换个方向
        var rotationnum = Math.abs(degree)%360;
        if(rotationnum>=0&&rotationnum<=180){
            this.enemy.getChildByName("hero").scaleX  = Math.abs(this.enemy.getChildByName("hero").scaleX);
        }else if(rotationnum>180&&rotationnum<360){
            this.enemy.getChildByName("hero").scaleX =  Math.abs(this.enemy.getChildByName("hero").scaleX) *-1;
        }
    },
    //移动方向
    ComputeDir(otherpos){
        this.isGO = false;
        var pos = otherpos.sub(this.enemy.position);
        var len = pos.mag();
        //var time = len /this.enemy.getComponent("EnemyPrefab").speed;
        if(len !=0 ){
            this.dir.x = pos.x / len;
            this.dir.y = pos.y / len;
            this.is_trigger =true;
        }
        this.FangXiang();

        // var action = cc.moveTo(2, otherpos.x, otherpos.y);
        // this.enemy.runAction(cc.sequence(action,cc.callFunc(()=>{
        //     //this.enemy.getChildByName("hero").getComponent(cc.Animation).play('heromove');
        //     this.isGO = true;
        //     this.enemy.stopAction(action);
        // },this)));
        this.scheduleOnce(function() {
            this.isGO = true;
        }, 1.5);
    },
    //射击技能
    UserSkill(otherpos){
        this.isGO = false;
        this.is_Cd = true;
        //this.enemy.stopAllActions();
        var pos = otherpos.sub(this.enemy.position);
        var len = pos.mag();
        if(len !=0 ){
            this.dir.x = pos.x / len;
            this.dir.y = pos.y / len;
        }
        this.FangXiang();
        //方向计算
        var r = Math.atan2(this.dir.y,this.dir.x);
        var degree = r * 180/(Math.PI);
        if(this.enemy.getChildByName("hero").scaleX==-1){
            this.gun.rotation = degree+180;
        }else{
            this.gun.rotation = -degree;
        }
        
        let data = {
            width:240,
            attack:this.enemy.getComponent("EnemyPrefab").attack,
            crit:this.enemy.getComponent("EnemyPrefab").crit,
            hit:this.enemy.getComponent("EnemyPrefab").hit,
            uuid:this.enemy.getComponent("EnemyPrefab").gameuuid,
            killname:this.enemy.getComponent("EnemyPrefab").Heroname.string,
        }
        let skillbullet = cc.instantiate(this.skill_bullet);
        skillbullet.getComponent("Bullet").init(data);
        this.gun.addChild(skillbullet);
        this.scheduleOnce(function() {
            this.gun.rotation = 0;
            this.isGO = true;
        }, 0.9);
    },
    onCollisionEnter: function (other, self) {
        //判断碰撞的类型
        if(this.isGO){
            if(other.node.group == "Player"){
                this.UserSkill(other.node.position);
            }else if(other.node.group == "enemy" && other.getComponent("EnemyPrefab").gameuuid != this.gameuuid){
                this.ComputeDir(other.node.position);
            }else if(other.node.group == "gem"){
                if((other.node.name != "item_grassPrefab"&&!this.isNoturn)){
                    this.ComputeDir(other.node.position);
                }
            }
        }
    },
    onCollisionStay: function (other, self) {
        if(this.isGO){
            if(other.node.group == "gem"){
                if((other.node.name != "item_grassPrefab"&&!this.isNoturn)){
                    this.ComputeDir(other.node.position);
                }
            }
        }
        if(other.node.group == "Player"&&!this.is_Cd){
            this.UserSkill(other.node.position);
        }else if(!this.is_Cd&&other.node.group == "enemy"&&other.getComponent("EnemyPrefab").gameuuid!=this.gameuuid){
            this.UserSkill(other.node.position);
        }
    },
    // onCollisionExit: function (other, self) {
    //     if(other.node.group == "gem"){
    //         if(other.node.name != "item_grassPrefab"||other.node.name != "item_stonePrefab"){
    //             this.isGO = true;
    //         }
    //     }else if(other.node.group == "Player"){
    //         this.isGO = true;
    //     }
    // },
});
