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
import HeroBase from './HeroBase';

@ccclass
export default class HeroControl2 extends HeroBase {

    onLoad() {
        super.onLoad();
        this.curhp = this.maxhp = 16000;
        this.attack = 600;
        this.crit = 0.8;
        this.hit = 0.9;
        this.cd_time = 2;
    }                
    start () {
        super.start();
        this.controlNode.getComponent(cc.Animation).play("heromove");
        Global.map_obj.set(this.node,this.node);

    }
    getPosition() {
        return this.node.position;
    }
    // update (dt) {}
} 
