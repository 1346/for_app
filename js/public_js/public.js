/**
 * Created by guang on 2018/10/25.
 */
//(function () {
//    document.addEventListener('DOMContentLoaded', function () {
//        var html = document.documentElement;
//        var windowWidth = html.clientWidth;
//        html.style.fontSize = windowWidth / 7.5 + 'px';
//    }, false);
//})();

document.documentElement.style.fontSize = document.documentElement.clientWidth/7.5 + "px";
window.onresize = function(){ document.documentElement.style.fontSize = document.documentElement.clientWidth/7.5 + "px" }