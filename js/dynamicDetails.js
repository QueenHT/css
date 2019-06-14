computedScrollHeight();
function computedScrollHeight(){
  var wrapH = $('body').height()- $('.header_wrap').outerHeight()-$('.dynamic-m-footer').outerHeight();
  $('.m-content').css('height',`${wrapH}px`);
  // setTimeout(function(){
  //   $('.m-content').scrollTop(localStorage.getItem('scrollTop'))
  //   localStorage.removeItem('scrollTop')
  // },220)
}
// 用户id
var createOper;
// 创建人id
var channelId=getQueryVariable('busiId');
// 动态id
var $input= document.getElementById('commentInp')
//获取动态内容
$(function(){
    $.ajax({
        //提交数据的类型 POST GET
        crossDomain: true,
        type: "GET",
        jsonp: "callback",
        jsonpCallback: "successCallback",
        //提交的网址
        url: API + `/dynamic/queryDynamicById.shtml?dynamicId=${channelId}&dynamicType=1`,
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
          console.log(data)   
          // 创建人id
          createOper=data.obj.createOper
        //   发帖人昵称
          $('.g-name').html(data.obj.nickName)
        //发帖时间    
          $('.g-time').html(data.obj.createTime)
          judgeDate(data.obj.createTime)
          // 以一天为标准判断是不是新发布的帖子
        //   标签
        $('.g-fl').html(labelhtml(data.obj.subTitle))
        // 帖子标题
        $('.g-title').html(data.obj.newsTitle)
        // 帖子图片
       imghtml(data.obj.iconurls)
        // 头像 
        $('.g-tx img').attr('src',IMGAPI+data.obj.headPic)
        // 内容
        $('.m-info').html(data.obj.summary);
        // 点赞数
        $('#like').html(data.obj.upVoteCount)
        // 评论数
        $('#transpond').html(data.obj.pvNum)
        // 转发数
        $('#commit').html(data.obj.commentNum)
        if(data.obj.isVote==="1"){
          $('#likeicon').removeClass('icon-dianzan2')
          $('#likeicon').addClass('icon-dianzan1')
        }
        if(data.obj.isFavorite==="0"){
          $('.g-btn').css('display','block')
          $('.g-del-btn').css('display','none')
        }else{
          $('.g-btn').css('display','none')
          $('.g-del-btn').css('display','block')
        }
         // 如果当前帖子是自己发布的  控制关注和收藏按钮不显示
        if(data.obj.userId!==createOper){
            $('#transponddiv').css('display','block')
            $('#favoriteDiv').css('display','block')           
        }
        },
        //调用出错执行的函数
        error: function () {
            //请求出错处理         
        }
    });
    $.ajax({
      //提交数据的类型 POST GET
      crossDomain: true,
      type: "GET",
      jsonp: "callback",
      jsonpCallback: "successCallback",
      //提交的网址
      url: API + `/comment/queryCommentList?busiType=1&busiId=${channelId}`,
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
        var length=data.list.length;
          var listhtml=`  <div class="g-pl">
          评论<span class="pl-num">(${length})</span>
      </div>`;
        data.list.forEach(function (item, index) {
          listhtml+=`
          <div class="m-pl-info">
          <div class="g-pl-img">
              <img src="${IMGAPI+item.headPic}"  onerror="this.src='../img/dbm_images/logo.png'" alt="">
          </div>
          <div class="g-pl-content-div">
              <div class="g-pl-name-div">
                    <div class="g-pl-name">${item.nickName} :</div>
                    <div class="g-pl-content">                        
                          ${item.content}                    
                    </div>         
              </div>           
              <div class="g-pl-time">
                 ${item.commentDate}
              </div>                     
          </div>
        
      </div>
          `
       })
       $('.m-pl-div').html(listhtml)
      },
      //调用出错执行的函数
      error: function () {
          //请求出错处理         
      }
  });
})
// 点击留言按钮事件
$('#commentAfter').focus(function(){
  $('.dynamic-m-footer').css('display','none');
  $('.comment-input-div').css('display','block');
  $('#commentAfter').blur();
  $('#commentInp').focus();   
})
//  留言取消按钮事件
$('#discomment').click(function(){
  $('.comment-input-div').css('display','none')
  $('.dynamic-m-footer').css('display','flex')
  $('#commentAfter').val($('#comment').val())
  $('#commentInp').blur();
})
// 点击留言框以外的区域时 关闭留言框区域
$('.m-content').click(function(){
  if($('.comment-input-div').css('display')=='block'){
    $('.comment-input-div').css('display','none')
    $('.dynamic-m-footer').css('display','flex')
    $('#commentAfter').val($('#comment').val());
    $('#commentInp').blur();
  }
})
// 留言按钮点击事件 
$('#commentBtn').click(function(){
  var commentContent=$("#comment").val()
    if(commentContent.length==0){
      Toast('请输入留言内容')
    }else if(commentContent.match(/^\s+$/g)){
      Toast('留言内容不允许为空格')
    }else{
      $.ajax({
        //提交数据的类型 POST GET
        crossDomain: true,
        type: "GET",
        jsonp: "callback",
        jsonpCallback: "successCallback",
        //提交的网址
        url: API + `/comment/createComment.shtml?busiType=1&busiId=${channelId}&content=${commentContent}`,
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
          //  localStorage.setItem('scrollTop',$('.m-content').scrollTop()+$('.m-pl-info').outerHeight())
            $('.comment-input-div').css('display','none')
          $('.dynamic-m-footer').css('display','flex')
          setTimeout(function(){
            window.history.go(0)
          },1200) 
          
         }else{
          Toast('留言失败')
         }
        
        },
        //调用出错执行的函数
        error: function () {
            //请求出错处理   
            Toast('留言失败')      
        }
    });
    }
})
// 处理后台传过来的标签
function labelhtml(label){
  var htmlstr=""
  if(label){
    var labellist=label.split(",")    
    labellist.forEach(function (item, index) {
        htmlstr+=`
       <div class="fl">
        ${item}
        </div>
    `
    })
    return htmlstr;
}
}
// 处理后台传过来的img的src
function imghtml(img){   
   if(img){
    var img=img.split(",")
    var htmlstr=""
    img.forEach(function (item, index) {
      htmlstr+=`
      <div class="m-info-img thumbs">
                         <a href="${IMGAPI+item}">
                             <img src="${IMGAPI+item}"alt="" onerror="this.src='../img/dbm_images/logo.png'">
                         </a>
                      </div>`
     })
     $('#img-father-div').html(htmlstr)
     $('.thumbs a').touchTouch();
     //阻止图片查看
     $('.thumbs a').on('click',function(e){
     e.stopPropagation();
     return
     })
   }
}
// 点赞事件
function Clicklike(){
    var num=$('#like').html();
  if($('#likeicon').hasClass('icon-dianzan2')){
    $('#likeicon').removeClass('icon-dianzan2')
    $('#likeicon').addClass('icon-dianzan1')
    $('#like').html(parseInt(num)+1)
    likeAjax()
  }else{
    $('#likeicon').removeClass('icon-dianzan1')
    $('#likeicon').addClass('icon-dianzan2') 
    $('#like').html(parseInt(num)-1) 
    dislikeAjax()
  }
 
  
}
// 取消点赞
function  dislikeAjax(){
  $.ajax({
    //提交数据的类型 POST GET
    crossDomain: true,
    type: "GET",
    jsonp: "callback",
    jsonpCallback: "successCallback",
    //提交的网址
    url: API + `/comment/deleteVoteUp.shtml?busiType=1&busiId=${channelId}`,
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
    },
    //调用出错执行的函数
    error: function () {
        //请求出错处理         
    }
});
}
function likeAjax(){
  $.ajax({
    //提交数据的类型 POST GET
    crossDomain: true,
    type: "GET",
    jsonp: "callback",
    jsonpCallback: "successCallback",
    //提交的网址
    url: API + `/comment/createVoteUp.shtml?busiType=1&busiId=${channelId}`,
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
    },
    //调用出错执行的函数
    error: function () {
        //请求出错处理         
    }
});
}
// 日期转时间戳
function transdate(endTime){
  var date = new Date();
  date.setFullYear(endTime.substring(0, 4));
  date.setMonth(endTime.substring(5, 7) - 1);
  date.setDate(endTime.substring(8, 10));
  date.setHours(endTime.substring(11, 13));
  date.setMinutes(endTime.substring(14, 16));
  date.setSeconds(endTime.substring(17, 19));
  return Date.parse(date) / 1000;
}
// p判断是否是新发布 已一天的时长为标准
function judgeDate(oldADte){
var times = Date.parse(new Date());
var old=transdate(oldADte);
var day=(times-old)/(1000*60*60*24);
// 判断是不是新发布  以一天的时间为标准
var judgeTime=1;
  if(day>judgeTime){
      $('.g-new').css('display',"none")
  }
}
// 关注
function Favorite(){
  $.ajax({
    //提交数据的类型 POST GET
    crossDomain: true,
    type: "GET",
    jsonp: "callback",
    jsonpCallback: "successCallback",
    //提交的网址
    url: API + `/comment/createFavorite.shtml?companyId=${createOper}`,
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
       $('.g-btn').css('display','none')
       $('.g-del-btn').css('display','block')
     }
    },
    //调用出错执行的函数
    error: function () {
      Toast('关注失败')        
    }
});
}
//取消关注
function delFavorite(){
  $.ajax({
    //提交数据的类型 POST GET
    crossDomain: true,
    type: "GET",
    jsonp: "callback",
    jsonpCallback: "successCallback",
    //提交的网址
    url: API + `/comment/deleteFavorite.shtml?companyId=${createOper}`,
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
        $('.g-btn').css('display','block')
        $('.g-del-btn').css('display','none')
      }
    },
    //调用出错执行的函数
    error: function () {
      Toast('取消关注失败')       
    }
});
}
// 转发按钮点击事件
function transpond(){
  if (checkSystem()) {
    window.location.href = `./ForwardDynamic.html?openId=${openId}&masterSecret=${masterSecret}&busiId=${channelId}`
  } else {
    data_href(`./ForwardDynamic.html?openId=${openId}&masterSecret=${masterSecret}&busiId=${channelId}`)
  }

}
function getBackHref(){
  var from=getQueryVariable('from')
  var h5from=getQueryVariable('h5from')
  if(from){
    goBackfn()
  }else if(h5from){
    h5backurl(h5from)
  }else{
    window.history.go(-1)  
  }
  
}