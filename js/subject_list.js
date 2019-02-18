/**
 * Created by guang on 2018/11/8.
 */
var vm = new Vue({
    el: '#main',
    data: {
        total: undefined,
        notSigned: undefined,
        more:'点击加载更多',
        listData:[],
        page: 0,
        isMore: true,
        list: [
            {
                "number": 5,
                "userName": "男哥",
                "applyTimestamp": "2018-10-01(拼团)",
                "applyText": "未签到",
                "applyStatus": 0,
                "mobile": "19000000000",
                specOneTitle: '规格1：',
                specOneName: '2018.12.30 ~ 2020.02.08一节课',
                specTwoTitle: '规格2：',
                specTwoName: '2018.12.30 ~ 2020.02.08一节课',
            },
            {
                "number": 4,
                "userName": "大花儿",
                "applyTimestamp": "2018-10-01(拼团)",
                "applyText": "未签到",
                "applyStatus": 0,
                "mobile": "19000000001"
            },
            {
                "number": 3,
                "userName": "阿迪",
                "applyTimestamp": "2018-10-01(拼团)",
                "applyText": "未签到",
                "applyStatus": 0,
                "mobile": "19000000002"
            },
            {
                "number": 2,
                "userName": "阿淼",
                "applyTimestamp": "2018-10-01(拼团)",
                "applyText": "未签到",
                "applyStatus": 0,
                "mobile": "19000000003"
            },
            {
                "number": 1,
                "userName": "嘉宁",
                "applyTimestamp": "2018-10-01(拼团)",
                "applyText": "未签到",
                "applyStatus": 0,
                "mobile": "19000000004"
            }
        ]
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