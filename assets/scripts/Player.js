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
        // lvUp: {
        //     default: null,
        //     type: cc.Node,
        // },
        // gameuuid:"-1",
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;

        // //定义玩家信息
        this.curhp = Global.hp;
        this.maxhp = Global.hp;
        this.lv = 1;
        this.exp = 0;                   //当前所需经验值
        this.expnum = 0;                //当前经验值
        this.xishu = 6;                 //升级系数
        this.crit = 0.01;               //暴击率
        this.attack = Global.attack;    //攻击力
        this.speed=300;                 //初始速度
        this.addspeed = 100;            //加速度
        this.killsnumber = 0;
        // this.isDun = false;         //是否有护盾
        // this.is_chidu = false;      //是否吃毒
        // this.behit = false;         //是否被攻击（被攻击是不能移动）
        // this.wudi = false;          //是否无敌
        // this.time = 3;
        // this.killername = null;     //杀我的人

        this.Herolv.string = this.lv;
        this.Heroexp.fillRange =0;
        this.Herohp.progress = this.curhp/this.maxhp;
        // //this.Heroname.string = Global.name;

        //需要旋转的人物图形
        this.hero = this.node.getChildByName("hero");

        this.NodePool = cc.find("Canvas/gamebg").getComponent("GameItemManager");
        this.stonepos = null;       //石头的位置
    },

     update (dt) {
        //如果吃毒
        // if(this.is_chidu){
        //     if(this.time>0){
        //         this.time -=dt;
        //      }else{
        //          this.HeroDamage();
        //          this.time =3;
        //      }
        // }

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
        
            //方向计算
            var r = Math.atan2(this.Rocker.dir.y,this.Rocker.dir.x);
            var degree = r * 180/(Math.PI);
            degree = 360 - degree + 90;
            this.hero.rotation = degree;
            
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
                    this.curhp +=1;
                    this.Herohp.progress = this.curhp/this.maxhp;
                    this.player.getChildByName("addHp").getComponent(cc.Animation).play('AddHp');
                }
            }else if(other.node.name == "item_xiePrefab"){
                this.NodePool.onItemKilled(other.node);
                this.speed += this.addspeed;
                this.scheduleOnce(function() {
                    this.speed -= this.addspeed;;
                }, 3);
            }else if(other.node.name == "item_stonePrefab"){
                // 石头------------------------------------------------------------
                //玩家不能穿过
                this.stonepos = other.node.position;
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
                        this.curhp +=300;
                        this.Herohp.progress = this.curhp/this.maxhp;
                    }
                    //this.HeroLvUp();
                }
                this.Herolv.string = this.lv;
                this.Heroexp.fillRange = this.expnum /this.exp*-1;
            }
        }
    },
    onCollisionExit: function (other, self) {
        if(other.node.name == "item_stonePrefab"){
            this.stonepos = null;
        }
    },
    // HeroDead(){
    //     if(this.curhp <=0&&Global.is_end ==false){
    //         //跳出结算界面
    //         Global.is_end = true;
    //         cc.find("Canvas/GameOverView").active = true;
    //     }
    // },
    // //攻击
    // HeroAttack(){
    //     
    //     if(this.Rocker.is_Cd){

    //     }
    // },
    // AddDun(){
    //     if(!this.isDun){
    //         this.isDun = true;
    //         this.player.getChildByName("dun").active = true;
    //     }
    // },
    // //受伤
    // HeroDamage(){
    //     if(!this.wudi){
    //         if(this.isDun){
    //             this.player.getChildByName("dun").active = false;
    //             this.isDun = false;
    //         }else{
    //             if(this.is_chidu){
    //                 this.curhp -=1;
    //                 this.Herohp.progress = this.curhp/this.maxhp;
    //             }else{
    //                 this.curhp -=1;
    //                 this.Herohp.progress = this.curhp/this.maxhp;
    //                 //实现闪烁效果。播放眩晕动画
    //                 this.player.getChildByName("yun").getComponent(cc.Animation).play('yun').repeatCount =10;
    //                 //闪烁
    //                 this.node.runAction(cc.blink(3, 3));
    //                 //被击中状态不能进行移动等操作（机器人也不能动）
    //                 this.behit = true;
    //                 //晕2秒不能移动
    //                 this.scheduleOnce(function() {
    //                     this.behit = false;
    //                     this.wudi = true;
    //                     this.player.opacity = 0;
    //                 }, 2);
    //                 //晕玩之后无敌3秒
    //                 this.scheduleOnce(function() {
    //                     this.wudi = false;
    //                     this.player.opacity = 255;
    //                 }, 5);
    //             }   
    //             this.HeroDead();
    //         }

    //     }
    // },
    // HeroLvUp(){
    //     this.lvUp.active = true;
    //     this.Herolv.string = this.lv;
    //     this.Rocker.skillCd -=0.18;
    //     this.lvUp.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeOut(1.0), cc.callFunc(()=>{
    //         this.lvUp.opacity = 255;
    //         this.lvUp.active = false;
    //     },this)));
    // },
});
