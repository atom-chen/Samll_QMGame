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
export default class CameraFollow extends cc.Component {

    @property(cc.Node)
    public followNode : cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    VeiwRect : cc.Rect = null;
    // onLoad () {}

    start () {
        let view = cc.find("Canvas/gameworld/bg_login/rectview") as cc.Node;
        let sz = view.getContentSize();
        this.VeiwRect = new cc.Rect( -sz.width/2 , -sz.height/2, sz.width,sz.height);
    }

    update (dt) {
        if (this.followNode)
        {
            this.node.position = this.followNode.position;
            
            if (this.node.x < this.VeiwRect.xMin)
                this.node.x = this.VeiwRect.xMin;
            else if (this.node.position.x > this.VeiwRect.xMax)
                this.node.x = this.VeiwRect.xMax;

            if (this.node.y < this.VeiwRect.yMin)
                this.node.y = this.VeiwRect.yMin;
            else if (this.node.y > this.VeiwRect.yMax)
                this.node.y = this.VeiwRect.yMax;

        }

    }
}
