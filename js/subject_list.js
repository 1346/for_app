/**
 * Created by guang on 2018/11/8.
 */
var vm = new Vue({
    el: '#main',
    data: {
        total: 1000,
        notSigned: 2,
        more:'点击加载更多',
        listData:[],
        page: 0,
        isMore: true
    },
    created: function() {
        this.getList();
    },
    methods: {
        getList: function() {
            $.ajax({
                    url: window.location.origin +'/cactus/train/getSponsorTrainClassApplyList?trainClassId='+getLocationHrefPara2('trainClassId')+'&customerId='+getLocationHrefPara2('customerId')+'&token='+getLocationHrefPara2('token')+'&index='+this.page+'&limit=10',
                    type: 'GET',
                    dataType: 'json',
                    data: {},
                })
                .done(function(json) {
                    if ( json.code == "000000" ) {
                        const data = json.data;
                        vm.total = data.applyTotalCount;
                        vm.notSigned = data.notWritedOffCount;
                        vm.listData = data.applyList;
                    }
                });
        },
        showMore: function() {
            vm.more = '正在加载更多数据...';
            vm.page++;
            $.ajax({
                    url: window.location.origin +'/cactus/train/getSponsorTrainClassApplyList?trainClassId='+getLocationHrefPara2('trainClassId')+'&customerId='+getLocationHrefPara2('customerId')+'&token='+getLocationHrefPara2('token')+'&index='+this.page+'&limit=10',
                    type: 'GET',
                    dataType: 'json',
                    data: {},
                })
                .done(function(json) {
                    if ( json.code == "000000" ) {
                        const data = json.data;
                        if (data.applyList.length == 0) {
                            vm.more = '暂无更多内容'
                            vm.isMore = false;
                        } else {
                            vm.more = '点击加载更多'
                            vm.listData = vm.listData.concat(data.applyList);
                        }
                    }
                });
        }
    }
})