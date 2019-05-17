// jQuery.support.cors = true;
const API = 'http://172.20.188.157:8180/api'

//http://img.hapem.cn/
// const IMGAPI = 'https://qiniu.apetm.com'

// http://58.57.31.10:8804/api
// http://172.20.188.191:8111/api
// https://sjtjc.sijitianjian.com/
var openId = 'cc4e2be9ed5446d88e7b78d4da336328'
var masterSecret = '4abe15a67a8242fabc48e79cc78bc82b'
var appId=10008;
// getUserSecret()
function getUserSecret(){
    openId = getQueryVariable('openId');
    masterSecret = getQueryVariable('masterSecret');
}
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
function randomString(len)
 {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
var timestamp = (new Date()).valueOf();
var nonceStr = randomString(20);
var conent = "nonceStr="+nonceStr+"&openId="+openId+"&timestamp="+timestamp+masterSecret;
var signature = CryptoJS.MD5(conent).toString()

