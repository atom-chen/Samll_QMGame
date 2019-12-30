// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

import ExpDiamond from './ExpDiamond';
import GameControl from './GameControl';
import BulletAciton from './BulletAction';
import BattleItem from './BattleItem';
import SpikeAction from './SpikeAction';
import FistAction from './FistAction';

@ccclass
export default class HeroBase extends cc.Component {

    @property(cc.Node)
    nodeFirePos: cc.Node = null;

    @property(cc.Node)
    controlNode:cc.Node = null;
    @property(cc.Node)
    NodeLine:cc.Node = null;

    @property(cc.Sprite)
    Heroexp:cc.Sprite = null;

    @property(cc.ProgressBar)
    Herohp:cc.ProgressBar = null;

    @property(cc.BoxCollider)
    heroCollider: cc.BoxCollider = null;

    @property(cc.Node)
    effectFast: cc.Node = null;
    // 用来标记 动作
    fastFlag: number = 3;

    @property(cc.Node)
    effectHudun: cc.Node = null;
    hudunFlag: number = 4;

    @property(cc.Node)
    nodeAlive :cc.Node = null;

    @property(cc.Node)
    nodeDead: cc.Node = null;

    @property(cc.Label)
    labelName: cc.Label = null;

    @property(cc.Label)
    Herolv: cc.Label = null;

    @property(cc.Animation)
    addhp:cc.Animation = null;

    @property(cc.Animation)
    lvUp:cc.Animation = null;

    @property(cc.Node)
    critImg: cc.Node = null;
    @property(cc.Prefab)
    killtips:cc.Prefab =null;

    //英雄类型id 不同的英雄不能的技能,动画等
    public HeroTypeID:number =1;    
    // 属性一致的情况下，可以将属性值，放到这里
    public Speed: number = 200;
    //速度系数 有些技能释放的时候回减速
    public Cspeed:number = 1;
    public score:number = 0;                            //分数
    public killnum:number =0;                           //杀敌数

    public IsDead: boolean = false;

    public user_name: string = "";
    // enum Status{run, gui};
    gameWorld: GameControl = null;

    public HeroShenFenID: number = 0;

    public sDead = 2;
    public sAlive = 1;
    public sStatus = this.sAlive;

    //通用属性
    public lv: number = 1;
    public xishu: number = 2;
    public exp: number = 6;                             //升级所需经验值
    public expnum: number=0;                            //当前经验值
    public curhp: number = 0;//Global.hp;            //当前血量
    public maxhp: number = 0;//Global.hp;            //最大值血量
    public crit: number = 0.1;//0.1+Global.Crit/100;    //暴击率
    public critmax:number = 0.5;                        //暴击率上限
    public attack:number = 600;//Global.attack;         //攻击力
    public hit:number = 0.3;                            //命中率
    public evade:number = 0;                            //闪避率
    public cd_time:number = 0;
    //是否隐身
    public invisible:boolean = false;
    public invisibleNum:number = 1;
    public invisibeltime:number = 3;

    // 可以扩展变量，增加幽灵状态下的速度和正常速度，以及加速时候速度
    // public speedFast :number = 300

    onLoad() {
        this.gameWorld = cc.find("Canvas/gameworld").getComponent('GameControl') as GameControl;
    }

    start() {
        this.labelName.string = this.user_name;
        this.schedule(function() {
            //TODO 游戏结束是停止
            if(this.isAlive()){
                this.score ++;
            }
        }, 1);
    }

    // 死亡
    onDead() {
        // this.Speed = 50;
        this.IsDead = false;
        this.heroCollider.enabled = false;
        this.sStatus = this.sDead;
        this.controlNode.angle = 0;
        if (this.nodeAlive)
            this.nodeAlive.active= false;
        if (this.nodeDead)
            this.nodeDead.active = true;

        this.node.stopActionByTag(this.fastFlag);
        this.node.stopActionByTag(this.hudunFlag);
        this.effectFast.active = false;
        this.effectHudun.active = false;

        // 假设再5s后复活
        this.node.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(function(){
            this.onAlive();
        },this)));
    }

    //复活
    onAlive() {
        if(this.HeroTypeID == 3){
            this.controlNode.scale = 1;
            this.evade = 0;
            this.heroCollider.size.width = 42;
            this.heroCollider.size.width = 61;
        }
        this.heroCollider.enabled = true;
        this.curhp = this.maxhp;
        this.Herohp.progress = this.curhp/this.maxhp;
        //this.Speed = 50;
        this.IsDead = true;
        this.sStatus = this.sAlive;

        if (this.nodeAlive)
            this.nodeAlive.active= true;
        if (this.nodeDead)
            this.nodeDead.active = false;
    }

    isAlive(): boolean {
        return this.sAlive == this.sStatus;
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (this.isAlive() == false)
        return;
        if (other.node.group == "gem") {
            //获得经验钻石
            //根据钻石的属性进行经验加成
            let exp = other.node.getComponent("ExpDiamond") as ExpDiamond;
            if (exp) {
                //增加对应的经验
                this.expnum +=1;
                this.exp = this.xishu*(this.lv*(this.lv+1)/2);
                if(this.expnum>=this.exp){
                    this.lv +=1;
                    this.expnum =0;
                    if(this.crit<0.65){
                        this.crit += 0.05;
                    }
                    this.HeroLvUp();
                }
                this.Herolv.string = this.lv.toString();
                this.Heroexp.fillRange = this.expnum /this.exp*-1;
                //删除节点， 可以播放特效
                other.node.destroy();
            }

        }else if (other.node.group == "bullet") {
            //子弹被击
            let bullet = other.node.getComponent("BulletAction") as BulletAciton;
            if (bullet) {
                //是否是自己的子弹
                if (bullet.bellow == this.HeroShenFenID)
                    return;
                // 根据属性，计算子弹伤害
                // 根据自身情况 减少血量，或者死亡
                // 获取子弹拥有者
                let bullet_holder = bullet.holder.getComponent(HeroBase);
                // 是否命中
                var ranhit = Math.random();
                if(ranhit<=Math.abs(bullet.hit - this.evade)){
                    let addscore = 0;
                    other.node.stopAllActions();
                    other.node.getComponent(cc.Animation).play("bullet");
                    if (this.effectHudun.active) {
                        this.effectHudun.active = false;
                    }else{
                        //暴击率
                        var rancrit = Math.random();
                        if(rancrit<= bullet.crit){
                            this.ShowBoomImg();
                            addscore = 20;
                            this.curhp = this.curhp - bullet.attack*2;
                            //受到暴击触发特殊技能
                            if(this.HeroTypeID == 2){
                                var invRan = Math.random();
                                if(invRan<=this.invisibleNum){
                                    this.SpecialSkill();
                                }
                            }
                        }else{
                            addscore = 10;
                            this.curhp -= bullet.attack;
                        }
                        
                        if(this.curhp >0){
                            this.Herohp.progress = this.curhp/this.maxhp;
                            if(this.curhp <= this.maxhp*0.1 && this.HeroTypeID == 3){
                                this.ChangeSmallSkill();
                            }
                        }else{
                            addscore = 100;
                            this.Herohp.progress =0;
                            bullet_holder.killnum ++;
                            this.SHowKillNum(bullet_holder.killnum,bullet_holder);
                            this.onDead();
                        }
                    }
                    //获取攻击者 并给他加分
                    bullet_holder.score += addscore;
                }
                // other.node.destroy();
            }
        }else if(other.node.group == "spike"){
            //突刺被击
            let spike = other.node.getComponent("SpikeAction") as SpikeAction;
            if (spike&&spike.IsUserSkill) {
                //是否是自己的子弹
                if (spike.bellow == this.HeroShenFenID)
                    return;
                let spike_holder = spike.holder.getComponent(HeroBase);
                var ranhit = Math.random();
                if(ranhit<= Math.abs(spike.hit - this.evade)){
                    let addscore = 0;
                    // other.node.stopAllActions();
                    // other.node.getComponent(cc.Animation).play("bullet");
                    if (this.effectHudun.active) {
                        this.effectHudun.active = false;
                    }else{
                        //暴击率
                        var rancrit = Math.random();
                        if(rancrit<= spike.crit){
                            this.ShowBoomImg();
                            addscore = 20;
                            this.curhp = this.curhp - spike.attack*2;
                            //受到暴击触发特殊技能 可以播放特效什么的
                            if(this.HeroTypeID == 2){
                                var invRan = Math.random();
                                if(invRan<=this.invisibleNum){
                                    this.SpecialSkill();
                                }
                            }
                        }else{
                            addscore = 10;
                            this.curhp -= spike.attack;
                        }
                        
                        if(this.curhp >0){
                            this.Herohp.progress = this.curhp/this.maxhp;
                            if(this.curhp <= this.maxhp*0.1 && this.HeroTypeID == 3){
                                this.ChangeSmallSkill();
                            }
                        }else{
                            addscore = 100;
                            this.Herohp.progress =0;
                            spike_holder.killnum ++;
                            this.SHowKillNum(spike_holder.killnum,spike_holder);
                            this.onDead();
                        }
                    }
                    //获取攻击者 并给他加分
                    spike.holder.getComponent(HeroBase).score += addscore;
                }
            }
        }else if (other.node.group == "fist") {
            //子弹被击
            let fist = other.node.getComponent("FistAction") as FistAction;
            if (fist) {
                //是否是自己的子弹
                if (fist.bellow == this.HeroShenFenID)
                    return;
                // 根据属性，计算子弹伤害
                // 根据自身情况 减少血量，或者死亡
                // 获取子弹拥有者
                let fist_holder = fist.holder.getComponent(HeroBase);
                // 是否命中
                var ranhit = Math.random();
                if(ranhit<= Math.abs(fist.hit - this.evade)){
                    let addscore = 0;
                    if (this.effectHudun.active) {
                        this.effectHudun.active = false;
                    }else{
                        //暴击率
                        var rancrit = Math.random();
                        if(rancrit<= fist.crit){
                            this.ShowBoomImg();
                            addscore = 20;
                            this.curhp = this.curhp - fist.attack*2;
                            //受到暴击触发特殊技能
                            if(this.HeroTypeID == 2){
                                var invRan = Math.random();
                                if(invRan<=this.invisibleNum){
                                    this.SpecialSkill();
                                }
                            }
                        }else{
                            addscore = 10;
                            this.curhp -= fist.attack;
                        }
                        
                        if(this.curhp >0){
                            this.Herohp.progress = this.curhp/this.maxhp;
                            if(this.curhp <= this.maxhp*0.1 && this.HeroTypeID == 3){
                                this.ChangeSmallSkill();
                            }
                        }else{
                            addscore = 100;
                            this.Herohp.progress =0;
                            fist_holder.killnum ++;
                            this.SHowKillNum(fist_holder.killnum,fist_holder);
                            this.onDead();
                        }
                    }
                    //获取攻击者 并给他加分
                    fist_holder.score += addscore;
                }
                // other.node.destroy();
            }
        }
        else if (other.node.group == "item") {
            let item = other.node.getComponent("BattleItem") as BattleItem;
            if (item) {
                switch (item.itemID) {
                    case 1: 
                        // 护盾可能不是状态，可能是属性加成
                        if (this.effectHudun.active) {
                            // 已经存在，需要将对应的动作删除
                            this.node.stopActionByTag(this.fastFlag);
                        }
                        else {
                            this.effectHudun.active = true;
                        }
                        break;
                    case 2:
                        // 补血
                        if(this.curhp < this.maxhp){
                            let add_hp = this.maxhp *0.1;
                            if(this.curhp +add_hp>this.maxhp){
                                this.curhp =this.maxhp;
                            }else{
                                this.curhp +=add_hp;
                            }
                            this.Herohp.progress = this.curhp/this.maxhp;
                            this.addhp.play('AddHp');
                        }
                        break;
                    case 3:
                        //急速 假设加速时间是10s
                        if (this.effectFast.active) {
                            // 已经存在，需要将对应的动作删除
                            this.node.stopActionByTag(this.fastFlag);
                            
                        }
                        else {
                            this.effectFast.active = true;
                            let temp = this.Speed;
                            this.Speed = temp * 1.5;
                            let ani = this.effectFast.getComponent(cc.Animation);
                            ani.play("speed");
                            let act = this.node.runAction(cc.sequence(cc.delayTime(10.0), cc.callFunc(function () {
                                if (this.effectFast) {
                                    this.effectFast.active = false;
                                    this.Speed = temp;
                                }
                            }, this)));
                            act.setTag(this.fastFlag);
                        }
                        break;
                }
                other.node.destroy();
            }
        }
    }

    /**发射子弹*/ 
    onFire() {
        let fire_screen = this.nodeFirePos.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let node_pos = this.gameWorld.node.convertToNodeSpaceAR(fire_screen);
        this.gameWorld.createBullet(node_pos, this.nodeFirePos.angle, this.HeroShenFenID,this.attack,this.hit,this.crit,this.node);
    }
    /**发动突刺*/
    onSpike(){
        this.node.opacity = 255;
        this.invisible = true;
        let srp = this.controlNode.getChildByName("gun").getComponent(SpikeAction);
        if(srp){
            srp.IsUserSkill = true;
            srp.bellow = this.HeroShenFenID;
            srp.attack = this.attack;
            srp.hit = this.hit;
            srp.crit = this.crit;
            srp.holder = this.node;
        }
        this.scheduleOnce(function() {
            srp.IsUserSkill = false;
        }, 0.2);
    }
    /**发射拳头 */
    onAttack(){
        this.schedule(()=>{
            let fire_screen = this.nodeFirePos.convertToWorldSpaceAR(cc.Vec2.ZERO);
            let node_pos = this.gameWorld.node.convertToNodeSpaceAR(fire_screen);
            this.gameWorld.createFist(node_pos, this.nodeFirePos.angle, this.HeroShenFenID,this.attack,this.hit,this.crit,this.node);
        },0.1,3)
    }
    HeroLvUp(){
        this.lvUp.play('LvUp');
    }
    ShowBoomImg(){
        this.critImg.active = true;
        this.scheduleOnce(function() {
            this.critImg.active = false;
        }, 1);
    }
    SHowKillNum(killnum:number,holder){
        let text = "";
        switch(killnum){
            case 1:
                text = "拿到第一滴血";
                holder.ShowTip(text);
                break;
            case 3:
                text = "正在大杀特杀";
                holder.ShowTip(text);
                break;
            case 6:
                text = "已势不可挡";
                holder.ShowTip(text);
                break;
        }
        if(killnum>=10){
            text = "已成为神了";
            holder.ShowTip(text);
        }
    }
    ShowTip(text:string){
        let tip = cc.instantiate(this.killtips);
        if (tip) {
            this.node.addChild(tip);
            let src = tip.getComponent("TipShow");
            if (src) {
                src.label.string = text;
            }
        }
    }
    //隐身的被动技能
    SpecialSkill(){
        if(this.HeroShenFenID == 99){
            this.node.opacity = 150;
        }else{
            this.node.opacity = 0;
        }
        this.invisible = true;
    }
    //变小的被动技能
    ChangeSmallSkill(){
        this.controlNode.scale = 0.5;
        this.evade = 0.1;
        this.heroCollider.size.width = 21;
        this.heroCollider.size.width = 30;
    }
    update(dt){
        if(this.invisible){
            if(this.invisibeltime>0){
                this.invisibeltime-=dt;
            }else{
                this.invisible =false;
                this.node.opacity = 255;
                this.invisibeltime=3;
            }
        }
    }
}
