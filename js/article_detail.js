var vm = new Vue({
    el: '#main',
    data: {
        difficulty: 0, // 难度系数
        humidity: 0, // 湿度
        curing: 0, // 养护指数
        content1: '',
        content2: '',
        content3: '',
        showFooter: false,
        isShare: false,
        isVideo: false,
        isPlay: false,
        detail: {}
    },
    created: function() {
      this.getDetail();
      getLocationHrefPara2('isShare') ? this.isShare = true : this.isShare = false;
      getLocationHrefPara2('isVideo') ? this.isVideo = true : this.isVideo = false;
    },
    methods: {
        getDetail: function() {
            this.showFooter = false;
            $.ajax({
                url: window.location.origin + '/cactus/article/v2/webpage?id='+getLocationHrefPara2('id'),
                type: 'GET',
                dataType: 'json',
                data: {}
            })
                .done(function(json) {
                    if ( json.code == "000000" ) {
                        // if (json.data.content1) {
                        //     vm.content1 = json.data.content1.replace(/src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
                        //         return 'src="' + capture + '?x-oss-process=image/resize,w_650,limit_0/quality,q_90/format,jpg"'
                        //     });
                        // }
                        // if (json.data.content2) {
                        //     vm.content2 = json.data.content2.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
                        //         return 'src="' + capture + '?x-oss-process=image/resize,w_650,limit_0/quality,q_90/format,jpg"'
                        //     });
                        // }
                        // if (json.data.content3) {
                        //     vm.content3 = json.data.content3.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
                        //         return 'src="' + capture + '?x-oss-process=image/resize,w_650,limit_0/quality,q_90/format,jpg"'
                        //     });
                        // }
                        vm.content1 = json.data.content1;
                        vm.content2 = json.data.content2;
                        vm.content3 = json.data.content3;
                        vm.difficulty = json.data.difficulty | 0;
                        vm.humidity = json.data.humidity | 0;
                        vm.curing = json.data.curing | 0;
                        vm.showFooter = true;
                        vm.detail = json.data;
                        vm.isVideo = json.data.isVideo;
                    } else {
                        showWrong(json.text);
                    }
                });
        },
        playVideo: function () {
            $("#media").trigger('play');
            $("#media").trigger('requestFullscreen');
            vm.isPlay = true;
        },
        videoEnd: function () {
            vm.isPlay = false;
            $("#media").trigger('exitFullscreen');
        }
    }
});
