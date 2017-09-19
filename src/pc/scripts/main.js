window.onload = function () {
    (function () {
        var viewportH = window.innerHeight || document.body.offsetHeight || document.documentElement.clientHeight;
        var headerContentH = viewportH - 70;
        var oHeaderContent = document.getElementById('header_content');
        oHeaderContent.style.height = headerContentH + "px";
        window.onresize = function () {
            viewportH = window.innerHeight || document.body.offsetHeight || document.documentElement.clientHeight;
            headerContentH = viewportH - 70;
            oHeaderContent.style.height = headerContentH + "px";
        };
    })();

    // var canvas = document.getElementById('animateBox');
    // if(canvas.getContext){
    //     var ctx = canvas.getContext('2d');
    //     var img = new Image();
    //     img.src = '../images/234.svg';
    //     img.style.
    //     img.onload = function(){
    //         ctx.drawImage(img,0,0);
    //     }
    // }else{
    //     alert("canvas is not supported in your browser!");
    // }
    var svgPic = document.getElementById('svgPic');
    var imgH = svgPic.clientHeight;
    var halfImgH = imgH / 2;
    var imgW = svgPic.clientWidth;
    var halfImgW = imgW / 2;
    svgPic.addEventListener('mouseover', function (event) {
            if (event.offsetX < halfImgW && event.offsetY < halfImgH) {
                svgPic.className = "activeLT";
            } else if (event.offsetX > halfImgW && event.offsetY < halfImgH) {
                svgPic.className = "activeRT";
            }else if (event.offsetX < halfImgW && event.offsetY > halfImgH) {
                svgPic.className = "activeLB";
            }else if (event.offsetX > halfImgW && event.offsetY > halfImgH) {
                svgPic.className = "activeRB";
            }
            
        event.stopPropagation(); event.preventDefault();
    })
svgPic.addEventListener('mouseout', function (event) {
    svgPic.className = null;
})
}