var vm = new Vue({
    el: '#main',
    data: {
        headerDetail: '',
        isLiked: false,
        menuList: [
            { id: 1, name: '帖子', show: true },
            { id: 2, name: '图册', show: true },
            { id: 3, name: '活动', show: true }
        ],
        selectId: 1,   // 菜单切换
        // TODO: 到时候调用接口的时候需要自己先把数据结构弄好
        postList: [],  // 帖子列表
        postIndex: 0,
        postCompleted: false,
        atlasList: [],  // 图册列表
        atlasIndex: 0,
        atlasCompleted: false,
        ua: navigator.userAgent.toLowerCase(),
        activityList: [],   // 活动列表
        activityIndex: 0,
        activityCompleted: false,
        showCommentBox: false,      // 是否显示评论输入区域
        comment: '',        // 评论内容
        showAtlasDetail: false,     // 是否显示图册详情
        headerOk: false,
        postOk: false,
        atlasOk: false,
        activityOk: false
    },

    created: function() {
        this.getDetail();
        this.getPostList();
        this.getAtlasList();
        this.getActivityList();

        // var openId  = sessionStorage.getItem("HTXQopenId") == null ? "" : sessionStorage.getItem("HTXQopenId");
        // if ( !openId ){
        //     var code = getLocationHrefPara2("code");
        //     if ( code ) {
        //         getWXUserInformation(code);
        //     }else{
        //         weixinLogin(0);					//微信跳转授权
        //     }
        // }

        if (browser.versions.mobile) {//判断是否是移动设备打开。
            if (this.ua.match(/MicroMessenger/i) == "micromessenger"　|| this.ua.match(/WeiBo/i) == "weibo" || this.ua.match(/QQ/i) == "qq" ) {
                return false;
            }else{
                // TODO: 记得打开方法
                this.isInstalled();
            }
        }
    },

    watch: {
      showCommentBox: function (val) {
           if (val) {
               $("body").css({'height': '100vh', 'overflow': 'hidden'});
               this.comment = '';
           } else {
               $("body").css({'height': 'auto', 'overflow': 'visible'});
           }
      }
    },

    methods: {
        getDetail: function() {
            $.ajax({
                url: window.location.origin +
                    '/cactus/ucenter/station/' +
                    getLocationHrefPara2('targetId') +
                    '?customerId='+getLocationHrefPara2('customerId') +
                    '&token=' +getLocationHrefPara2('token'),
                type: 'GET',
                dataType: 'json',
                data: {}
            })
                .done(function(json) {
                    if ( json.code == "000000" ) {
                        vm.headerDetail = json.data;
                        json.data.isSponsor ? vm.menuList[2].show = true : vm.menuList[2].show = false;
                        vm.headerOk = true;
                    } else {
                        showWrong(json.text);
                    }
                });
        },
        getPostList: function() {
            var _this = this;
            $.ajax({
                url: window.location.origin +
                    '/cactus/ucenter/station/bbs/list/' +
                    getLocationHrefPara2('targetId') +
                    '?customerId='+getLocationHrefPara2('customerId') +
                    '&token=' +getLocationHrefPara2('token') + '&index=' + this.postIndex,
                type: 'GET',
                dataType: 'json',
                data: {}
            })
                .done(function(json) {
                    if ( json.code == "000000" ) {
                        if (json.data.length == 0) {
                            vm.postCompleted = true;
                        } else {
                            json.data.map(function (value) {
                                value.current = 1;
                            });
                            vm.postList = vm.postList.concat(json.data);
                            vm.postOk = true;
                        }
                        _this.$nextTick(function(){
                            mui(".mui-slider").slider();
                        });8
                    } else {
                        showWrong(json.text);
                    }
                });
        },
        getAtlasList: function() {
            $.ajax({
                url: window.location.origin +
                    '/cactus/ucenter/station/image/list/' +
                    getLocationHrefPara2('targetId') +
                    '?customerId='+getLocationHrefPara2('customerId') +
                    '&token=' +getLocationHrefPara2('token') + '&index=' + this.atlasIndex,
                type: 'GET',
                dataType: 'json',
                data: {}
            })
                .done(function(json) {
                    if ( json.code == "000000" ) {
                        if (json.data.length == 0) {
                            vm.atlasCompleted = true;
                        } else {
                            vm.atlasList = vm.atlasList.concat(json.data);
                            vm.atlasOk = true;
                        }
                    } else {
                        showWrong(json.text);
                    }
                });
        },
        getActivityList: function() {
            $.ajax({
                url: window.location.origin +
                    '/cactus/ucenter/station/train/list/' +
                    getLocationHrefPara2('targetId') +
                    '?customerId='+getLocationHrefPara2('customerId') +
                    '&token=' +getLocationHrefPara2('token') + '&index=' + this.activityIndex,
                type: 'GET',
                dataType: 'json',
                data: {}
            })
                .done(function(json) {
                    if ( json.code == "000000" ) {
                        if (json.data.length == 0) {
                            vm.activityCompleted = true;
                        } else {
                            vm.activityList = vm.activityList.concat(json.data);
                            vm.activityOk = true;
                        }
                    } else {
                        showWrong(json.text);
                    }
                });
        },
        changeLiked:function() {
          vm.isLiked = !vm.isLiked;
          if (vm.isLiked) {
              showWrong('关注成功')
          } else {
              showWrong('取消关注成功')
          }
        },
        slide: function(e, item) {
            console.log(e, item);
            item.current = e.detail.slideNumber + 1;
        },
        changeMenu: function(item) {
            vm.selectId = item.id;
        },
        commentSend: function () {
            if (!vm.comment) {
                showWrong('请填写评论内容')
            } else {
                vm.showCommentBox = false;
                console.log(vm.comment);
            }
        },
        changeAwesome: function (item) {
            item.isAwesome = !item.isAwesome;
        },
        isInstalled: function(){											//判断安装
            var the_href = undefined;
            the_href = "apphtxq://htxq.app";	//获得下载链接
            window.location = the_href;										//打开某手机上的某个app应用
            setTimeout(function(){
                window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.floral.life";		//如果超时就跳转到app下载页
            },5000);
            console.log(the_href);
        },
        clickAtlas: function (index) {
            vm.showAtlasDetail = true;
            if (index == vm.atlasList.length - 1) {
                if (vm.atlasCompleted) {
                    // showWrong('已加载完成')
                } else {
                    vm.atlasIndex++;
                    vm.getAtlasList();
                }
            }
            this.$nextTick(function(){
                var slider = mui(".mui-slider").slider();
                slider.gotoItem(index, 0);
            })
        },
        atlasSlide: function (e) {
            var num = e.detail.slideNumber;
            if (num == vm.atlasList.length - 2) {
                if (vm.atlasCompleted) {
                    // showWrong('已加载完成')
                } else {
                    vm.atlasIndex++;
                    vm.getAtlasList();
                }
            }
        },
        jumpToDetail: function (item) {
            // console.log(item.id);
            // location.href = location.origin + '/h5/WXactivity/train_detail.html?id=' + item.id + '&uno=&code=' + getLocationHrefPara2('code') + '&state=0'
            location.href = location.origin + '/h5/WXactivity/train_detail.html?id=' + item.id + '&uno=&code=&state=0'
        }
    }
});

$(window).on("scroll",function(){
    var windowHeight = $(window).height();
    var windowHeight2 = window.innerHeight;
    var scrollTop = $(window).scrollTop();
    var documentHeight = $(document).height();
    // console.log(windowHeight,windowHeight2,scrollTop,documentHeight);
    if ( Math.abs(windowHeight + scrollTop - documentHeight) <=3 ) {
        if (vm.headerOk&&vm.postOk&&vm.atlasOk&&vm.activityOk) {
            if (vm.selectId == 1) {
                if (vm.postCompleted) {
                    // showWrong('已加载完成')
                } else {
                    vm.postIndex++;
                    vm.getPostList();
                }
            } else if (vm.selectId == 2) {
                if (vm.atlasCompleted) {
                    // showWrong('已加载完成')
                } else {
                    vm.atlasIndex++;
                    vm.getAtlasList();
                }
            } else {
                if (vm.activityCompleted) {
                    // showWrong('已加载完成')
                } else {
                    vm.activityIndex++;
                    vm.getActivityList();
                }
            }
        }
    }
    if (scrollTop >= $(".station_header").innerHeight()) {
        $(".station_nav_menu").css({
            'position': 'fixed',
            'top': 0,
            'background-color': '#FFFFFF',
            'z-index': 98,
            'border-top': '1px solid #ffffff'
        });
        $(".station_content").css('margin-top', '1.2rem');
    } else {
        $(".station_nav_menu").css({
            'position': 'static',
            'border-top': '1px solid #ececec'
        });
        $(".station_content").css('margin-top', '0.3rem');
    }
});
