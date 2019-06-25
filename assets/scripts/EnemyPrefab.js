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
        map:{
            default:null,
            type:cc.Node,
        },
        Heroexp:{
            default:null,
            type:cc.Sprite,
        },
        Herolv:{
            default:null,
            type:cc.Label,
        },
        Heroname:{
            default:null,
            type:cc.Label,
        },
        Herohp: {
            default: null,
            type: cc.ProgressBar,
        },
        lvUp:{
            default:null,
            type:cc.Animation,
        },
        addhp:{
            default:null,
            type:cc.Animation,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },
    init(type){
        this.type = type;
        if(type){
            //初级机器人
            this.curhp = 1600;
            this.maxhp = 1600;
            this.lv = 1;
            this.exp = 0;                   //当前所需经验值
            this.expnum = 0;                //当前经验值
            this.xishu = 6;                 //升级系数
            this.crit = 0.05;               //暴击率 5%~20%
            this.hit = 0.3;                 //命中率 30%~50%
            this.attack = 600;              //攻击力
            this.speed=100;                 //初始速度
            this.addspeed = 100;            //加速度
            this.killsnumber = 0;           //杀敌数
            this.isDun = false;             //是否有护盾
            this.is_chidu = false;          //是否吃毒
        }else{
            //高级机器人
            this.curhp = Global.hp;;
            this.maxhp = Global.hp;;
            this.lv = 1;
            this.exp = 0;                   //当前所需经验值
            this.expnum = 0;                //当前经验值
            this.xishu = 6;                 //升级系数
            this.crit = 0.5;               //暴击率 40%~60%
            this.hit = 0.7;                 //命中率 70%~90%
            this.attack = Global.attack;    //攻击力
            this.speed=100;                 //初始速度
            this.addspeed = 100;            //加速度
            this.killsnumber = 0;           //杀敌数
            this.isDun = false;             //是否有护盾
            this.is_chidu = false;          //是否吃毒
        }
        
    },

    // update (dt) {},
});
