// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // @property([cc.SpriteFrame])
    // public spriteHeros : cc.SpriteFrame[] = [];

    // @property([cc.SpriteFrame])
    // public spriteSkills: cc.SpriteFrame[] = [];

    @property([cc.Prefab])
    public heroPrefab:cc.Prefab[] = [];

    @property(cc.Prefab)
    public robotPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    public diamondPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    public bulletPrefab: cc.Prefab = null;

    @property([cc.Prefab])
    public effectPrefab :cc.Prefab[] = [];

    @property(cc.Prefab)
    public itemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    public FistPrefab: cc.Prefab = null;

    start () {

    }

    // update (dt) {}
}
