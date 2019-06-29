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
        trigger:{
            default:null,
            type:require("EnemyTrigger"),
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
        critImg:{
            default:null,
            type:cc.Node,
        },
        eff_addspeed:{
            default:null,
            type:cc.Node,
        },
        gameuuid:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;
        this.NodePool = cc.find("Canvas/gamebg").getComponent("GameItemManager");
        
        this.player = this.node.getChildByName("hero");
        this.playerdie = this.node.getChildByName("herodie");
        
        //-------------------------------------------
        this.curhp = 1600;
        this.maxhp = 1600;
        this.lv = 1;
        this.exp = 0;                   //当前所需经验值
        this.expnum = 0;                //当前经验值
        this.xishu = 6;                 //升级系数
        this.crit = 0.05;               //暴击率 5%~20%
        this.hit = 0.3;                 //命中率 30%~50%
        this.attack = 600;              //攻击力
        this.speed=70;                 //初始速度
        this.addspeed = 100;            //加速度
        this.killsnumber = 0;           //杀敌数
        this.isDun = false;             //是否有护盾
        this.is_chidu = false;          //是否吃毒
        this.cd = 3;                    //技能CD
        //---------------------------------------------
        //this.gameuuid=1;
        this.Herolv.string = this.lv;
        this.Heroexp.fillRange =0;
        this.Herohp.progress = this.curhp/this.maxhp;
        this.killername = null; 
        this.time = 3;
        this.chidutime=0;
    },

    start () {
        this.hero = cc.find("Canvas/player").getComponent("Player");
        this.stonepos = null;               //石头的位置
        this.map =  cc.find("Canvas/gamebg");
        this.player.getComponent(cc.Animation).play('heromove');
    },
    init(type){
        this.type = type;
        //1初级机器人 2高级机器人
        if(type==1){
            //初级机器人
            this.curhp = 1600;
            this.maxhp = 1600;
            this.lv = 1;
            this.exp = 0;                   //当前所需经验值
            this.expnum = 0;                //当前经验值
            this.xishu = 6;                 //升级系数
            this.crit = 0.05;               //暴击率 5%~20%
            this.hit = 0.3;                 //命中率 30%~50%
            this.attack = 600;              //攻击力
            this.speed=70;                 //初始速度
            this.addspeed = 100;            //加速度
            this.killsnumber = 0;           //杀敌数
            this.isDun = false;             //是否有护盾
            this.is_chidu = false;          //是否吃毒
            this.cd = 3;                    //技能CD
        }else{
            //高级机器人
            this.curhp = Global.hp;
            this.maxhp = Global.hp;
            this.lv = 1;
            this.exp = 0;                   //当前所需经验值
            this.expnum = 0;                //当前经验值
            this.xishu = 6;                 //升级系数
            this.crit = 0.5;                //暴击率 40%~60%
            this.hit = 0.7;                 //命中率 70%~90%
            this.attack = Global.attack;    //攻击力
            this.speed=80;                 //初始速度
            this.addspeed = 100;            //加速度
            this.killsnumber = 0;           //杀敌数
            this.isDun = false;             //是否有护盾
            this.is_chidu = false;          //是否吃毒
            this.cd = 2;                    //技能CD
        }
        
    },
    update (dt) {
        //如果吃毒
        if(this.is_chidu){
            if( this.chidutime==0){
                this.trigger.dir.x = -this.trigger.dir.x;
                this.trigger.dir.y = -this.trigger.dir.y;
                this.trigger.FangXiang();
                this.chidutime++;
            }
            if(this.time>0){
                this.time -=dt;
             }else{
                 this.HeroDamage(300);
                 this.time =3;
             }
        }
        if(this.trigger.dir.mag()<0.5){
            return;
        }
        if(this.curhp >0&&!Global.is_end){
            var vx = this.trigger.dir.x * this.speed;
            var vy = this.trigger.dir.y * this.speed;

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
            if(this.stonepos!=null){
                var top = cc.v2(this.stonepos.x-34,this.stonepos.y+30);
                var right = cc.v2(this.stonepos.x+34,this.stonepos.y-30);;
                var bottom = cc.v2(this.stonepos.x+34,this.stonepos.y+30);
                var left = cc.v2(this.stonepos.x-34,this.stonepos.y-30);
                var herowidth = this.node.width/2;
                var heroheight = this.node.height/2;
                if(this.node.x+sx+herowidth >top.x&&this.node.x+sx-herowidth<right.x&&this.node.y+sy-heroheight>right.y && this.node.y+sy-heroheight<top.y){
                    this.trigger.dir.x = -this.trigger.dir.x;
                    this.trigger.dir.y = -this.trigger.dir.y;
                    this.trigger.FangXiang();
                    return;
                }
                if(this.node.x+sx+herowidth >left.x&&this.node.x+sx-herowidth<bottom.x&&this.node.y+sy+heroheight>left.y && this.node.y+sy-heroheight<bottom.y){
                    this.trigger.dir.x = -this.trigger.dir.x;
                    this.trigger.dir.y = -this.trigger.dir.y;
                    this.trigger.FangXiang();
                    return;
                }
            }
            //移动
            this.node.x += sx;
            this.node.y += sy;
        }
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
    HeroLvUp(){
        this.lvUp.play('LvUp');
    },
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
                    //this.behit = false;
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
    ShowBoomImg(){
        this.critImg.active = true;
        this.scheduleOnce(function() {
            this.critImg.active = false;
        }, 1);
    },
    HeroDead(){
        if(this.curhp <=0){
            //死亡动画
            this.node.getChildByName("trigger").active=false;
            Global.dienumber += 1;
            this.player.active = false;
            this.playerdie.active = true;
            this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeOut(1.0), cc.callFunc(()=>{
                //this.enemyPool.onEnemyKilled(this.node);
                this.node.destroy();
                this.DropItem();
            },this)));
            if(this.killername != null){
                if(this.killername == this.hero.Heroname.string){
                    this.hero.killsnumber +=1;
                }
            }
            cc.game.emit('change',Global.dienumber);
        }
    },
    //掉落装备
    DropItem(){
        var gemnum = Math.round(Math.random()*6) +6;
        for(var i=0;i<gemnum;i++){
            this.CreateGem();
        }
        
        this.CreateItem();

    },
    //随机生成宝石
    CreateGem(){
        //从对象池里面取
        let item = null;
        if (this.NodePool.GemPool.size() > 0) { 
            item = this.NodePool.GemPool.get();
        } else { 
            item = cc.instantiate(this.NodePool.gemPrefab[Math.round(Math.random()*4)]);
        }
        item.position = this.node.position;
        //item.parent = cc.find("Canvas/GameController");
        cc.find("Canvas/gamebg").addChild(item);
        let radian  = cc.misc.degreesToRadians(Math.round(Math.random()*360));
        let comVec = cc.v2(0, 1);// 一个向上的对比向量
        let dirVec = comVec.rotate(-radian);
        cc.tween(item)
        .to(1, { position: cc.v2(this.node.x+dirVec.x*80,this.node.y+dirVec.y*80) })
        .start()
    },
    //随机生成道具
    CreateItem(){
        //从对象池里面取
        let item = null;
        if (this.NodePool.ItemPool.size() > 0) { 
            item = this.NodePool.ItemPool.get();
        } else { 
            item = cc.instantiate(this.NodePool.ItemPrefab[Math.round(Math.random()*2)]);
        }
        item.position = this.node.position;
        cc.find("Canvas/gamebg").addChild(item);
        let radian  = cc.misc.degreesToRadians(Math.round(Math.random()*360));
        let comVec = cc.v2(0, 1);// 一个向上的对比向量
        let dirVec = comVec.rotate(-radian);
        cc.tween(item)
        .to(1, { position: cc.v2(item.x+dirVec.x*80,item.y+dirVec.y*80)})
        .start()
    },
});
