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

import HeroBase from './HeroBase';
import GameControl from "./GameControl";

@ccclass
export default class RobotHero extends HeroBase {

    passTime: number = 0;

    thinkTime: number = 2.5;

    direction: cc.Vec2 = cc.Vec2.ZERO;

    walkRect: cc.Rect = null;

    onLoad() {
        super.onLoad();
        this.curhp = this.maxhp = 1600;
        // this.attack = 600;
        this.crit = 0.8;
        // this.hit = 0.9;
        this.cd_time = 2;
    }  
    start() {
        super.start();
        Global.map_obj.set(this.node,this.node);
        
        let world = cc.find("Canvas/gameworld") as cc.Node;
        let worldScript = world.getComponent("GameControl") as GameControl;
        this.walkRect = worldScript.walkRect;
        this.Speed = 50;
        this.cd_time = 2;
        this.node.position = new cc.Vec2(Math.random() * this.walkRect.width + this.walkRect.xMin, Math.random() * this.walkRect.height + this.walkRect.yMin);
        
    }
    /**
     * 初始化信息 机器人难度
     * @param type 机器人难度
     */
    init(type:number){
        //区别机器人属性
        if(type ==1){

        }else{

        }
    }

    update(dt) {
        this.passTime += dt;
        if (this.passTime > this.thinkTime) {
            this.thinkTime = Math.random() * 1.0 + 2.0;
            this.passTime = 0;
            this.direction = new cc.Vec2(Math.random() - 0.5, Math.random() - 0.5);
            this.direction.normalizeSelf();
            //if (this.isAlive())
                //this.onFire(this.attack,this.hit,this.crit,this.node);
                // this.node.getComponent("BehaviorTree").tick(null,dt);
            }
            if(this.gameWorld.heroNode){
                let playerpos = this.gameWorld.heroNode.position;
                let dir = this.node.position.sub(playerpos);
                if(Math.sqrt(dir.x*dir.x+dir.y*dir.y) <= 375){
                    this.node.getChildByName("hero_dian").active = true;
                }else{
                    this.node.getChildByName("hero_dian").active = false;
                }
            }
            this.Patrol(dt);
    }
    Patrol(dt){
        if (this.isAlive()) {
            this.node.position = this.node.position.add(this.direction.mul(this.Speed * dt));

            if (this.node.x > this.walkRect.xMax)
                this.node.x = this.walkRect.xMax;
            else if (this.node.x < this.walkRect.xMin)
                this.node.x = this.walkRect.xMin;

            if (this.node.y > this.walkRect.yMax)
                this.node.y = this.walkRect.yMax;
            else if (this.node.y < this.walkRect.yMin)
                this.node.y = this.walkRect.yMin;

            if (this.direction.equals(cc.Vec2.ZERO) == false && this.isAlive()) {
                let ra = Math.atan2(this.direction.y, this.direction.x);
                //this.controlNode.angle = ra / Math.PI * 180 + 90;
                var degree = ra * 180/(Math.PI);
                degree = 360 - degree + 90;
                var rotationnum = Math.abs(degree)%360;
                if(rotationnum>=0&&rotationnum<=180){
                    this.controlNode.scaleX  = Math.abs(this.controlNode.scaleX);
                }else if(rotationnum>180&&rotationnum<360){
                    this.controlNode.scaleX  = Math.abs(this.controlNode.scaleX) *-1;
                }
            }
        }
    }
   
}
