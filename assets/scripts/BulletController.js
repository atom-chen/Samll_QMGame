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
        bulletprefab:{
            default:null,
            type:cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.BulletPool = new cc.NodePool();
        for(var i=0;i<20;i++){
            var bullet =  cc.instantiate(this.bulletprefab);
            this.BulletPool.put(bullet);
        }
    },

    start () {

    },
    CreateBullet(data,node){
        let skillbullet = null;
        if(this.BulletPool.size() > 0) { 
            skillbullet = this.BulletPool.get();
        }else { 
            skillbullet = cc.instantiate(this.bulletprefab);
        }
        skillbullet.getComponent("Bullet").init(data);
        node.addChild(skillbullet);
    },
    onBulletKilled: function (bullet) {
        // bullet 应该是一个 cc.Node
        this.BulletPool.put(bullet); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    },
    // update (dt) {},
});
