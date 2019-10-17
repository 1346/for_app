var vm = new Vue({
    el: '#main',
    data: {
        postDetail: {},
        showCommentBox: false
    },

    created: function() {
        this.getDetail();

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

    methods: {
        getDetail: function() {
            var _this = this;
            $.ajax({
                url: window.location.origin +
                    '/cactus/bbs/v2/detail?id=' +
                    getLocationHrefPara2('id') +
                    '&customerId='+getLocationHrefPara2('customerId') +
                    '&token=' +getLocationHrefPara2('token'),
                type: 'GET',
                dataType: 'json',
                data: {}
            })
                .done(function(json) {
                    if ( json.code == "000000" ) {
                        vm.postDetail = json.data;
                        vm.postDetail.current = 1;
                        _this.$nextTick(function(){
                            mui(".mui-slider").slider();
                        });
                    } else {
                        showWrong(json.text);
                    }
                });
        },
        slide: function(e) {
            vm.postDetail.current = e.detail.slideNumber + 1;
        },
        isInstalled: function(){											//判断安装
            var the_href = undefined;
            the_href = "apphtxq://htxq.app";	//获得下载链接
            window.location = the_href;										//打开某手机上的某个app应用
            setTimeout(function(){
                window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.floral.life";		//如果超时就跳转到app下载页
            },5000);
            console.log(the_href);
        }
    }
});
