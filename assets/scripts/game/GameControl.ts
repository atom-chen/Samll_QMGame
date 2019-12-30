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

import HeroControl from "./HeroControl";
import StickControl from "./StickControl";
import SkillControl from "./SkillControl";
import CameraFollow from "./CameraFllow";
import GameRes from "./GameRes";
import ExpDiamond from './ExpDiamond';
import HeroBase from "./HeroBase";
import BulletAction from "./BulletAction";
import BattleItem from "./BattleItem";
import FistAction from "./FistAction";


@ccclass
export default class GameControl extends cc.Component {

    @property(StickControl)
    control: StickControl = null;

    @property(SkillControl)
    skillcontrol: SkillControl = null;

    @property(cc.Node)
    camera: cc.Node = null;

    @property(CameraFollow)
    camera_follow: CameraFollow = null;

    @property(GameRes)
    gameRes: GameRes = null;

    @property(cc.Node)
    nodeItems: cc.Node = null;

    @property(cc.Node)
    nodePlayers: cc.Node = null;

    @property(cc.Node)
    nodeBullets: cc.Node = null;
    
    @property(cc.Label)
    labelscore: cc.Label[] = [];

    @property(cc.Label)
    labelname: cc.Label[] = [];
    
    @property(cc.Label)
    labelTime: cc.Label = null;

    walkRect: cc.Rect = null;
    obsRect:cc.Rect = null;
    worldNode: cc.Node = null;

    public heroScript: HeroBase = null;
    public heroNode: cc.Node = null;
    public isGameOver:boolean = false;
    public timeOver:number = 210;

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    }

    onDestroy() {
        // cc.director.getCollisionManager().enabledDebugDraw = false;
        cc.director.getCollisionManager().enabled = false;
    }
    //倒计时
    doCountdownTime(){
        //每秒更新显示信息
        if (this.timeOver > 0 ) {
            this.timeOver -= 1;
            var minute = Math.floor(this.timeOver/60);
            var second = this.timeOver%60;
            var str_second = second < 10 ? ('0' + second) : second;
            this.labelTime.string = minute+":"+str_second;
            this.countDownShow(this.timeOver);
        }
    }
    countDownShow(temp){
        if(temp<=0){
            this.unschedule(this.doCountdownTime);
        }
    }
    start() {
        this.schedule(this.doCountdownTime,1);

        this.worldNode = cc.find("Canvas/gameworld") as cc.Node;

        let walkNode = cc.find("Canvas/gameworld/bg_login/rectwalk") as cc.Node;
        let sz = walkNode.getContentSize();
        this.walkRect = new cc.Rect(-sz.width / 2, -sz.height / 2, sz.width, sz.height);
        // 创建hero 控制

        this.heroNode = cc.instantiate(this.gameRes.heroPrefab[0]) as cc.Node;
        this.nodePlayers.addChild(this.heroNode, 0, "control");
        // 使用Global 保存自己用户信息，在这里赋值给游戏角色。
        this.heroScript = this.heroNode.getComponent("HeroBase") as HeroBase;
        this.heroScript.HeroShenFenID = 99;
        this.heroScript.HeroTypeID = 3;
        this.heroScript.user_name = Global.name;

        // 创建robot 玩玩

        for (let i = 0; i < 15; i++) {
            let robot1 = cc.instantiate(this.gameRes.robotPrefab) as cc.Node;
            this.nodePlayers.addChild(robot1);

            let script = robot1.getComponent("HeroBase") as HeroBase;
            script.HeroShenFenID = i + 1;
            script.user_name = "机器人"+script.HeroShenFenID+"号";

        }
        //创建一部分钻石

        for (let i = 0; i < 200; i++) {
            let diamond = cc.instantiate(this.gameRes.diamondPrefab);
            if (diamond) {
                let exp = diamond.getComponent("ExpDiamond") as ExpDiamond;
                if (exp) {
                    exp.diamondID = Math.floor(Math.random() * 4) + 1;
                }

                diamond.position = new cc.Vec2(Math.random() * this.walkRect.width + this.walkRect.xMin, Math.random() * this.walkRect.height + this.walkRect.yMin);

                this.nodeItems.addChild(diamond);
            }
        }

        // 创建一部分道具
        for (let i = 0; i < 20; i++) {
            let item = cc.instantiate(this.gameRes.itemPrefab);
            if (item) {
                let itemScript = item.getComponent("BattleItem") as BattleItem;
                if (itemScript)
                    itemScript.itemID = Math.floor(Math.random() * 3) + 1;

                item.position = new cc.Vec2(Math.random() * this.walkRect.width + this.walkRect.xMin, Math.random() * this.walkRect.height + this.walkRect.yMin);

                this.nodeItems.addChild(item);
            }
        }

        if (this.camera && this.heroNode) {
            this.camera_follow.followNode = this.heroNode;
            // this.camera.position = this.heroNode.position;
        }
        this.schedule(this.RealTimeRank,1);
    }

    // 传递子弹生成的位置 旋转角度，之后再添加who，攻击等属性值
    createBullet(position: cc.Vec2, angle: number, bellowID: number,attack:number,hit:number,crit:number,holder:cc.Node) {
        if (this.gameRes.bulletPrefab) {
            let bullet = cc.instantiate(this.gameRes.bulletPrefab);
            bullet.position = position;
            bullet.angle = angle;
            this.nodeBullets.addChild(bullet);

            let srp = bullet.getComponent("BulletAction") as BulletAction;
            if (srp)
                srp.bellow = bellowID;
                srp.attack = attack;
                srp.hit = hit;
                srp.crit = crit;
                srp.holder = holder;
        }
    }
    // 传递子弹生成的位置 旋转角度，之后再添加who，攻击等属性值
    createFist(position: cc.Vec2, angle: number, bellowID: number,attack:number,hit:number,crit:number,holder:cc.Node) {
        if (this.gameRes.FistPrefab) {
            let fist = cc.instantiate(this.gameRes.FistPrefab);
            fist.position = position;
            fist.angle = angle;
            this.nodeBullets.addChild(fist);

            let srp = fist.getComponent("FistAction") as FistAction;
            if (srp)
                srp.bellow = bellowID;
                srp.attack = attack;
                srp.hit = hit;
                srp.crit = crit;
                srp.holder = holder;
        }
    }

    update(delta: number) {

        if (this.control) {
            let direction = this.control.getDirection();
            this.heroNode.position = this.heroNode.position.add(direction.mul(this.heroScript.Speed * delta*this.heroScript.Cspeed));
            //根据方位，调整朝向
            if (direction.equals(cc.Vec2.ZERO) == false && this.heroScript.isAlive()) {
                let ra = Math.atan2(direction.y, direction.x);
                var degree = ra * 180/(Math.PI);
                degree = 360 - degree + 90;
                var rotationnum = Math.abs(degree)%360;
                if(rotationnum>=0&&rotationnum<=180){
                    this.heroScript.controlNode.scaleX  = Math.abs(this.heroScript.controlNode.scaleX);
                }else if(rotationnum>180&&rotationnum<360){
                    this.heroScript.controlNode.scaleX  = Math.abs(this.heroScript.controlNode.scaleX) *-1;
                }
            }

            if (this.heroNode.x > this.walkRect.xMax)
                this.heroNode.x = this.walkRect.xMax;
            else if (this.heroNode.x < this.walkRect.xMin)
                this.heroNode.x = this.walkRect.xMin;

            if (this.heroNode.y > this.walkRect.yMax)
                this.heroNode.y = this.walkRect.yMax;
            else if (this.heroNode.y < this.walkRect.yMin)
                this.heroNode.y = this.walkRect.yMin;
            
            //玩家不能穿过的障碍物
            if(this.obsRect){
                if (this.heroNode.x < this.obsRect.xMax)
                    this.heroNode.x = this.obsRect.xMax;
                else if (this.heroNode.x > this.obsRect.xMin)
                    this.heroNode.x = this.obsRect.xMin;

                if (this.heroNode.y < this.obsRect.yMax)
                    this.heroNode.y = this.obsRect.yMax;
                else if (this.heroNode.y > this.obsRect.yMin)
                    this.heroNode.y = this.obsRect.yMin;
            }

        }
        if(this.skillcontrol){
            let direction = this.skillcontrol.getDirection();
            //根据方位，调整朝向
            if (direction.equals(cc.Vec2.ZERO) == false && this.heroScript.isAlive()) {
                let ra = Math.atan2(direction.y, direction.x);
                var degree = ra / Math.PI * 180;
                
                // 不同的英雄 移动技能的技能提示不同
                switch(this.heroScript.HeroTypeID){
                    case 1:
                        if(this.heroScript.controlNode.scaleX == (-1)){
                            degree = -degree +180;
                        }
                        this.heroScript.controlNode.getChildByName("gun").angle = degree;
                        this.heroScript.NodeLine.active = true;
                        this.heroScript.nodeFirePos.angle = ra / Math.PI * 180;
                        break;
                    case 2:
                        
                        break;
                    case 3:
                        if(this.heroScript.controlNode.scaleX == (-1)){
                            degree = -degree +180;
                        }
                        this.heroScript.controlNode.getChildByName("gun").angle = degree;
                        this.heroScript.NodeLine.active = true;
                        this.heroScript.nodeFirePos.angle = ra / Math.PI * 180;
                        break;
                    default:
                        break;
                }
            }
        }
        // 道具缩小统计 ，太少则创建 钻石
        if (this.nodeItems.childrenCount < 150) {
            for (let i = 0; i < 10; i++) {
                let diamond = cc.instantiate(this.gameRes.diamondPrefab);
                if (diamond) {
                    let exp = diamond.getComponent("ExpDiamond") as ExpDiamond;
                    if (exp) {
                        exp.diamondID = Math.floor(Math.random() * 5) + 1;
                    }

                    diamond.position = new cc.Vec2(Math.random() * this.walkRect.width + this.walkRect.xMin, Math.random() * this.walkRect.height + this.walkRect.yMin);
                    this.nodeItems.addChild(diamond);
                }
            }
        }
    }
    /**
     * 实时显示前五名的分数和名字
     */
    RealTimeRank(){
        let arrScore = [];  //分数数组
        let arrName = [];   //名字数组
        for(let i=0;i<this.nodePlayers.childrenCount;i++){
            // this.nodePlayers.children[i]
            if(Global.map_obj.has(this.nodePlayers.children[i])){
                let temp = Global.map_obj.get(this.nodePlayers.children[i]).getComponent(HeroBase);
                arrScore.push(temp.score);
                arrName.push(temp.user_name);
            }
        }
        //冒泡排序
        for(var j=0;j<arrScore.length-1;j++){
            //两两比较，如果前一个比后一个小，则交换位置。
            for(var i=0;i<arrScore.length-1-j;i++){
                if(arrScore[i]<arrScore[i+1]){
                    //分数的数组按降序排列 
                    var temp = arrScore[i];
                    arrScore[i] = arrScore[i+1];
                    arrScore[i+1] = temp;
                    //对应的名字数组也改变
                    var temp_name = arrName[i];
                    arrName[i] = arrName[i+1];
                    arrName[i+1] = temp_name;
                }
            } 
        }
        for(let i=0;i<5;i++){
            this.labelname[i].string = (i+1)+"."+arrName[i];
            this.labelscore[i].string = arrScore[i];
        }
    }
}
