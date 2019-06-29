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
        Rocker:{
            default:null,
            type:require("Rocker"),
        },
        map:{
            default:null,
            type:cc.Node,
        },
        Heroexp:{
            default:null,
            type:cc.Sprite,
        },
        Herolv:{
            default:null,
            type:cc.Label,
        },
        Heroname:{
            default:null,
            type:cc.Label,
        },
        Herohp: {
            default: null,
            type: cc.ProgressBar,
        },
        lvUp:{
            default:null,
            type:cc.Animation,
        },
        addhp:{
            default:null,
            type:cc.Animation,
        },
        eff_addspeed:{
            default:null,
            type:cc.Node,
        },
        critImg:{
            default:null,
            type:cc.Node,
        },
        // lvUp: {
        //     default: null,
        //     type: cc.Node,
        // },
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;
        this.gameuuid=-1,
        // //定义玩家信息
        this.curhp = Global.hp;
        this.maxhp = Global.hp;
        this.lv = 1;
        this.exp = 0;                   //当前所需经验值
        this.expnum = 0;                //当前经验值
        this.xishu = 6;                 //升级系数
        this.crit = 0.1;               //暴击率
        this.attack = Global.attack;    //攻击力
        this.speed=100;                 //初始速度
        this.addspeed = 100;            //加速度
        this.killsnumber = 0;
        this.isDun = false;         //是否有护盾
        this.is_chidu = false;      //是否吃毒
        this.behit = false;         //是否被攻击（被攻击是不能移动）
        this.wudi = false;          //是否无敌
        this.time = 3;
        this.killername = null;     //杀我的人

        this.Herolv.string = this.lv;
        this.Heroexp.fillRange =0;
        this.Herohp.progress = this.curhp/this.maxhp;
        if (CC_WECHATGAME) {
            this.Heroname.string = Global.name;
        }

        this.player = this.node.getChildByName("hero");
        this.NodePool = cc.find("Canvas/gamebg").getComponent("GameItemManager");
        this.stonepos = null;       //石头的位置

        cc.game.on('useskill',function (type){
            if(type==1){
                this.speed = this.speed*0.6;
            }else{
                this.speed = 100;
            }
       },this);
       //初始化
       cc.game.emit('change',0);
       
       
    },

     update (dt) {
        //如果吃毒
        if(this.is_chidu){
            if(this.time>0){
                this.time -=dt;
             }else{
                 this.HeroDamage(300);
                 this.time =3;
             }
        }

        if(this.Rocker.dir.mag()<0.5){
            return;
        }
        // if(!this.behit){
            var vx = this.Rocker.dir.x * this.speed;
            var vy = this.Rocker.dir.y * this.speed;

            var sx = vx * dt;
            var sy = vy * dt;
            //人物移动不能超过地图边界
            if(this.node.x<0 && Math.abs(this.node.x + sx-this.node.width/2)>=(this.map.width/2)){
                return;
            }else if(this.node.x>0 && Math.abs(this.node.x + sx+this.node.width/2)>=(this.map.width/2)){
                return;
            }else if(this.node.y>0 && Math.abs(this.node.y + sy+this.node.height/2)>=(this.map.height/2)){
                return;
            }else if(this.node.y<0 && Math.abs(this.node.y + sy-this.node.height/2)>=(this.map.height/2)){
                return;
            }
            //this.stonepos = cc.v2(80,0);
            if(this.stonepos!=null){
                var top = cc.v2(this.stonepos.x-34,this.stonepos.y+30);
                var right = cc.v2(this.stonepos.x+34,this.stonepos.y-30);;
                var bottom = cc.v2(this.stonepos.x+34,this.stonepos.y+30);
                var left = cc.v2(this.stonepos.x-34,this.stonepos.y-30);
                var herowidth = this.node.width/2;
                var heroheight = this.node.height/2;
                if(this.node.x+sx+herowidth >top.x&&this.node.x+sx-herowidth<right.x&&this.node.y+sy-heroheight>right.y && this.node.y+sy-heroheight<top.y){
                    return;
                }
                if(this.node.x+sx+herowidth >left.x&&this.node.x+sx-herowidth<bottom.x&&this.node.y+sy+heroheight>left.y && this.node.y+sy-heroheight<bottom.y){
                    return;
                }
            }
            //移动
            this.node.x += sx;
            this.node.y += sy;
        
            
            
        //}  
     },
     onCollisionEnter: function (other, self) {
        //判断碰撞的类型
        if(other.node.group == "gem"){
            // 道具-----------------------------------------------------------
            if(other.node.name == "item_dunPrefab"){
                this.NodePool.onItemKilled(other.node);
                this.AddDun();
            }else if(other.node.name == "item_hpPrefab"){
                this.NodePool.onItemKilled(other.node);
                if(this.curhp < this.maxhp){
                    if(this.curhp +100>this.maxhp){
                        this.curhp =this.maxhp;
                    }else{
                        this.curhp +=100;
                    }
                    this.Herohp.progress = this.curhp/this.maxhp;
                    this.addhp.play('AddHp');
                }
            }else if(other.node.name == "item_xiePrefab"){
                this.NodePool.onItemKilled(other.node);
                this.speed += this.addspeed;
                this.eff_addspeed.getComponent(cc.Animation).play("speed");
                this.scheduleOnce(function() {
                    this.speed -= this.addspeed;
                    this.eff_addspeed.getComponent(cc.Animation).stop("speed");
                    this.eff_addspeed.getComponent(cc.Sprite).spriteFrame = null;
                }, 3);
            }else if(other.node.name == "item_stonePrefab"){
                // 石头------------------------------------------------------------
                
                this.stonepos = other.node.position;
            }else if(other.node.name == "item_grassPrefab"){
                // 草------------------------------------------------------------
                this.node.opacity = 127.5;
            }else{
                // 宝珠------------------------------------------------------------ 
                //other.node.destroy();
                this.NodePool.onGemKilled(other.node);
                this.expnum +=1;
                this.exp = this.xishu*(this.lv*(this.lv+1)/2);
                if(this.expnum>=this.exp){
                    this.lv +=1;
                    this.expnum =0;
                    this.crit += 0.04;
                    if(this.curhp < this.maxhp){
                        if(this.curhp +100>this.maxhp){
                            this.curhp =this.maxhp;
                        }else{
                            this.curhp +=100;
                        }
                        this.Herohp.progress = this.curhp/this.maxhp;
                        this.addhp.play('AddHp');
                    }
                    this.HeroLvUp();
                }
                this.Herolv.string = this.lv;
                this.Heroexp.fillRange = this.expnum /this.exp*-1;
            }
        }
    },
    onCollisionExit: function (other, self) {
        if(other.node.name == "item_stonePrefab"){
            this.stonepos = null;
        }else if(other.node.name == "item_grassPrefab"){
            this.node.opacity = 255;
        }
    },
    HeroDead(){
        if(this.curhp <=0&&Global.is_end ==false){
            //跳出结算界面
            Global.is_end = true;
            cc.find("Canvas/GameOverView").active = true;
        }
    },
    // //攻击
    // HeroAttack(){
    //     
    //     if(this.Rocker.is_Cd){

    //     }
    // },
    AddDun(){
        if(!this.isDun){
            this.isDun = true;
            this.node.getChildByName("dun").active = true;
        }
    },
    //受伤
    HeroDamage(damage){
        if(!this.wudi){
            if(this.isDun){
                this.node.getChildByName("dun").active = false;
                this.isDun = false;
            }else{
                if(this.is_chidu){
                    this.curhp -=damage;
                    this.Herohp.progress = this.curhp/this.maxhp;
                }else{
                    this.curhp -=damage;
                    this.Herohp.progress = this.curhp/this.maxhp;
                    // //实现闪烁效果。播放眩晕动画
                    // this.player.getChildByName("yun").getComponent(cc.Animation).play('yun').repeatCount =10;
                    // //闪烁
                    // this.node.runAction(cc.blink(3, 3));
                    //被击中状态不能进行移动等操作（机器人也不能动）
                    this.behit = false;
                    ////晕2秒不能移动
                    // this.scheduleOnce(function() {
                    //     this.behit = false;
                    //     this.wudi = true;
                    //     this.player.opacity = 0;
                    // }, 2);
                    // //晕玩之后无敌3秒
                    // this.scheduleOnce(function() {
                    //     this.wudi = false;
                    //     this.player.opacity = 255;
                    // }, 5);
                }   
                this.HeroDead();
            }

        }
    },
    HeroLvUp(){
        this.lvUp.play('LvUp');
    },
    ShowBoomImg(){
        this.critImg.active = true;
        this.scheduleOnce(function() {
            this.critImg.active = false;
        }, 1);
    }
});
