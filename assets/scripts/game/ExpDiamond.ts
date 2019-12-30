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
export default class ExpDiamond extends cc.Component {

    @property([cc.SpriteFrame])
    spriteFrame : cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    public diamondID : number = 1;

    start () {
        if (this.sprite)
        {
            this.sprite.spriteFrame = this.spriteFrame[this.diamondID-1];
        }
    }

    getExperience():number
    {
        switch(this.diamondID)
        {
            case 1:
                return 1;
            case 2:
                return 3;
            case 3:
                return 5;
            case 4:
                return 10;
            case 5:
                return 20;
        }
        return 1;
    }



    // update (dt) {}
}
