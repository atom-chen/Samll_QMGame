// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: null,
            type: cc.Node,
        },

        jumpappPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},

    start() {
        // if (Global.jumpinfo_callback == null) {
        //     console.log("set callback");
        //     Global.jumpinfo_callback = this.JumpCallBack.bind(this);
        // }
        // else {
            this.JumpCallBack();
        //}
    },

    JumpCallBack() {
        if (Global.jumpappObject == null)
            return;
            //this.content.width = Global.jumpappObject.length*54+(Global.jumpappObject.length-1)*5;
        for (let i = 0; i < Global.jumpappObject.length; i++) {
            let app = cc.instantiate(this.jumpappPrefab);
            if (app) {
                this.content.addChild(app);
                let src = app.getComponent(require("JumpAppScript"));
                if (src) {
                    src.index = i;
                }
                src.sprite.spriteFrame = Global.jumpappObject[i].sprite;
                if (src.labelGame)
                {
                    src.labelGame.string = Global.jumpappObject[i].name;
                }
            }
        }
    },
    // update (dt) {},
});
