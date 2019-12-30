// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import HeroBase from "./HeroBase";
import RobotHero from "./RobotHero";

@ccclass
export default class RobotTrigger extends cc.Component {

    @property(RobotHero)
    parent: RobotHero = null;

    //属于谁 不然跟自己碰撞就完蛋了
    public bellow : number = 1;

    public isGO:boolean = false;
    public is_Cd:boolean = false;
    public cd_time:number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.bellow = this.parent.HeroShenFenID;
        this.cd_time = this.parent.cd_time;
        
    }
    //射击技能
    UserSkill(otherpos){
        this.isGO = false;
        this.is_Cd = true;

        var pos = otherpos.sub(this.node.parent.position);
        var len = pos.mag();
        var dir = cc.v2(-1,0);
        if(len !=0 ){
            dir.x = pos.x / len;
            dir.y = pos.y / len;
        }
        //方向计算
        let ra = Math.atan2(dir.y, dir.x);
        var degree = ra / Math.PI * 180;
        if(this.parent.controlNode.scaleX == (-1)){
            degree = -degree +180;
        }
        this.parent.controlNode.getChildByName("gun").angle = degree;
        this.parent.NodeLine.active = true;
        this.parent.nodeFirePos.angle = ra / Math.PI * 180;
        
        this.parent.onFire();
        this.scheduleOnce(function() {
            this.parent.controlNode.getChildByName("gun").angle = 0;
            this.parent.NodeLine.active = false;
            this.isGO = true;
        }, 0.9);
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider){
        //判断碰撞的类型
        if(this.isGO){
            if(other.node.group == "Player"&&this.parent.isAlive()&&!this.is_Cd&&!other.getComponent(HeroBase).invisible){
                this.UserSkill(other.node.position);
            }else if(other.node.group == "enemy" && other.getComponent(HeroBase).HeroShenFenID != this.bellow&&this.parent.isAlive()&&!this.is_Cd){
                this.UserSkill(other.node.position);
            }
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider){
        if(other.node.group == "Player"&&!this.is_Cd&&this.parent.isAlive()&&!other.getComponent(HeroBase).invisible){
            this.UserSkill(other.node.position);
        }else if(!this.is_Cd&&other.node.group == "enemy"&&other.getComponent(HeroBase).HeroShenFenID!=this.bellow&&this.parent.isAlive()&&!other.getComponent(HeroBase).invisible){
            this.UserSkill(other.node.position);
        }
    }
    update (dt) {
        if(this.is_Cd){
            if(this.cd_time>0){
                this.cd_time-=dt;
            }else{
                this.is_Cd =false;
                this.cd_time=this.parent.cd_time;
            }
        }
    }
}
