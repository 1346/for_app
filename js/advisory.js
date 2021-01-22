var vm = new Vue({
    el: "#main",
    data: {
        detail: undefined
    },
    created: function () {
      this.getDetail();
    },
    methods: {
        getDetail: function() {
            const id = getLocationHrefPara2("id").split('?')[0];
            $.ajax({
                url: window.location.origin +
                    '/cactus/train/web/ask?id=' + id,
                type: 'GET',
                dataType: 'json',
                data: {}
            })
                .done(function(json) {
                    if ( json.code == "000000" ) {
                        vm.detail = json.data;
                    } else {
                        showWrong(json.text);
                    }
                });
        }
    }
});
