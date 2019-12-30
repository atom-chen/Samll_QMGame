//障碍物类

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    //血量。 有些障碍物可以攻击
    @property(cc.Integer)
    hp:number = 0;

    //障碍物id
    public obstacleID:number = 0;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.node.group == "bullet") {
            
        }
    }
    // update (dt) {}
}
