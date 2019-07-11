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
        enemyPrefab:{
            default:null,
            type:cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(Global.is_end){
            Global.is_end = false;
            Global.dienumber = 0;
        }
    },

    start () {
        this.index =0;
        this.isCreate =false;

        this.arrPos = [{x:-1350,y:-900},{x:-1050,y:-900},{x:-750,y:-900},{x:-450,y:-900},{x:-150,y:-900},{x:150,y:-900},{x:450,y:-900},{x:750,y:-900},{x:1050,y:-900},{x:1350,y:-900},
            {x:-1350,y:-300},{x:-1050,y:-300},{x:-750,y:-300},{x:-450,y:-300},{x:450,y:-300},{x:750,y:-300},{x:1050,y:-300},{x:1350,y:-300},
            {x:-1350,y:300},{x:-1050,y:300},{x:-750,y:300},{x:-450,y:300},{x:450,y:300},{x:750,y:300},{x:1050,y:300},{x:1350,y:300},
            {x:-1350,y:900},{x:-1050,y:900},{x:-750,y:900},{x:-450,y:900},{x:-150,y:900},{x:150,y:900},{x:450,y:900},{x:750,y:900},{x:1050,y:900},{x:1350,y:900},
        ];
        Global.GetName(Global.enemynumber,(res)=>{
            if(res.state ==1){
                this.ArrName = res.result;
                // for(let i = 0; i < 10; i++){
                //     this.scheduleOnce(function() {
                //         let name_string = res.result[i];
                //         if(name_string.length>5){
                //             name_string = name_string.substr(0,5);
                //         }
                //         var arrRan = Math.floor((Math.random()*this.arrPos.length));
                //         var arrpos = this.arrPos[arrRan];
                //         this.arrPos.splice(arrRan-1,1);
                //         this.createEnemy(i,1,name_string,arrpos);
                //     },0.01);
                // }
                this.isCreate =true;
            }
        });
        //延迟生成
        // this.scheduleOnce(function() {
        //     this.isCreate =true;
        // },34);
        // this.scheduleOnce(function() {
        //     this.isCreate =true;
        // },54);
        this.scheduleOnce(function() {
            this.isCreate =true;
        },94);
        this.secondPos=[{x:-1350,y:-300},{x:-1050,y:-300},{x:-750,y:-300},{x:-450,y:-300},{x:450,y:-300},{x:750,y:-300},{x:1050,y:-300},{x:1350,y:-300},
            {x:-1350,y:300},{x:-1050,y:300},{x:-750,y:300},{x:-450,y:300},{x:450,y:300},{x:750,y:300},{x:1050,y:300},{x:1350,y:300},
            {x:-150,y:-900},{x:150,y:-900},
            {x:-150,y:-300},{x:150,y:-300},
            {x:-150,y:300},{x:150,y:300},
            {x:-150,y:900},{x:150,y:900},
        ];
    },
    UpdateCreateEnemy(){
        var pos = cc.find("Canvas/player").position;
        this.leftx = pos.x-350;
        this.rightx = pos.x+350;
        this.topy = pos.y+180;
        this.bottomy = pos.y-180;
        var ran = Math.floor((Math.random()*this.arrPos.length));
        this.num = this.arrPos[ran];
        if(this.num.x<this.leftx||this.num.x>this.rightx||this.num.y<this.bottomy|this.num.y>this.topy){
            this.arrPos.splice(ran-1,1);
            var enemypos = cc.v2(this.num.x,this.num.y);
            let name_string = this.ArrName[this.index];
            if(name_string.length>5){
                name_string = name_string.substr(0,5);
            }
            this.createEnemy(this.index,1,name_string,enemypos);
            this.index++;
        }
        if(this.index==25){
            this.isCreate =false;
        }
    },
    DelayCreateEnemy(){
        var pos = cc.find("Canvas/player").position;
        //玩家的视野范围
        // var leftx = -1500-(pos.x-350);
        // var rightx = 1500-(pos.x+350);
        // var topy = 1200-(pos.y+180);
        // var bottomy = -1200-(pos.y-180);
        this.leftx = pos.x-350;
        this.rightx = pos.x+350;
        this.topy = pos.y+180;
        this.bottomy = pos.y-180;

        var ran = Math.floor((Math.random()*this.arrPos.length));
        this.num = this.arrPos[ran];
        if(this.num.x<this.leftx||this.num.x>this.rightx||this.num.y<this.bottomy|this.num.y>this.topy){
            this.arrPos.splice(ran-1,1);
            var enemypos = cc.v2(this.num.x,this.num.y);
            let name_string = this.ArrName[this.index];
            if(name_string.length>5){
                name_string = name_string.substr(0,5);
            }
            this.createEnemy(this.index,2,name_string,enemypos);
            this.index++;
        }
            // var y = Math.random()*(2400)-1200;
            // var x =null;
            // if(leftx>rightx){
            //     x = Math.random()*leftx+pos.x-350;
            // }else{
            //     x = Math.random()*rightx+pos.x+350;
            // }
            // var enemypos = cc.v2(x,y);
    },
    createOtherEnemypos: function (i,type,name,pos) {
        let enemy = cc.instantiate(this.enemyPrefab);
        enemy.position = pos;
        enemy.getComponent("EnemyPrefab").gameuuid = i;
        enemy.getComponent("EnemyPrefab").init(type,name);
        //enemy.parent = this.node; // 将生成的敌人加入节点树
        this.node.addChild(enemy);
    },
    createEnemy: function (i,type,name,pos) {
        if(pos.x>0){
            this.max_x = pos.x + 80;
            this.min_x = pos.x - 80;
        }else if(pos.x<0){
            this.max_x = pos.x - 80;
            this.min_x = pos.x + 80;
        }
        if(pos.y>0){
            this.max_y = pos.y + 220;
            this.min_y = pos.y - 220;
        }else if(pos.y<0){
            this.max_y = pos.y - 220;
            this.min_y = pos.y + 220;
        }
        let enemy = cc.instantiate(this.enemyPrefab);
        var x = Math.random()*(this.max_x - this.min_x) + (this.min_x);
        var y = Math.random()*(this.max_y - this.min_y) + (this.min_y);
        enemy.position = cc.v2(x,y);
        enemy.getComponent("EnemyPrefab").gameuuid = i;
        enemy.getComponent("EnemyPrefab").init(type,name);
        //enemy.parent = this.node; // 将生成的敌人加入节点树
        this.node.addChild(enemy);
    },
    update (dt) {
        if(this.isCreate){
            if(this.index<25){
                this.UpdateCreateEnemy();
            }else if(this.index>=25&&this.index<Global.enemynumber){
                this.DelayCreateEnemy();
            }
        }
    },
});
