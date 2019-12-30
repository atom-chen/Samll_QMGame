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
export default class StickControl extends cc.Component {

    @property(cc.Node)
    stick : cc.Node = null;

    @property(cc.Integer)
    raduis: number = 0;
    // LIFE-CYCLE CALLBACKS:
    public isUserSkill:boolean = false;

    // onLoad () {}

    start () {
        this.stick.on("touchmove",this.touchMove,this );
        // this.stick.on("touchend", this.touchEnd,this);
        this.stick.on("touchcancel", this.touchEnd, this);
        this.stick.on("touchend", function(event :cc.Event.EventMouse) {
            this.stick.position = cc.Vec2.ZERO;
        },this);
    }

    touchMove(event :cc.Event.EventMouse )
    {
        if(this.isUserSkill)
            return;
        this.stick.position = this.stick.position.add(event.getDelta());
        if (this.stick.position.mag() > this.raduis)
        {
            this.stick.position = this.stick.position.normalize().mulSelf(this.raduis);
        }
    }

    touchEnd(event: cc.Event.EventMouse)
    {
        this.stick.position = cc.Vec2.ZERO;
    }

    getDirection():cc.Vec2
    {
        return this.stick.position.normalize();
    }

 
    // update (dt) {}
}
