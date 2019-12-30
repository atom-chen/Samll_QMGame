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
import GameControl from "./GameControl";
import StickControl from "./StickControl";

@ccclass
export default class SkillControl extends cc.Component {

    @property(GameControl)
    control: GameControl = null;

    @property(StickControl)
    stickControl: StickControl = null;

    @property(cc.Node)
    stick : cc.Node = null;

    @property(cc.Integer)
    raduis: number = 0;

    @property(cc.Sprite)
    skill_cd:cc.Sprite =null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    public is_Cd:boolean = false;
    public cd_time:number = 0;
    start () {
        this.stick.on("touchmove",this.touchMove,this );
        this.stick.on("touchcancel", this.touchEnd, this);
        this.stick.on("touchend", function(event :cc.Event.EventMouse) {
            if(this.control.heroScript.isAlive()&&!this.is_Cd){
                this.is_Cd = true;
                this.UserSkill();
            }
        },this);

        this.cd_time = this.control.heroScript.cd_time;
    }

    touchMove(event :cc.Event.EventMouse )
    {   
        if(this.control.heroScript.isAlive() && !this.is_Cd){
            this.stick.position = this.stick.position.add(event.getDelta());
            if (this.stick.position.mag() > this.raduis)
            {
                this.stick.position = this.stick.position.normalize().mulSelf(this.raduis);
            }
        }
    }

    touchEnd(event: cc.Event.EventMouse)
    {
        if(this.control.heroScript.isAlive()&&!this.is_Cd){
            this.is_Cd = true;
            this.UserSkill();
        }
    }
    //根据玩家的英雄类型释放对应的技能
    UserSkill(){
        let hero = this.control.heroScript;
        switch(hero.HeroTypeID){
            case 1:
                this.Skill1();
                break;
            case 2:
                this.Skill2();
                break;
            case 3:
                this.Skill3();
                break;
            default:
                break;
        }
    }
    //普通英雄的子弹技能
    Skill1(){
        let hero = this.control.heroScript;
        hero.onFire();
        this.scheduleOnce(function() {
            hero.controlNode.getChildByName("gun").angle = 0;
            hero.NodeLine.active = false;
            hero.nodeFirePos.angle = 0;
        }, 0.9);
        this.stick.position = cc.Vec2.ZERO;
    }
    //类似于王者荣耀的荆轲 瞬移技能
    Skill2(){
        this.stickControl.isUserSkill = true;
        let size = cc.view.getFrameSize();
        let hero = this.control.heroScript;
        hero.onSpike();
        let direction = this.getDirection();
        let action = cc.sequence(cc.moveTo(0.1,this.control.heroNode.position.add(direction.mul(size.height/3))),cc.callFunc(()=>{
            this.stickControl.isUserSkill = false;
        }));
        this.control.heroNode.runAction(action);
        let ra = Math.atan2(direction.y, direction.x);
        var degree = ra / Math.PI * 180;
        degree = 360 - degree + 90;
        var rotationnum = Math.abs(degree)%360;
        if(rotationnum>=0&&rotationnum<=180){
            hero.controlNode.scaleX  = Math.abs(hero.controlNode.scaleX);
        }else if(rotationnum>180&&rotationnum<360){
            hero.controlNode.scaleX  = Math.abs(hero.controlNode.scaleX) *-1;
        }
        // this.scheduleOnce(function() {
        // }, 0.9);
        this.stick.position = cc.Vec2.ZERO;
    }
    Skill3(){
        let hero = this.control.heroScript;
        hero.onAttack();
        this.scheduleOnce(function() {
            hero.controlNode.getChildByName("gun").angle = 0;
            hero.NodeLine.active = false;
            hero.nodeFirePos.angle = 0;
        }, 0.9);
        this.stick.position = cc.Vec2.ZERO;
    }
    getDirection():cc.Vec2
    {
        return this.stick.position.normalize();
    }

    update (dt) {
        if(this.is_Cd){
            //显示技能遮罩
            if(this.skill_cd.fillRange >= 0){
                this.skill_cd.fillRange -= (dt/this.cd_time);
            }else{
                this.is_Cd = false;
                this.skill_cd.fillRange =1;
            }
        }
    }
}
