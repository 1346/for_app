/**
 * Created by guang on 2018/10/26.
 */
var vm = new Vue({
    el: '#main',
    data:{
        name: undefined,
        cardId: undefined,
        reCardId: undefined,
        imgSrc: undefined,
        isCheck: true,
        imgData: undefined
    },
    methods:{
        deleteImg: function () {
            setTimeout(function() {
                vm.imgSrc = undefined;
            },1)
        },
        submit: function() {
            const regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

            const userId = getCookie('user');
            const token = localStorage.getItem('HTXQToken');

            var formData = new FormData();
            formData.append('files',vm.imgData);

            vm.name = $('.name').val().replace(/\s+/g,"");
            vm.cardId = $('.cardId').val().replace(/\s+/g,"");
            vm.reCardId = $('.reCardId').val().replace(/\s+/g,"");

            if (!vm.name) {
                mui.toast('请填写姓名',{ duration: 'long', type: 'div' })
            } else if (!vm.cardId) {
                mui.toast('请填写身份证号',{ duration: 'long', type: 'div' })
            } else if (!vm.reCardId) {
                mui.toast('请确认身份证号',{ duration: 'long', type: 'div' })
            } else if (!vm.imgSrc) {
                mui.toast('请上传身份证照片',{ duration: 'long', type: 'div' })
            } else if (!vm.isCheck) {
                mui.toast('您未同意实名认证协议无法提交',{ duration: 'long', type: 'div' })
            } else if (!regIdCard.test(vm.cardId)) {
                mui.toast('身份证号填写有误',{ duration: 'lang', type: 'div'})
            } else if (vm.cardId !== vm.reCardId) {
                mui.toast('您两次输入的身份证号不一致，请仔细核对',{ duration: 'lang', type: 'div'})
            } else {
                $.ajax({
                    url: window.location.origin + '/cactus/customer/submitCertification?customerId='+ userId +'&token='+ token +'&idCardName='+ vm.name + '&idCardNumber=' + vm.cardId,
                    type: 'POST',
                    cache: false,       // 上传文件不需要缓存
                    processData: false,  // 告诉jQuery不要去处理发送的数据
                    contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
                    data: formData,
                    success: function(data) {
                        if (data.code == '000000') {
                            console.log('提交成功！！！');
                            window.location.href = '/h5/Verified/html/success.html';
                        }
                    }
                })
            }
        }
    }
})