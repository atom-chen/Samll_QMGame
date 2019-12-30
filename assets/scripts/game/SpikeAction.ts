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

@ccclass
export default class SpikeAction extends cc.Component {

    //目前就一个
    public SpikeID : number = 1;


    //属于谁 不然跟自己碰撞就完蛋了
    public bellow : number = 1;

    //攻击力
    public attack:number =0;

    //命中率
    public hit:number = 0;

    public crit:number =0;

    public holder:cc.Node = null;

    //是否使用突刺技能 (只有使用了技能才开始伤害判定)
    public IsUserSkill:boolean = false;
    
    onLoad(){
        
    }
    start () {
        
    }
     

    // update (dt) {}
}
