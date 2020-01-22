var vm = new Vue({
    el: '#main',
    data: {
        leftVal: '0%',
        touch: {},
        isPlay: false,
        width: 0,
        totalTime: '00:00',
        playTime: '00:00',
        audioSrc: '',
        type: '',
        customerId: '',
        detail: ''
    },

    mounted: function() {
        this.type = getLocationHrefPara2("type");
        this.customerId = getLocationHrefPara2("customerId");
        if (this.type == 'inApp') {
            this.getDetailForApp();
        } else {
            this.getData();
        }
    },

    watch: {
        width: function (val) {
            if (val && !this.touch.state) {
                val = val + '%';
                vm.leftVal = val
            }
        }
    },

    methods: {
        getData: function() {
            var _this = this;
            $.ajax({
                url: window.location.origin + "/cactus/bookClub/detail/wap?bookId=" + getLocationHrefPara2("bookId") + "&customerId=" + getLocationHrefPara2("customerId"),
                type: 'GET',
                dataType: 'json',
                data: {}
            })
                .done(function(json) {
                    if ( json.code == "000000" ) {
                        vm.detail = json.data;
                        var reg = /[\r\n]+/g;
                        vm.detail.authorIntro = vm.detail.authorIntro.replace(reg, "<br />");
                        vm.detail.bookIntro = vm.detail.bookIntro.replace(reg, "<br />");
                        vm.detail.publishIntro = vm.detail.publishIntro.replace(reg, "<br />");
                        vm.audioSrc = json.data.audioFile;
                        var value = json.data.audioDuration;
                        if (!value) {
                            _this.totalTime = '00:00';
                        } else {
                            //分钟
                            var minute = value / 60;
                            var minutes = parseInt(minute);
                            if (minutes < 10) {
                                minutes = "0" + minutes;
                            }
                            //秒
                            var second = value % 60;
                            var seconds = Math.round(second);
                            if (seconds < 10) {
                                seconds = "0" + seconds;
                            }
                            _this.totalTime = minutes + ":" + seconds;
                        }
                    } else {
                        showWrong(json.text);
                    }
                });
        },

        getDetailForApp: function() {
            $.ajax({
                url: window.location.origin + "/cactus/bookClub/basicIntro?bookId=" + getLocationHrefPara2("bookId"),
                type: 'GET',
                dataType: 'json',
                data: {}
            })
                .done(function(json) {
                    if ( json.code == "000000" ) {
                        vm.detail = json.data;
                        var reg = /[\r\n]+/g;
                        vm.detail.authorIntro = vm.detail.authorIntro.replace(reg, "<br />");
                        vm.detail.bookIntro = vm.detail.bookIntro.replace(reg, "<br />");
                        vm.detail.publishIntro = vm.detail.publishIntro.replace(reg, "<br />");
                    } else {
                        showWrong(json.text);
                    }
                });
        },

        /**
         * 添加歌曲时间更新事件
         */
        audioTimeUpdate: function () {
            this.$refs.audio.addEventListener('timeupdate', this.setTime)
        },

        /**
         * 播放（暂停）视频，并获取视频长度，同时监听视频播放时间
         * **/
        playAudio: function () {
            this.audioTimeUpdate();
            var audio = this.$refs.audio;
            if(audio !== null){
                //检测播放是否已暂停.audio.paused 在播放器播放时返回false.
                vm.isPlay = audio.paused;
                if(audio.paused)                     {
                    audio.play();//audio.play();// 这个就是播放
                }else{
                    audio.pause();// 这个就是暂停
                }
            }
            // this.$nextTick(function () {
            //     var value = this.$refs.audio.duration;
            //     if (!value) {
            //         this.totalTime = '00:00';
            //     } else {
            //         //分钟
            //         var minute = value / 60;
            //         var minutes = parseInt(minute);
            //         if (minutes < 10) {
            //             minutes = "0" + minutes;
            //         }
            //         //秒
            //         var second = value % 60;
            //         var seconds = Math.round(second);
            //         if (seconds < 10) {
            //             seconds = "0" + seconds;
            //         }
            //         this.totalTime = minutes + ":" + seconds;
            //     }
            // });
        },

        /**
         * 前进15秒
         * **/
        add: function () {
            // 获取音频的当前播放时间和总时间
            var current_t = parseInt(this.$refs.audio.currentTime);
            var total_t = parseInt( this.$refs.audio.duration);
            // 将当前播放时间+15秒，如果结果大于总时间，则直接取总时间
            this.$refs.audio.currentTime = (current_t + 15) >= total_t ? total_t : ( current_t + 15 );

        },


        /**
         * 后退15秒
         * **/
        minus: function () {
            // 获取音频的当前播放时间
            var current_t = parseInt(this.$refs.audio.currentTime);
            // 判断当前的播放时间-15秒后是否小于0
            this.$refs.audio.currentTime = (current_t - 15) <= 0 ? 0 : ( current_t - 15 );
        },

        /**
         * 设置当前播放时长
         */
        setTime: function () {
            // 首先我们计算到当前的播放时间
            var audio = this.$refs.audio;
            var minutes = Math.floor(audio.currentTime / 60)
            var seconds = Math.floor(audio.currentTime - minutes * 60)
            var minuteValue;
            var secondValue;
            // 进行格式转换，当分钟小于10的时候，在前面加0
            if (minutes < 10) {
                minuteValue = '0' + minutes
            } else {
                minuteValue = minutes
            }
            // 秒数的格式设置
            if (seconds < 10) {
                secondValue = '0' + seconds
            } else {
                secondValue = seconds
            }
            // 进行时间值拼接，展示到页面
            var audioTime = minuteValue + ':' + secondValue;
            vm.playTime = audioTime;
            // // 进度条的长度计算
            var barLength = audio.currentTime / audio.duration * 100;
            this.setProgress(barLength)
        },

        /**
         * 设置进度条长度
         */
        setProgress:function (val) {
            if (val < 0 || val > 100) {
                return
            }
            this.width = val
        },

        valStart: function (e) {
            this.touch.state = true;
            var left = this.$refs.progress.offsetLeft;
            this.touch.startX = e.changedTouches[0].pageX - left;
            this.touch.width = this.$refs.progress.clientWidth;
        },

        valMove: function (e) {
            if (!this.touch.state) {
                return
            }
            var left = this.$refs.progress.offsetLeft;
            var deltaX = e.changedTouches[0].pageX - left;
            var width = Math.min(Math.max(0, deltaX), this.touch.width);
            this.touch.offsetWidth = width / this.touch.width * 100;
            // var tOffsetWidth = width / (this.touch.width + this.$refs.timeDot.clientWidth + left) * 100;
            this._changeWidth(this.touch.offsetWidth);
            var audio = this.$refs.audio;
            var current = this.touch.offsetWidth * audio.duration / 100;
            audio.currentTime = current;
            this.setTime();
        },

        _changeWidth: function (val) {
            vm.leftVal = val + '%'
        },

        valEnd: function (e) {
            this.touch.state = false
        },

        goBuy: function () {
            window.location.href = location.origin + "/h5/WXactivity/bookBuyCard.html"
        }
    }
});
