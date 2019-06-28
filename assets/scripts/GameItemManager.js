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
        gemPrefab:{
            default:[],
            type:cc.Prefab,
        },
        ItemPrefab:{
            default:[],
            type:cc.Prefab,
        },
        stonePrefab:{
            default:null,
            type:cc.Prefab,
        },
        grassPrefab:{
            default:null,
            type:cc.Prefab,
        },
    },

    onLoad () {
        this.GemPool = new cc.NodePool();
        this.ItemPool = new cc.NodePool();
        for(var i=0;i<100;i++){
            var str = Math.round(Math.random()*3);
            var item =  cc.instantiate(this.gemPrefab[str]);
            this.GemPool.put(item);
        }
        for(var i=0;i<100;i++){
            var str = Math.round(Math.random()*2);
            var item =  cc.instantiate(this.ItemPrefab[str]);
            this.ItemPool.put(item);
        }
        //生成道具地图块坐标
        this.arrPos = [{x:-1750,y:-1250},{x:-1250,y:-1250},{x:-750,y:-1250},{x:-250,y:-1250},{x:250,y:-1250},{x:750,y:-1250},{x:1250,y:-1250},{x:1750,y:-1250},
            {x:-1750,y:-750},{x:-1250,y:-750},{x:-750,y:-750},{x:-250,y:-750},{x:250,y:-750},{x:750,y:-750},{x:1250,y:-750},{x:1750,y:-750},
            {x:-1750,y:-250},{x:-1250,y:-250},{x:-750,y:-250},{x:-250,y:-250},{x:250,y:-250},{x:750,y:-250},{x:1250,y:-250},{x:1750,y:-250},
            {x:-1750,y:250},{x:-1250,y:250},{x:-750,y:250},{x:-250,y:250},{x:250,y:250},{x:750,y:250},{x:1250,y:250},{x:1750,y:250},
            {x:-1750,y:750},{x:-1250,y:750},{x:-750,y:750},{x:-250,y:750},{x:250,y:750},{x:750,y:750},{x:1250,y:750},{x:1750,y:750},
            {x:-1750,y:1250},{x:-1250,y:1250},{x:-750,y:1250},{x:-250,y:1250},{x:250,y:1250},{x:750,y:1250},{x:1250,y:1250},{x:1750,y:1250},
        ];
        // 石块生成位置坐标
        this.stonePos = [{x:-1500,y:-1000},{x:-1000,y:-1000},{x:-500,y:-1000},{x:0,y:-1000},{x:500,y:-1000},{x:1500,y:-1000},
            {x:-1500,y:-500},{x:-1000,y:-500},{x:-500,y:-500},{x:0,y:-500},{x:500,y:-500},{x:1500,y:-500},
            {x:-1500,y:0},{x:-1000,y:0},{x:-500,y:0},{x:500,y:0},{x:1500,y:0},
            {x:-1500,y:500},{x:-1000,y:500},{x:-500,y:500},{x:0,y:500},{x:500,y:500},{x:1500,y:500},
            {x:-1500,y:1000},{x:-1000,y:1000},{x:-500,y:1000},{x:0,y:1000},{x:500,y:1000},{x:1500,y:1000},
        ]
    },

    start () {
        for(let i =0;i<this.arrPos.length;i++){
            this.SetUpGem(this.arrPos[i]);
        }
        for(let i =0;i<=12;i++){
            this.CreateStone();
            this.CreateGrass();
        }
    },
    
    SetUpGem(pos){
        var ran = Math.round(Math.random()*12)+12;
        for(let i=0;i<ran;i++){
            this.CreateGem(pos);
        }
    },
    //创建石头
    CreateStone(){
        var ran = Math.round(Math.random()*(this.stonePos.length-1));
        let pos = this.stonePos[ran];
        let item = cc.instantiate(this.stonePrefab);
        item.x = pos.x;
        item.y = pos.y;
        this.node.addChild(item);
    },
    //创建石头
    CreateGrass(){
        var ran = Math.round(Math.random()*(this.arrPos.length-1));
        let pos = this.arrPos[ran];
        let item = cc.instantiate(this.grassPrefab);
        item.x = pos.x;
        item.y = pos.y;
        this.node.addChild(item);
    },
    // 创建宝珠
    CreateGem(pos){
        if(pos.x>0){
            this.max_x = pos.x + 200;
            this.min_x = pos.x - 200;
        }else if(pos.x<0){
            this.max_x = pos.x - 200;
            this.min_x = pos.x + 200;
        }
        if(pos.y>0){
            this.max_y = pos.y + 200;
            this.min_y = pos.y - 200;
        }else if(pos.y<0){
            this.max_y = pos.y - 200;
            this.min_y = pos.y + 200;
        }
        var x = Math.random()*(this.max_x - this.min_x) + (this.min_x);
        var y = Math.random()*(this.max_y - this.min_y) + (this.min_y);
        let item = null;
        if (this.GemPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            item = this.GemPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            item = cc.instantiate(this.gemPrefab[Math.round(Math.random()*3)]);
        }
        item.x = x;
        item.y = y;
        //item.parent = node;
        this.node.addChild(item);
    },
    //创建道具
    CreateItem(pos){
        if(pos.x>0){
            this.max_x = pos.x + 200;
            this.min_x = pos.x - 200;
        }else if(pos.x<0){
            this.max_x = pos.x - 200;
            this.min_x = pos.x + 200;
        }
        if(pos.y>0){
            this.max_y = pos.y + 200;
            this.min_y = pos.y - 200;
        }else if(pos.y<0){
            this.max_y = pos.y - 200;
            this.min_y = pos.y + 200;
        }
        var x = Math.random()*(this.max_x - this.min_x) + (this.min_x);
        var y = Math.random()*(this.max_y - this.min_y) + (this.min_y);
        let item = null;
        if (this.GemPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            item = this.ItemPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            item = cc.instantiate(this.ItemPrefab[Math.round(Math.random()*2)]);
        }
        item.x = x;
        item.y = y;
        //item.parent = node;
        this.node.addChild(item);
    },
    onGemKilled: function (gem) {
        // gem 应该是一个 cc.Node
        this.GemPool.put(gem); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    },
    onItemKilled: function (item) {
        this.ItemPool.put(item); 
    },
    update (dt) {
        //当宝石给吃了50个的时候在创建一些宝石
        // if(this.GemPool.size() >50){
        //     for(var i=0;i<this.GemPool.size();i++){
        //         this.CreateGem();
        //     }
        // }
        // if(this.ItemPool.size() >15){
        //     for(var i=0;i<this.ItemPool.size();i++){
        //         this.CreateItem();
        //     }
        // }
        if(Global.is_end){
            return;
        }
        if(Global.dienumber == Global.enemynumber&&Global.is_end ==false){
            Global.is_end = true;
            cc.find("Canvas/GameOverView").active = true;
        }
    },
});
