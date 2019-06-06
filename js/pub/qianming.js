
const API = 'http://172.20.188.157:8180/api'
const IMGAPI = 'http://image.haiyimall.com/'
//http://172.20.188.157:8180/api   dbm

const openId = '81cf3f0760f44e7eabf1f5d12a330b49'
const masterSecret = 'cfb92ba7f3bf45148dd62c17814baf29'
const LAST_COUNT=5;   //删除小于等于此值进行自动加载
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
const timestamp = (new Date()).valueOf();
const nonceStr = randomString(20);
const conent = "nonceStr="+nonceStr+"&openId="+openId+"&timestamp="+timestamp+masterSecret;
const signature = CryptoJS.MD5(conent).toString();
const appId = 10008;

