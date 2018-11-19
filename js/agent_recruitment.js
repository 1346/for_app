/**
 * Created by guang on 2018/11/13.
 */
var vm = new Vue({
    el: '#main',
    data:{
        loading: false,
        btnTxt: '提交',
    },
    methods: {
        submit: function() {
            vm.loading = true;
            vm.btnTxt = '提交中...';
            var formData = {
                userName: $(".name").val().replace(/\s+/g,""),
                companyName: $(".company").val().replace(/\s+/g,""),
                weixinAccount: $('.weixin').val().replace(/\s+/g,""),
                userMobile: $('.phone').val(),
                intro: $(".advantage").val(),
            }
            if (formData.userName && formData.companyName && formData.weixinAccount && formData.userMobile && formData.intro) {
                $.ajax({
                        url: window.location.origin + '/cactus/help/apply/agentEnter',
                        type: 'POST',
                        dataType: 'json',
                        data: formData,
                    })
                    .done(function(json) {
                        if ( json.code == "000000" ) {
                            vm.loading = false;
                            vm.btnTxt = '提交';
                            const data = json.data;
                            mui.toast('提交成功', { duration: 'long', type: 'div' })
                        } else {
                            mui.toast(data.text, { duration: 'long', type: 'div' })
                        }
                    });
            } else {
                vm.loading = false;
                vm.btnTxt = '提交';
                mui.toast('请将信息填写完整', { duration: 'long', type: 'div' })
            }
        }
    }
})