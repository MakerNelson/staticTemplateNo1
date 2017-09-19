
window.onload = function(){
    (function(){
    var viewportH = window.innerHeight || document.body.offsetHeight || document.documentElement.clientHeight;
    var headerContentH = viewportH - 70;
    var oHeaderContent = document.getElementById('header_content');
    oHeaderContent.style.height = headerContentH + "px";
    window.onresize = function(){
        viewportH = window.innerHeight || document.body.offsetHeight || document.documentElement.clientHeight;
        headerContentH = viewportH - 70;
        oHeaderContent.style.height = headerContentH + "px";
    };
    })();


}