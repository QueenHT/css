var Communityid=0;
var name=''
// 获取url传过来的社区名和id并渲染
getnameAndId();
function focusTextarea() {
    $('#introTxt').css('display','none')
    var temp = $('#textArea');
    temp.focus();
}
function textareablur(value){
    if(value.length == 0 || value.match(/^\s+$/g)){
      $('#introTxt').css('display','inline')
    
}else{
  $('#introTxt').css('display','none')
}
}
function longsize(v){
    if(v.length>1000){
        $('#g-long-text').css('color','red');
    }else{
        $('#g-long-text').css('color','#bfbfbf');
    }
}

//点击返回事件
function back(){
    
    window.history.go(-1)
  
}
// 获取url传过来的社区名和id并渲染
function getnameAndId(){
 name=getParams('joinName');
 console.log(name);
 console.log(getQueryVariable('joinName'))
    Communityid=getQueryVariable('channelId');
    $('.fl-tz-tex').html(name)
}
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
$('.g-button').click(function(){
   var val=$('#textArea').val(); 

   if(val.length == 0 || val.match(/^\s+$/g)){
       Toast('请输入申请理由')
   }else{
    joincommuntiy()
   }
})
// 申请加入社区接口调试
function joincommuntiy(){
    $.ajax({
        //提交数据的类型 POST GET
        crossDomain: true,
        type: "GET",
        jsonp: "callback",
        jsonpCallback: "successCallback",
        //提交的网址
        url: API + `/community/setCommunityExamineMessage.shtml?communityId=${Communityid}&applicationReason=${name}`,
        //提交的数据
        data: {},
        headers: {
            'nonceStr': nonceStr,
            'openId': openId,
            'signature': signature,
            'timestamp': timestamp,
            'appId':appId
        },
        //成功返回之后调用的函数
        success: function (data) {
            if(data.status==0){  
                $.hideLoading()             
                Toast('申请成功')
    
            }else{
                $.hideLoading()
                Toast('申请失败')
            }              
        },
        //调用出错执行的函数
        error: function () {
            //请求出错处理
        }
    }); 
}