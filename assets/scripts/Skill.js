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
        target:{
            default:null,
            type:cc.Node,
        },
        skill1_mask:{
            default:null,
            type:cc.Sprite,
        },
        skill_bullet:{
            default:null,
            type:cc.Prefab,
        },
    },

   

    // onLoad () {},

    start () {
        this.Max_r = 53;
        this.cd=4;
        this.is_Cd = false;
        this.dir = cc.v2(0,0);
        var line = this.target.getChildByName("line");
        this.Rocker.on(cc.Node.EventType.TOUCH_START,function(e){
            if(!this.is_Cd){
                line.active = true;
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
            }
            
        },this);
   
        this.Rocker.on(cc.Node.EventType.TOUCH_MOVE,function(e){
            if(!this.is_Cd){
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
            }
            
        },this);
   
        this.Rocker.on(cc.Node.EventType.TOUCH_END,function(e){
            if(!this.is_Cd){
                // TODO 开炮
                line.active = false;
                var skillbullet = cc.instantiate(this.skill_bullet);
                let data = {
                    width:line.width,
                }
                skillbullet.getComponent("Bullet").init(data);
                this.target.addChild(skillbullet);
                //cd
                this.is_Cd = true;
    
                this.Rocker.setPosition(cc.v2(0,0));
                this.dir = cc.v2(0, 0);
                this.scheduleOnce(function() {
                    this.target.rotation = 0;
                }, 0.9);
            }
        },this);
   
        this.Rocker.on(cc.Node.EventType.TOUCH_CANCEL,function(e){
            if(!this.is_Cd){
                // TODO 开炮
                line.active = false;
                var skillbullet = cc.instantiate(this.skill_bullet);
                let data = {
                    width:line.width,
                }
                skillbullet.getComponent("Bullet").init(data);
                this.target.addChild(skillbullet);
                //cd
                this.is_Cd = true;
                
                this.Rocker.setPosition(cc.v2(0,0));
                this.dir = cc.v2(0, 0);
                this.scheduleOnce(function() {
                    this.target.rotation = 0;
                }, 0.9);
            }
            
        },this);
    },

    update (dt) {
        if(this.is_Cd){
            //显示技能遮罩
            if(this.skill1_mask.fillRange >= 0){
                this.skill1_mask.fillRange -= (dt/this.cd);
            }else{
                this.is_Cd = false;
                this.skill1_mask.fillRange =1;
            }
        }
    },
});
