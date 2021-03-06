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
        Rocker:{
            default:null,
            type:cc.Node,
        },
        player:{
            default:null,
            type:cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.Max_r = 49;
        this.Rocker.x = 0;
        this.Rocker.y = 0;
        this.dir = cc.v2(0,0);

       

        this.Rocker.on(cc.Node.EventType.TOUCH_START,function(e){
            this.player.getComponent(cc.Animation).play('heromove');
            var w_pos = e.getLocation();
            var pos = this.node.convertToNodeSpaceAR(w_pos);
            var len = pos.mag();//获取向量长度
            this.dir.x = pos.x / len;
            this.dir.y = pos.y / len;

            if(len > this.Max_r){
                pos.x = this.Max_r * pos.x / len;
                pos.y = this.Max_r * pos.y / len;
            }
            this.Rocker.setPosition(pos);

            var r = Math.atan2(this.dir.y,this.dir.x);
            var degree = r * 180/(Math.PI);
            degree = 360 - degree + 90;
            //(0~180)抢朝向是正的(180~360)抢换个方向
            var rotationnum = Math.abs(degree)%360;
            if(rotationnum>=0&&rotationnum<=180){
                this.player.scaleX  = Math.abs(this.player.scaleX);
            }else if(rotationnum>180&&rotationnum<360){
                this.player.scaleX  = Math.abs(this.player.scaleX) *-1;
            }
        },this);
   
        this.Rocker.on(cc.Node.EventType.TOUCH_MOVE,function(e){
            var w_pos = e.getLocation();
            var pos = this.node.convertToNodeSpaceAR(w_pos);

            var len = pos.mag();
            this.dir.x = pos.x / len;
            this.dir.y = pos.y / len;

            if(len > this.Max_r){
                pos.x = this.Max_r * pos.x / len;
                pos.y = this.Max_r * pos.y / len;
            }
            this.Rocker.setPosition(pos);
            var r = Math.atan2(this.dir.y,this.dir.x);
            var degree = r * 180/(Math.PI);
            degree = 360 - degree + 90;
            //(0~180)抢朝向是正的(180~360)抢换个方向
            var rotationnum = Math.abs(degree)%360;
            if(rotationnum>=0&&rotationnum<=180){
                this.player.scaleX  = Math.abs(this.player.scaleX);
            }else if(rotationnum>180&&rotationnum<360){
                this.player.scaleX  = Math.abs(this.player.scaleX) *-1;
            }
        },this);
   
        this.Rocker.on(cc.Node.EventType.TOUCH_END,function(e){
            this.player.getComponent(cc.Animation).stop('heromove');
            this.Rocker.setPosition(cc.v2(0,0));
            this.dir = cc.v2(0, 0);
        },this);
   
        this.Rocker.on(cc.Node.EventType.TOUCH_CANCEL,function(e){
            this.player.getComponent(cc.Animation).stop('heromove');
            this.Rocker.setPosition(cc.v2(0,0));
            this.dir = cc.v2(0, 0);
        },this);
        
       
    },
    
    //update (dt) {},
});
