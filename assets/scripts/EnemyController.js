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
        // this.map =  cc.find("Canvas/gamebg");
        this.arrPos = [{x:-1350,y:-900},{x:-1050,y:-900},{x:-750,y:-900},{x:-450,y:-900},{x:-150,y:-900},{x:150,y:-900},{x:450,y:-900},{x:750,y:-900},{x:1050,y:-900},{x:1350,y:-900},
            {x:-1350,y:-300},{x:-1050,y:-300},{x:-750,y:-300},{x:-450,y:-300},{x:450,y:-300},{x:750,y:-300},{x:1050,y:-300},{x:1350,y:-300},
            {x:-1350,y:300},{x:-1050,y:300},{x:-750,y:300},{x:-450,y:300},{x:450,y:300},{x:750,y:300},{x:1050,y:300},{x:1350,y:300},
            {x:-1350,y:900},{x:-1050,y:900},{x:-750,y:900},{x:-450,y:900},{x:-150,y:900},{x:150,y:900},{x:450,y:900},{x:750,y:900},{x:1050,y:900},{x:1350,y:900},
        ];
        Global.GetName(Global.enemynumber,(res)=>{
            if(res.state ==1){
                for(let i = 0; i < 25; i++){
                    let name_string = res.result[i];
                    if(name_string.length>5){
                        name_string = name_string.substr(0,5);
                    }
                    this.createEnemy(i,1,name_string,this.arrPos[i]);
                }
            }
        });
        this.scheduleOnce(function() {
            this.DelayCreateEnemy();
        },94);
    },
    DelayCreateEnemy(){
        var pos = cc.find("Canvas/player").position;
        //玩家的视野范围
        var leftx = -1500-(pos.x-350);
        var rightx = 1500-(pos.x+350);
        Global.GetName(Global.enemynumber,(res)=>{
            if(res.state ==1){
                for(let i = 25; i < Global.enemynumber; i++){
                    let name_string = res.result[i];
                    //let name_string = "hhhhhhhhhhhhhh";
                    if(name_string.length>5){
                        name_string = name_string.substr(0,5);
                    }
                    var y = Math.random()*(2400)-1200;
                    var x =null;
                    if(leftx>rightx){
                        x = Math.random()*leftx+pos.x-350;
                    }else{
                        x = Math.random()*rightx+pos.x+350;
                    }
                    var enemypos = cc.v2(x,y);
                    this.createOtherEnemypos(i,2,name_string,enemypos);
                }
            }
        });
    },
    createOtherEnemypos: function (i,type,name,pos) {
        let enemy = cc.instantiate(this.enemyPrefab);
        enemy.position = pos;
        enemy.getComponent("EnemyPrefab").gameuuid = i;
        enemy.getComponent("EnemyPrefab").init(type,name);
        //enemy.name = enemy.getComponent("EnemyManager").gameuuid;
        //enemy.parent = this.node; // 将生成的敌人加入节点树
        console.log("高级怪位置: "+pos);
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
        //enemy.name = enemy.getComponent("EnemyManager").gameuuid;
        //enemy.parent = this.node; // 将生成的敌人加入节点树
        this.node.addChild(enemy);
    },
    // update (dt) {},
});
