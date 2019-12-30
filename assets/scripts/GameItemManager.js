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
        if(cc.find("MusicBGM")){
            cc.find("MusicBGM").getComponent("MusicControl").StopBGM();
        }
        this.GemPool = new cc.NodePool();
        this.ItemPool = new cc.NodePool();
        for(var i=0;i<500;i++){
            var str = Math.round(Math.random()*3);
            var item =  cc.instantiate(this.gemPrefab[str]);
            this.GemPool.put(item);
        }
        for(var i=0;i<40;i++){
            var str = Math.round(Math.random()*2);
            var item =  cc.instantiate(this.ItemPrefab[str]);
            this.ItemPool.put(item);
        }
        //生成道具地图块坐标
        // this.arrPos = [{x:-1750,y:-1250},{x:-1250,y:-1250},{x:-750,y:-1250},{x:-250,y:-1250},{x:250,y:-1250},{x:750,y:-1250},{x:1250,y:-1250},{x:1750,y:-1250},
        //     {x:-1750,y:-750},{x:-1250,y:-750},{x:-750,y:-750},{x:-250,y:-750},{x:250,y:-750},{x:750,y:-750},{x:1250,y:-750},{x:1750,y:-750},
        //     {x:-1750,y:-250},{x:-1250,y:-250},{x:-750,y:-250},{x:-250,y:-250},{x:250,y:-250},{x:750,y:-250},{x:1250,y:-250},{x:1750,y:-250},
        //     {x:-1750,y:250},{x:-1250,y:250},{x:-750,y:250},{x:-250,y:250},{x:250,y:250},{x:750,y:250},{x:1250,y:250},{x:1750,y:250},
        //     {x:-1750,y:750},{x:-1250,y:750},{x:-750,y:750},{x:-250,y:750},{x:250,y:750},{x:750,y:750},{x:1250,y:750},{x:1750,y:750},
        //     {x:-1750,y:1250},{x:-1250,y:1250},{x:-750,y:1250},{x:-250,y:1250},{x:250,y:1250},{x:750,y:1250},{x:1250,y:1250},{x:1750,y:1250},
        // ];
        this.arrPos = [{x:-1350,y:-900},{x:-1050,y:-900},{x:-750,y:-900},{x:-450,y:-900},{x:-150,y:-900},{x:150,y:-900},{x:450,y:-900},{x:750,y:-900},{x:1050,y:-900},{x:1350,y:-900},
            {x:-1350,y:-300},{x:-1050,y:-300},{x:-750,y:-300},{x:-450,y:-300},{x:-150,y:-300},{x:150,y:-300},{x:450,y:-300},{x:750,y:-300},{x:1050,y:-300},{x:1350,y:-300},
            {x:-1350,y:300},{x:-1050,y:300},{x:-750,y:300},{x:-450,y:300},{x:-150,y:300},{x:150,y:300},{x:450,y:300},{x:750,y:300},{x:1050,y:300},{x:1350,y:300},
            {x:-1350,y:900},{x:-1050,y:900},{x:-750,y:900},{x:-450,y:900},{x:-150,y:900},{x:150,y:900},{x:450,y:900},{x:750,y:900},{x:1050,y:900},{x:1350,y:900},
        ];
        // 石块生成位置坐标
        // this.stonePos = [{x:-1500,y:-1000},{x:-1000,y:-1000},{x:-500,y:-1000},{x:0,y:-1000},{x:500,y:-1000},{x:1500,y:-1000},
        //     {x:-1500,y:-500},{x:-1000,y:-500},{x:-500,y:-500},{x:0,y:-500},{x:500,y:-500},{x:1500,y:-500},
        //     {x:-1500,y:0},{x:-1000,y:0},{x:-500,y:0},{x:500,y:0},{x:1500,y:0},
        //     {x:-1500,y:500},{x:-1000,y:500},{x:-500,y:500},{x:0,y:500},{x:500,y:500},{x:1500,y:500},
        //     {x:-1500,y:1000},{x:-1000,y:1000},{x:-500,y:1000},{x:0,y:1000},{x:500,y:1000},{x:1500,y:1000},
        // ]
        this.stonePos = [{x:-1200,y:-600},{x:-900,y:-600},{x:-600,y:-600},{x:-300,y:-600},{x:0,y:-600},{x:300,y:-600},{x:600,y:-600},{x:900,y:-600},{x:1200,y:-600},
            {x:-1200,y:0},{x:-900,y:0},{x:900,y:0},{x:1200,y:0},
            {x:-1200,y:600},{x:-900,y:600},{x:-600,y:600},{x:-300,y:600},{x:0,y:600},{x:300,y:600},{x:600,y:600},{x:900,y:600},{x:1200,y:600},
        ]
    },

    start () {
        // 阿拉丁埋点
        wx.aldSendEvent("游戏进行_页面访问数");
        Global.startTime = Date.now();
        // for(let i =0;i<this.arrPos.length;i++){
        //     this.scheduleOnce(function() {
        //         this.SetUpGem(this.arrPos[i]);
        //     },0.01);
        // }
        // this.scheduleOnce(function() {
        //     for(let i =0;i<14;i++){
        //         this.SetUpGem(this.arrPos[i]);
        //     }  
        // },0);
        // this.scheduleOnce(function() {
        //     for(let i =14;i<27;i++){
        //         this.SetUpGem(this.arrPos[i]);
        //     }  
        // },1);
        // this.scheduleOnce(function() {
        //     for(let i =27;i<40;i++){
        //         this.SetUpGem(this.arrPos[i]);
        //     }  
        // },2);

        //创建草
        for(let i =0;i<=12;i++){
            //this.CreateStone();
            this.CreateGrass();
        }
        //创建石头 分开生成降低DC
        for(let i =0;i<=12;i++){
            this.CreateStone();
        }
        // this.scheduleOnce(function() {
        //     for(let i =0;i<this.arrPos.length;i++){
        //         this.scheduleOnce(function() {
        //             this.SetUpGem(this.arrPos[i]);
        //         },0.01);
        //     }
        // },64);
        this.isStart = true;
        this.time=0.2;
        this.scheduleOnce(function() {
            this.isStart = false;
        },8);
    },
    
    SetUpGem(pos){
        var ran = Math.round(Math.random()*10);
        for(let i=0;i<ran;i++){
            this.scheduleOnce(function() {
                this.CreateGem(pos);
            },0.01);
        }
    },
    //创建石头
    CreateStone(){
        var ran = Math.floor(Math.random()*(this.stonePos.length));
        let pos = this.stonePos[ran];
        let item = cc.instantiate(this.stonePrefab);
        item.x = pos.x;
        item.y = pos.y;
        this.node.addChild(item);
    },
    //创建
    CreateGrass(){
        var ran = Math.floor(Math.random()*(this.arrPos.length));
        let pos = this.arrPos[ran];
        let item = cc.instantiate(this.grassPrefab);
        item.x = pos.x;
        item.y = pos.y;
        this.node.addChild(item);
    },
    // 创建宝珠
    CreateGem(pos){
        if(pos.x>0){
            this.max_x = pos.x + 100;
            this.min_x = pos.x - 100;
        }else if(pos.x<0){
            this.max_x = pos.x - 100;
            this.min_x = pos.x + 100;
        }
        if(pos.y>0){
            this.max_y = pos.y + 250;
            this.min_y = pos.y - 250;
        }else if(pos.y<0){
            this.max_y = pos.y - 250;
            this.min_y = pos.y + 250;
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
            this.max_x = pos.x + 100;
            this.min_x = pos.x - 100;
        }else if(pos.x<0){
            this.max_x = pos.x - 100;
            this.min_x = pos.x + 100;
        }
        if(pos.y>0){
            this.max_y = pos.y + 250;
            this.min_y = pos.y - 250;
        }else if(pos.y<0){
            this.max_y = pos.y - 250;
            this.min_y = pos.y + 250;
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
        if(Global.is_end){
            return;
        }
        if(this.GemPool.size() >100){
            if(this.isStart){
                var arrRan = Math.floor((Math.random()*this.arrPos.length));
                var arrpos = this.arrPos[arrRan];
                this.CreateGem(arrpos);
            }else{
                if(this.time>0){
                    this.time-=dt;
                }else{
                    var arrRan = Math.floor((Math.random()*this.arrPos.length));
                    var arrpos = this.arrPos[arrRan];
                    this.CreateGem(arrpos);
                    this.time = 0.2;
                }
            }
            
        }
        if(Global.dienumber == Global.enemynumber&&Global.is_end ==false){
            Global.is_end = true;
            cc.find("Canvas/GameOverView").active = true;
        }
    },
});
