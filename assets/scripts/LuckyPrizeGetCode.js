/**
 * Created by Zhou Xiaolong on 2019/04/29;
 * 奖品获取奖品码脚本
 */

cc.Class({
    extends: cc.Component,

    properties: {
        //复制获奖码界面预制体
        CopyCodePrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //模拟奖品列表数据
        // this.PrizeListData = common.PrizeListData;
        this.PrizeListData = [
            {
                date: "2019-03-07",
                list: [
                    { title: "1", state: 0 },
                    { title: "3", state: 0 },
                    { title: "1", state: 0 },
                    { title: "100", state: 1 },
                    { title: "3", state: 0 },
                ]
            },
            {
                date: "2019-03-05",
                list: [
                    { title: "1", state: 0 },
                    { title: "100", state: 1 },
                    { title: "3", state: 0 },
                ]
            },
            {
                date: "2019-03-01",
                list: [
                    { title: "1", state: 0 },
                    { title: "3", state: 1 },
                    { title: "3", state: 0 },
                ]
            },
        ];
    },

    start() {

    },

    // update (dt) {},

    init(date, index) {
        this.date = date;
        this.index = index;
    },

    /**
     * 点击获取奖品码
     */
    onClickGetPrizeCode: function () {
        // 上线前注释console.log("点击获取奖品码");
        // console.log("this.date = ", this.date);
        // console.log("this.index = ", this.index);

        // console.log("this.PrizeListData == ", this.PrizeListData[this.date].date, this.PrizeListData[this.date].list[this.index]);
        // var code = this.PrizeListData[this.date].list[this.index].code;
        var code = "获奖码";  //获奖码
        var copyCode = cc.instantiate(this.CopyCodePrefab);
        copyCode.getComponent("TanChuangHJM").init(code);
        // console.log("this.node.parent.parent.parent.parent == ", this.node.parent.parent.parent.parent);
        this.node.parent.parent.parent.parent.addChild(copyCode);
    },
});
