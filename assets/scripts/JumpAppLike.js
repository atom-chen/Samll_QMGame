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
        prefabJump:{
            default:null,
            type:cc.Prefab,
        },

        jumpconent:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // 阿拉丁埋点
        wx.aldSendEvent("dmx_ likePage_pv/uv");
        let randindex = [];
        for (let i = 0;Global.jumpappObject && i < Global.jumpappObject.length ;i++)
        {
            randindex.push(i);
        }
        //打乱顺序
        for (let i = 0;i < randindex.length; i++)
        {
            let randid = Math.floor((Math.random()*randindex.length));
            let temp = randindex[randid];
            randindex[randid] = randindex[i];
            randindex[i] = temp;
        }

        //推荐app
        let xx = 0;
        for (let i = 0; i < randindex.length && xx < 5;i++)
        {
            if (Global.jumpappObject[randindex[i]].sprite)
            {
                let jump = cc.instantiate(this.prefabJump);
                if (jump)
                {
                    this.jumpconent.addChild(jump);
                    let sc = jump.getComponent(require("JumpAppScript"));
                    if (sc)
                    {
                        sc.index = randindex[i];
                        console.log(sc.index);
                        sc.sprite.spriteFrame = Global.jumpappObject[randindex[i]].sprite;
                        sc.labelGame.string = Global.jumpappObject[randindex[i]].name;
                        xx++;
                    }
                }
                
            }
        }
    },
    onAgainBtn(){
        // 阿拉丁埋点
        wx.aldSendEvent("dmx_ likePage_rmrematch_click");
        cc.director.loadScene("GameReady.fire");
    },
    onBackGameStat(){
        // 阿拉丁埋点
        wx.aldSendEvent("dmx_ likePage_backHall_click");
        cc.find("Canvas/DOYouLikeView").active =false;
    }
    // update (dt) {},
});
