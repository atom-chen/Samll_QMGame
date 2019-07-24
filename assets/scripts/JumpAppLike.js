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
        },
        boxViewPrefab:{
            default: null,
            type: cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // 阿拉丁埋点
        wx.aldSendEvent("猜你喜欢_页面访问数");
        this.startTime = Date.now();
        //广告位置
        Global.banner.show();
        Global.banner.style.left = (Global.ScreenWidth-Global.banner.style.realWidth)/2;
        
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
        //隐藏广告
        Global.banner.hide();
        // 阿拉丁埋点
        wx.aldSendEvent("猜你喜欢_再来一局");
        wx.aldSendEvent("猜你喜欢_页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
          });
        cc.director.loadScene("GameReady.fire");
    },
    onBackGameStat(){
        //隐藏广告
        Global.banner.hide();
        // 阿拉丁埋点
        wx.aldSendEvent("猜你喜欢_回到大厅");
        wx.aldSendEvent("猜你喜欢_页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
          });
        cc.find("Canvas/DOYouLikeView").active =false;

        //当结算页面获得宝箱是提示弹窗
        if(Global.endHaveBox){
            Global.endHaveBox = false;
            Global.showGameLoop = false;
            var boxprefab = cc.instantiate(this.boxViewPrefab);
            this.node.parent.addChild(boxprefab);
        }
    }
    // update (dt) {},
});
