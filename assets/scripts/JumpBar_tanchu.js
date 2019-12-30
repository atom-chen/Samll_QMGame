// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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
        },

        btn: {
            default: null,
            type: cc.Node
        },

        btnSprite: {
            default: [],
            type: cc.SpriteFrame
        },
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.zhezhao = this.node.parent.getChildByName("zhezhao");
        var size = cc.view.getFrameSize();
        var isIphoneX = (size.width == 812 && size.height == 375) 
               ||(size.width == 375 && size.height == 812)
               ||(size.width == 896 && size.height == 414);
        if(isIphoneX){
           this.btn.width = 125;
           this.btn.getChildByName("btn_jiantou1").x +=20;
            
        }
    },

    start() {
        this.outpos = this.node.position;
        this.hidepos = cc.v2(this.node.x+this.node.width, 0);
        
        this.hide = true;
        // if (Global.jumpinfo_callback == null) {
        //     Global.jumpinfo_callback = this.JumpCallBack.bind(this);
        // }
        // else {
            this.JumpCallBack();
        //}
        this.btn_sprite = this.btn.getChildByName("btn_jiantou1").getComponent(cc.Sprite);
        this.giftAnim();
    },

    JumpCallBack() {
        if (Global.jumpappObject == null)
            return;
        for (let i = 0; i < Global.jumpappObject.length; i++) {
            let app = cc.instantiate(this.jumpappPrefab);
            if (app) {
                this.content.addChild(app);
                let src = app.getComponent(require("JumpAppScript"));
                if (src) {
                    src.index = i;
                }
                src.sprite.spriteFrame = Global.jumpappObject[i].sprite;
                if (src.labelGame) {
                    src.labelGame.string = Global.jumpappObject[i].name;
                }
            }
        }
    },

    onButtonClick(event) {
        if (this.hide == false) {
            wx.aldSendEvent("游戏大厅_精品推荐页面停留时间",{
                "耗时" : (Date.now()-this.startTime)/1000
            });
            this.node.runAction(cc.sequence(cc.moveTo(0.5, this.outpos).easing(cc.easeBackOut()),cc.callFunc(()=>{
                this.node.getComponent(cc.Widget).left = -398;
                this.node.getComponent(cc.Widget).updateAlignment();
                Global.showGameLoop =true;
            })));
            this.btn_sprite.spriteFrame = this.btnSprite[0];
            this.zhezhao.active = false;
            this.btn.x = 239;
        }
        else {
            //页面停留开始时间
            this.startTime = Date.now();

            this.node.runAction(cc.sequence(cc.moveTo(0.5, this.hidepos).easing(cc.easeBackOut()),cc.callFunc(()=>{
                this.node.getComponent(cc.Widget).left = 0;
                this.node.getComponent(cc.Widget).updateAlignment();
            })));
            Global.showGameLoop =false;
            this.btn_sprite.spriteFrame = this.btnSprite[1];
            this.btn.x = 208;
            this.zhezhao.active = true;
        }
        this.hide = !this.hide;
    },
    //动画
    giftAnim() {
        var self = this;
        this. gift = this.btn.getChildByName("btn_jiantou1");
        
        self.giftAnim = cc.repeatForever(
            cc.sequence(
                cc.skewTo(0.5,-10,10),
                cc.skewTo(0.5,10,-10)
            )
        )
        this.gift.runAction(self.giftAnim);
    },
    stopGiftAnim() {
        this.gift.stopAction(self.giftAnim);
        this.gift.rotation =0;
    },
    // update (dt) {},
});
