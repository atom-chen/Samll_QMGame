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

@ccclass
export default class BulletAction extends cc.Component {


    @property([cc.SpriteFrame])
    spriteFrame : cc.SpriteFrame[] = [];
    // onLoad () {}
    @property(cc.Sprite)
    sprite :cc.Sprite = null;

    //目前就一个
    public bulletID : number = 1;

    public direction : cc.Vec2 = null;

    //属于谁 不然跟自己碰撞就完蛋了
    public bellow : number = 1;

    //攻击力
    public attack:number =0;

    //命中率
    public hit:number = 0;

    public crit:number =0;

    public holder:cc.Node = null;

    timePass : number = 0;
    start () {
        let degree = Math.PI * this.node.angle / 180;
        this.direction = new cc.Vec2(Math.cos(degree), Math.sin(degree));
        
        //子弹位移
        var action = cc.moveBy(0.3, this.direction.mul(240));
        this.node.runAction(cc.sequence(action,cc.callFunc(()=>{
            this.node.destroy();
        },this)));
    }
    onBoomDestroy(){
        this.node.destroy();
    }
    // update (dt) {
    //     this.timePass += dt;
    //     if (this.timePass > 4)
    //     {
    //         this.node.destroy();
    //         return;
    //     }
    //     this.node.position = this.node.position.add(this.direction.mul(500).mul(dt));
    // }
}
