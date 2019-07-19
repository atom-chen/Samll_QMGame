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
        taskprefab:{
            default: null,
            type: cc.Prefab,
        },
        content:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let self = this;
        Global.GetIntiveMission((res)=>{
            if(res.state==1){
                for(let i=0;i<res.result.length;i++){
                    let task = cc.instantiate(self.taskprefab);
                    task.getComponent("friendTask_1").init(res.result[i]);
                    self.content.addChild(task);
                }
            }
        });
    },
    
    onClickClose: function () {
        this.node.destroy();
    },
    // update (dt) {},
});
