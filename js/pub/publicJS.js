// 用于检查手机系统
function checkSystem(){
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
       //这个是安卓操作系统
       return 0
    }
    if (isIOS) {
　　　　//这个是ios操作系统
        return 1
    }
}
// Toast弹框
function Toast(msg) {
    var duration = 1500;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "width: 60%;min-width: 150px;opacity: 0.7;height: 30px;color: rgb(255, 255, 255);line-height: 30px;text-align: center;border-radius: 5px;position: fixed;top: 40%;left: 20%;z-index: 999999;background: rgb(0, 0, 0);font-size: 12px;";
    document.body.appendChild(m);
    setTimeout(function () {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function () {
            document.body.removeChild(m)
        }, d * 1000);
    }, duration);
}

function data_href(url) {
    $("#href_true").attr("href", url); //传入参数
    document.getElementById("href_true").click(); //模拟点击
  }
    // 将url中得到的中文参数转译
  function getParams(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)"); 
   //如果地址栏中出现中文则进行编码    
    var r = encodeURI(window.location.search).substr(1).match(reg);  
    if (r != null) {  
        //将中文编码的字符重新变成中文
        return decodeURI(unescape(r[2]));  
    }  
    return "";  
  };

  function checkImageUrl(value){
    var url=document.getElementById("url").value;
    var reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    if(!reg.test(url)){
       return IMGAPI + value 
    }else{
       return value 
    }
  }
  // 与原生交互的返回按钮
  function goBackfn(){
    if (checkSystem()) {
      window.webkit.messageHandlers.haiyiJSCallNativeHandler.postMessage({
          "action": "back"
      }); 
  } else {
      window.android.haiyiJSCallNativeHandler('back', '')  
  }
  }
  //  需要指定路径时h5的返回按钮
  function h5backurl(url){
    if (checkSystem()) {
      window.location.href = `./${url}.html?openId=${openId}&masterSecret=${masterSecret}`
    } else {
      data_href(`./${url}?openId=${openId}&masterSecret=${masterSecret}`)
    }
  }