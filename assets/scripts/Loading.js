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
        loadtext:{
            default:null,
            type:cc.Label,
        },
        progressBar: {
            default: null,
            type: cc.ProgressBar,
        },
        text:{
            default:null,
            type:cc.Label,
        },
        startBtn:{
            default:null,
            type:cc.Button,
        },
        jumpAppPrefab: {
            default: [],
            type: cc.Node,
        },
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
 
    start () {
        let self = this;
        Global.showBanner();
        // 阿拉丁埋点
        wx.aldSendEvent("游戏登录_页面访问数");
        this.startTime = Date.now();
        this.progressBar.progress = 0;
        Global.Login();
        Global.Getinfo();
        Global.GetJumpInfo();

        // this.loadRemoteAssets();
        //下载子包
        wx.loadSubpackage({

            name:'music', // name可以填为name或者root
        
            success: function(res){
        
                //分包加载完成后通过success回调
                console.log("回调成功",res);
            },
        
            fail: function(res){
        
                //分包加载失败通过fail回调
                console.log("回调失败",res);
            }
        
        })
    
        const loadTask = wx.loadSubpackage({

            name: 'texture', // name可以填为name或者root
        
            success: function(res){
        
                //分包加载完成后通过success回调
                console.log("回调成功1",res);
                self.progressBar.node.active = false;
                self.loadtext.node.active =false;
                self.text.node.active =false;
                self.startBtn.node.active =true;
                self.enabled = false;
                for (let i = 0; i < self.jumpAppPrefab.length; i++) {
                    self.jumpAppPrefab[i].active = true;
                }
                self.ChangeJumpAppSelectSprite();
                self.scheduleOnce(function() {
                    var action = cc.moveTo(0.2, 0, 56);
                    self.startBtn.node.runAction(action);
                    Global.banner.style.top = Global.ScreenHeight - Global.banner.style.realHeight;
                    //self.startBtn.node.y=52;
                },2);
            },
        
            fail: function(res){
        
                //分包加载失败通过fail回调
                console.log("回调失败1",res);
            }
        
        })
        loadTask.onProgressUpdate(res => {
            self.progressBar.progress = res.progress;
            self.loadtext.string = Math.floor(res.progress*100) + '%';
        })
    
    },
 
 
    // update (dt) {},
    onTouchBtn(){
        
        //隐藏广告
        Global.banner.hide();

        // 阿拉丁埋点
        wx.aldSendEvent("游戏登录_开始游戏");
        wx.aldSendEvent("游戏登录_页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
          });
        if(wx.getLaunchOptionsSync()){
            this.LaunchData = JSON.stringify(wx.getLaunchOptionsSync());
            // // 上线前注释console.log("LaunchData=====", this.LaunchData);
    
            this.LaunchData_json = JSON.parse(this.LaunchData);
            // // 上线前注释console.log("LaunchData_json=====", this.LaunchData_json);
    
            this.sceneValue = this.LaunchData_json.scene;
            // // 上线前注释console.log("sceneValue=====", this.sceneValue);
    
            this.queryValue =  this.LaunchData_json.query;
            // 上线前注释console.log("queryValue===分享ID==", this.queryValue);
    
            if (this.queryValue) {
                // // 上线前注释
                console.log("ceshi-1: "+this.LaunchData_json['query']['introuid']);
                if (this.LaunchData_json['query']['introuid']) {
                    Global.GetUesrInfo(this.LaunchData_json['query']['introuid']);
                    // 阿拉丁埋点
                    wx.aldSendEvent('邀请',{'是否有效' : '是'});
                }else{
                    Global.GetUesrInfo();
                }
            }else{
                Global.GetUesrInfo();
            }
        }
        
    },
    
    /**
    * 加载远程资源
    * wx.env.USER_DATA_PATH： 这个是小游戏在手机上的临时目录
    **/
    loadRemoteAssets () {
        const self = this
        const fs = wx.getFileSystemManager()  // 获取微信小游戏sdk中的 文件系统
        // 然后
        const downloadTask = wx.downloadFile({
            url: 'https://img.zaohegame.com/staticfile/wx039e71b55cba9869/res/raw-assets.zip',  // 我们上传到服务器的资源文件压缩包地址
            header: {
                'content-type': 'application/json'
            },
            filePath: '',
            success: function (res){    // 资源下载成功以后，我们将文件解压到小游戏的运行目录
                console.log('资源下载成功', res)
                let zip_res = res.tempFilePath
                fs.unzip({
                    zipFilePath: zip_res,
                    targetPath: wx.env.USER_DATA_PATH + '/res/',
                    success: function (result) {
                        console.log('解压缩成功---', result)
                        wx.setStorageSync('downloaded', true)
                        // self.MainScene.init()       // 解压成功以后再让主场景初始化数据
                        // setTimeout(() => {
                        //     self.hideLoading()
                        // }, 700)
                        self.progressBar.node.active = false;
                        self.loadtext.node.active =false;
                        self.text.node.active =false;
                        self.startBtn.node.active =true;
                        self.enabled = false;
                        for (let i = 0; i < self.jumpAppPrefab.length; i++) {
                            self.jumpAppPrefab[i].active = true;
                        }
                        self.ChangeJumpAppSelectSprite();
                        self.scheduleOnce(function() {
                            var action = cc.moveTo(0.2, 0, 56);
                            self.startBtn.node.runAction(action);
                            Global.banner.style.top = Global.ScreenHeight - Global.banner.style.realHeight;
                            //self.startBtn.node.y=52;
                        },2);
                    }
                })
            },
            fail: function(err){
                console.error('资源下载失败', err)
            },
            complete: function (res) {
                console.log('资源下载 complete')

            }
        })
        if (downloadTask) {     // 资源下载的时候，在界面上展示下载的进度，让用户能感知游戏进程
            downloadTask.onProgressUpdate(function(res){
                self.progressBar.progress = res.progress / 100
                self.loadtext.string = res.progress + '%'
            })
        }
    },
    /**
     * 循环切换广告图片的方法
     */
    ChangeJumpAppSelectSprite() {
        let Arr_jumpApp_Sprite = [];
        for (let i = 0; i < this.jumpAppPrefab.length; i++) {
            let sprite = this.jumpAppPrefab[i].getChildByName("sprite");
            let temp = sprite.getComponent(cc.Sprite);
            Arr_jumpApp_Sprite.push(temp);
            this.jumpAppPrefab[i].index = i;
            this.jumpAppPrefab[i].on("touchend", this.TouchEnd, this);
            this.JumpAppFangSuo(this.jumpAppPrefab[i]);
        }
        this.schedule(() => {
            for (let j = 0; j < this.jumpAppPrefab.length; j++) {
                // // 上线前注释console.log(" Arr_jumpApp_Sprite[j].index == ", Arr_jumpApp_Sprite[j].index);
                if (this.jumpAppPrefab[j].index < Global.jumpappObject.length - 1) {
                    this.jumpAppPrefab[j].index++;
                } else {
                    this.jumpAppPrefab[j].index = 0;
                }
                Arr_jumpApp_Sprite[j].spriteFrame = Global.jumpappObject[this.jumpAppPrefab[j].index].sprite;
            }
        }, 3.0, cc.macro.REPEAT_FOREVER, 0.1);
    },

    /**
    * 游戏广告按钮的放缩
    */
    JumpAppFangSuo: function (node) {
        var self = this;
        this.schedule(function () {
            var action = self.FangSuoFun();
            node.runAction(action);
        }, 1.0, cc.macro.REPEAT_FOREVER, 0.1);
    },

    /**
     * 按钮放缩方法
     */
    FangSuoFun: function () {
        var action = cc.sequence(
            cc.scaleTo(0.5, 1.0, 1.0),
            cc.scaleTo(0.5, 1.2, 1.2),
        );
        return action;
    },

    TouchEnd(event) {
        // 上线前注释console.log("event == ", event.target);
       
        event.stopPropagation();
        // 阿拉丁埋点
        wx.aldSendEvent('游戏推广',{'页面' : '游戏登陆_图片推广'});

        if (CC_WECHATGAME) {
            wx.navigateToMiniProgram({
                appId: Global.jumpappObject[event.target.index].apid,
                path: Global.jumpappObject[event.target.index].path,
                success: function (res) {
                    // 上线前注释console.log(res);
                },
                fail: function (res) {
                    // 上线前注释console.log(res);
                },
            });
        }
    },
});
