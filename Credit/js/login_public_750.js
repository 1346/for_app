
/*花田小憩web移动端专用工具包（以登录为主）*/

/* 对应的UI是 width:750px;*/

/*给需要触发 登录框的按钮的 onclick = loginShow()即可 */

/*登录成功后会增加两个 cookie:user(用户ID) 和 mobile(登录手机号) 以及一个key为HTXQToken的localStorage */

/*成功后需要进行 后续回调（比如验证购物车数量） 请自行封装一个函数loginSuccessAction();*/

/*工具函数：getLocationHrefPara(search参数),deleLocationHrefPara(),c3loading,showWrong,judegEquipment(weixin/ios/android),WXajax => weixinShare/weixinNoShare,getCookie和一个包含浏览器信息的browser对象*/
var loginScrollTop = 0;
$("head").append('<link rel="stylesheet" type="text/css" href="https://htxq.oss-cn-beijing.aliyuncs.com/resources/css/login_public_750.css">');
function loginShow(){
	loginScrollTop = $(window).scrollTop();
	$("video").hide();
	$("body,html").css({				//ios11bug新加
		// position: 'fixed',
		// width: '100%',
		height:window.innerHeight + "px"
		// 'overflow-y':'hidden'
	});
	$("body,html").addClass('fixed100');
	
	var orFixed = browser.versions.android ? "fixed" : "absolute";
	var dom = 
		"<section class='login2'>" +
			"<section class='login_div' style='position:" + orFixed + "'  id='login_div'>" +
				"<div class='login_title'>登录</div>" +
				"<div class='login_close' onclick='deleLogin()'></div>" +
				"<div class='login_form'>" +
					"<input type='tel' maxlength='11' id='userNumber' class='login_text' placeholder='请输入手机号' oninput='length11(this)'>" +
				"</div>" +
				"<div class='login_next' id='login_next' onclick='loginNextOpear(this)'>下一步</div>" +
			"</section>" +
			"<section class='login_div' style='display:none;position:" + orFixed + "' id='login_div2'>" +
				"<div class='login_title'>请输入验证码</div>" +
				"<div class='login_close' onclick='deleLogin()'></div>" +
				"<div class='login_back' onclick='loginBack()'></div>" +
				"<div class='login_form login_form2'>" +
					"<span class='login_mobile' id='login_mobile'></span>" +
					"<input type='button' class='login_daojishi' onclick='getCode()' id='login_daojishi' value='重新发送'>" +
				"</div>" +
				"<div class='login_form login_form3'>" +
					"<input type='tel' maxlength='6' id='userCode' class='login_text' placeholder='请输入验证码' oninput='loginSuccess(this)'>" +
				"</div>" +
			"</section>" +
			"<div class='goods_shadow_login' style='display: block;'></div>" +
		"</section>";
	$("body").append(dom);
	// document.getElementById('userNumber').focus();
};
function deleLogin(){
	$("video").show();
	$(".goods_shadow_login,.login2").remove();
	$("body,html").css({					//ios11bug新加
		// position: 'relative',
		height:"auto"
		// 'overflow-y':'auto'
	});
	$("body,html").removeClass('fixed100');
	$(window).scrollTop(loginScrollTop);		//ios11bug新加
};
var loginTime = 60;
var loginTimer = null;
function duanxindaojishi(){
	clearInterval(loginTimer);
	$("#login_daojishi").val(loginTime).addClass("mmm");
	loginTimer = setInterval(function(){
		if (loginTime>1) {
			loginTime--;
			$("#login_daojishi").val(loginTime).addClass("mmm");
		}else{
			loginTime = 60;
			$("#login_daojishi").val("重新发送").removeClass('mmm');
			clearInterval(loginTimer);
		};
	},1000);
};
function getCode(){					//获取手机验证码
	if ( !$("#login_daojishi").hasClass('mmm') ) {
		var phoneNumber = $("#userNumber").val();
		$.ajax({
            // url: 'http://test.api.htxq.net' + "/cactus/verifycode/login?mobile=" + phoneNumber + "&cc=86&mcc=460&platform=1",
            url: window.location.protocol + "//" + window.location.host + "/cactus/verifycode/login?mobile=" + phoneNumber + "&cc=86&mcc=460&platform=1",
		    type: 'POST',
			dataType: 'json',
    	    contentType: "application/json; charset=utf-8",
			data: {},
		    success: function (json) {
		    	console.log(json);
		    	if ( json.code == "000000" ) {
			    	showWrong("发送成功，请稍等");
			    	duanxindaojishi();
		    	}else{
			    	showWrong(json.text);
		    	}
		    },
		    error: function (xhr, textStatus, errorThrown) {
		        console.log("服务器请求失败");
		        console.log(xhr);
		        console.log(textStatus);
		        console.log(errorThrown);

		    }
		});
	}
};
function loginSuccess(thisO){			//登录
	var code 	= $(thisO).val();
	var mobile	= $("#userNumber").val();
	if( code.length == 6 ){
		var obj = {
			"vc":code,
			"cc": "86",
			"mcc": "460",
			"jpc": "",
			"market": "",
			"terminal": "WEB"
		};
		$.ajax({
		    type: 'POST',
		    async: true,
            url: window.location.protocol + "//" + window.location.host + "/cactus/customer/login?mobile=" + mobile + "&platform=1",
            // url: 'http://test.api.htxq.net' + "/cactus/customer/login?mobile=" + mobile + "&platform=1",
		    dataType : "json",
    	    contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(obj),
		    beforeSend: function () {
		    	c3loading( true );
		    },
		    success: function (json) {
		    	console.log(json);
		    	if ( json.code == "000000" ) {
			    	userId 	= getCookie("user");

			    	try {
					   	localStorage.setItem('HTXQToken',json.data.token);
					} catch (e) {
					    // alert("请关闭无痕浏览重新购买")
					}
			    	
			    	token = json.data.token;
			    	showWrong("登录成功");
			    	deleLogin();
			    	if (window.loginSuccessAction) {loginSuccessAction()};
		    	}else{
			    	showWrong(json.text);
		    	};
		    },
		    error: function (xhr, textStatus, errorThrown) {
		        console.log("服务器请求失败");
		        deleC3loadding();
		        console.log(xhr);
		        console.log(textStatus);
		        console.log(errorThrown);
		    },
		    complete: function () {
		    	deleC3loadding();
		    },
		});
	}else{
		return false;
	}
};
function length11(thisO){
	$("#login_mobile").text( $(thisO).val() );
	if( /^1[3456789]\d{9}$/.test( $(thisO).val() ) ){
		$("#login_next").addClass('login_next_active');
	}else{
		$("#login_next").removeClass('login_next_active');
	}
};
function loginNextOpear(thisO){
	if ( $(thisO).hasClass('login_next_active') ) {
		$("#login_daojishi").trigger("click");
		$("#login_div").hide();
		$("#login_div2").show();
		document.getElementById('userCode').focus();
	}
};
function loginBack(){
	$("#login_div").show();	
	$("#login_div2").hide();
};
function getCookie(cname){
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) return c.substring(name.length,c.length);
	};
	return "";
};
function c3loading(bool){
	if ( bool === true ) {
		var windowShadow = '<div class="window_shadow"></div><div class="cell"><span class="flower-loader">Loading…</span></div>';
		$("body").append(windowShadow);
		$("html,body").addClass('body100');
	}
};
function deleC3loadding(){
	$(".window_shadow").remove();
	$(".cell").remove();
	$("html,body").removeClass('body100');
}
function showWrong(word,fnEnd){
	$(".wrong_box").remove();
	var at = "<div class='wrong_box'></div>";
	$("body").append(at);
	$(".wrong_box").text(word);
	$(".wrong_box").stop(true,true).fadeIn('400', function() {
		hideWrong();
		if (fnEnd) {fnEnd()}
	});
};
function hideWrong(){
	$(".wrong_box").fadeOut(1600,function(){
		$(this).remove();
	});
};
function getLocationHrefPara(paraName){	//获取location里的带名参数
	var reg = new RegExp("(^|&)" + paraName + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
};
function getLocationHrefPara2(paraName){ //获取带名参数2(解决上面那个中文乱码)
    var args = {};
    var query = location.search.substring(1);
    var pairs = query.split("&");
    for(var i = 0;i < pairs.length; i++){
        var pos = pairs[i].indexOf("=");
        if(pos == -1) continue;
        var name = pairs[i].substring(0, pos);
        var value = pairs[i].substring(pos + 1);
        value = decodeURIComponent(value);
        args[name] = value;
    }
    return args[paraName];
};

var browser = {
	versions: function () {
       	var u = navigator.userAgent, app = navigator.appVersion;
       	return {         										//移动终端浏览器版本信息
           	trident: u.indexOf('Trident') > -1, 				//IE内核
           	presto: u.indexOf('Presto') > -1, 					//opera内核
           	webKit: u.indexOf('AppleWebKit') > -1, 				//苹果、谷歌内核
           	gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
           	mobile: !!u.match(/AppleWebKit.*Mobile.*/), 		//是否为移动终端
           	ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), 	//ios终端
           	android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
           	iPhone: u.indexOf('iPhone') > -1, 					//是否为iPhone或者QQHD浏览器
           	iPad: u.indexOf('iPad') > -1, 						//是否iPad
           	webApp: u.indexOf('Safari') == -1, 					//是否web应该程序，没有头部与底部
           	wx: Boolean( u.match(/MicroMessenger/i) ),			//微信
           	weibo:Boolean( u.match(/WeiBo/i) ),					//微博
           	qq: Boolean(u.match(/QQ/i)),						//qq浏览器（qq和安卓的微信都是qq浏览器）
           	qqWebview: Boolean(u.match(/QQ/i) && !u.match(/MicroMessenger/i) )	//qq的webview浏览器
       	};
   	}(),
   	language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
function judegEquipment(){
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {
		return "weixin";
	}else if (browser.versions.ios) {
		return "ios";
	}else if (browser.versions.android){
		return "android";
	}else{
		return "000"
	}
};

// ua.match(/MicroMessenger/i) == "micromessenger"　|| ua.match(/WeiBo/i) == "weibo" || ua.match(/QQ/i) == "qq" 


function WXajax(){ 						//微信config接口注入权限验证配置
	$.ajax({
	    type: 'GET',
	    async: true,
		url: window.location.protocol + "//" + window.location.host + '/cactus/weiXin/weiXinSignature?url=' + encodeURIComponent(location.href.split('#')[0]),
	    dataType : "json",
	    timeout : 8000, //超时时间设置，单位毫秒
        data: {},
	    success: function (json) {
			wx.config({
			    debug: false,
			    appId: 'wx8f420ac9c4b08502', 			// 必填，公众号的唯一标识
			    timestamp: 	json.data.timestamp, 		// 必填，生成签名的时间戳
			    nonceStr: 	json.data.noncestr, 		// 必填，生成签名的随机串
			    signature: 	json.data.signature,		// 必填，签名，见附录1
			    jsApiList:
                    ["onMenuShareTimeline",
                    "onMenuShareAppMessage",
                    "onMenuShareQQ",
                    "onMenuShareQZone",
                    "hideOptionMenu",
                    "showOptionMenu",
                    "chooseWXPay"]
			    										// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});	
	    },
	    error: function (xhr, textStatus, errorThrown) {
	        console.log("服务器请求失败");
	    }
	})
};
if (window.wx) {WXajax()};
function weixinShare(title,link,imgUrl,desc,successFn,cancelFn){ //此函数需要放在 wx.ready(function(){ })里
    // console.log(arguments)
	wx.onMenuShareTimeline({	//朋友圈
	    title: title , 
	    link: link ,
	    imgUrl: imgUrl,
	    success: function () { 
	    	if (successFn) {successFn()}
	    },
	    cancel: function () { 
	    	if (cancelFn) {cancelFn()}
	    }
	});
	wx.onMenuShareAppMessage({	//发送给朋友
	    title: title, 
	    desc: desc , 
	    link: link ,
	    imgUrl: imgUrl,
	    type: 'link', 
	    dataUrl: '',
	    success: function () { 
	    	if (successFn) {successFn()}
	    },
	    cancel: function () { 
	    	if (cancelFn) {cancelFn()}
	    }
	});
}
function weixinNoShare(){	//此函数也需要放在 wx.ready(function(){ })里
	wx.hideOptionMenu();
}
function weixinLogin(oppositeId){			//进行微信登录授权
	var nowHref = window.location.href;
	var weixinHref = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8f420ac9c4b08502&redirect_uri=https://api.htxq.net/h5/redirect.html?page=" + encodeURIComponent(nowHref) + "&response_type=code&scope=snsapi_base&state=" + oppositeId + "#wechat_redirect";
	window.location.href = weixinHref;
};
function getWXUserInformation(userCode){	//进行微信登录授权
	$.ajax({
	    type: 'GET',
	    async: true,
		url:location.protocol + "//" + location.host + '/cactus/customer/ppopenid?code=' + userCode,
	    dataType : "json",
        data: {},
	    success: function (json) {
	    	console.log(json);
	    	if ( json.code == "000000") {
	    		sessionStorage.setItem( "HTXQopenId", json.data.openId);
	    		openId = json.data.openId;
	    	}else {
	    		showWrong( json.text );
	    	};
			console.log("微信接口获取openId");
	    },
	    complete: function () {
	    },
	    error: function (xhr, textStatus, errorThrown) {
	        showWrong("服务器请求失败");
	    }
	})
};
function deleLocationHrefPara(name){		//去掉链接中的某个参数并返回新的链接
    var loca = window.location;
    var baseUrl = loca.origin + loca.pathname + "?";
    var query = loca.search.substr(1);
    if (query.indexOf(name)>-1) {
        var obj = {}
        var arr = query.split("&");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            obj[arr[i][0]] = arr[i][1];
        };
        delete obj[name];
        var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
        return url
    }else{
        return window.location.href;
    }
}
function deleCookie(){
    $.ajax({
        url: '/cactus/help/clearCookie?domain=htxq.net&path=/&cookie=user,mobile',
        type: 'GET',
    })
    .done(function() {
        console.log("success");
    })
    .fail(function() {
        console.log("error");
    })
}