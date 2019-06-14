var channelId=getQueryVariable('busiId');
setHeight();
function setHeight(){
  var dHeight =$(window).height();
  var xheader=$('.header_wrap').height();
  var Height=dHeight-xheader;
  $('.m-content').height(Height+'px')
//   当显示器为ipad 的时候去掉定位 防止button与动态图片重叠
  if(dHeight>900){
      $(".m-button-div").css('position','static')
  }
  }
  /*这个函数是为了保证浏览者点击introTextarea这层div时，使焦点自动移动到textarea*/
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
//获取动态内容
$(function(){
  $.ajax({
      //提交数据的类型 POST GET
      crossDomain: true,
      type: "GET",
      jsonp: "callback",
      jsonpCallback: "successCallback",
      //提交的网址
      url: API + `/dynamic/queryDynamicById.shtml?dynamicId=${channelId}`,
      //提交的数据,
      //成功返回之后调用的函数
      headers: {
        'nonceStr': nonceStr,
         'openId': openId,
        'signature': signature,
        'timestamp': timestamp,
        'appId':appId
         
      },
      success: function (data) {
        // 创建人id
        createOper=data.obj.createOper
      //   动态人昵称
        $('.g-name').html(data.obj.nickName)
        // 创建人头像
        $('.g-tx img').attr('src',IMGAPI+data.obj.headPic)
      //动态时间   
        $('.g-time').html(data.obj.createTime)
        // 动态内容
        $('.content').html(data.obj.summary)
      $('.g-title').html(data.obj.newsTitle)
      // 帖子图片
          imghtml(data.obj.icon)
      },
      //调用出错执行的函数
      error: function () {
          //请求出错处理         
      }
  });
})
function imghtml(img){   
  var img=img.split(",")
  var htmlstr=""
  img.forEach(function (item, index) {
   if(index==0){
      $('.g-img img').attr('src',IMGAPI+item);
   }
   })
}

function forward(){
  var summary=$('#textArea').val();
  $.ajax({
    //提交数据的类型 POST GET
    crossDomain: true,
    type: "GET",
    jsonp: "callback",
    jsonpCallback: "successCallback",
    //提交的网址
    url: API + `/dynamic/createTranspondDynamic.shtml?newsId=${channelId}&summary=${summary}`,
    //提交的数据,
    //成功返回之后调用的函数
    headers: {
      'nonceStr': nonceStr,
       'openId': openId,
      'signature': signature,
      'timestamp': timestamp,
      'appId':appId
       
    },
    success: function (data) {
      if(data.status==0){
        Toast('转发成功')
        setTimeout(function(){
            window.history.go(-1)
        },1000)
      }
    },
    error: function () {
        //请求出错处理         
    }
});
}
function back(){
  var from = getQueryVariable('from')  
    if(from){
      goBackfn()
    }else{
     window.history.go(-1)  
    }
}