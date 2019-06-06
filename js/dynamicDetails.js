var dHeight =$(window).height();
var xheader=$('.header_wrap').height();
var xfooter=$('.m-footer').height();
var Height=dHeight-xheader-xfooter-2;
$('.m-content').height(Height+"px");
var channelId=getQueryVariable('newsId');
channelId=358;
var $input= document.getElementById('commentInp')
//     listenKeybord($input);
// 点击留言按钮事件
function commentClick(){
    $('#commentInp').focus();
    $('.m-footer').css('display','none')
    $('.comment-input-div').css('display','block')    
}
// 评论提交按钮事件
$('#commentBtn').click(function(){
    $('.comment-input-div').css('display','none')
    $('.m-footer').css('display','flex')
})
function activeElementScrollIntoView(activeElement,delay){  
var editable = activeElement.getAttribute('contenteditable')  
// 输入框、textarea或富文本获取焦点后没有将该元素滚动到可视区  
if(activeElement.tagName=='INPUT'||activeElement.tagName=='TEXTAREA'||editable===''||editable)
    {
    setTimeout(function()
        {activeElement.scrollIntoView();
        },delay) 
    }
}
// ...
// Android 键盘弹起后操作
activeElementScrollIntoView($input,1000);
function back(){
    window.history.back()
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
           
        },
        success: function (data) {
          console.log(data)
        //   发帖人昵称
          $('.g-name').html(data.obj.nickName)
        //发帖数    
          $('.g-time').html(data.obj.createTime)
        //   标签
        $('.g-fl').html(labelhtml(data.obj.tagName))
        // 帖子标题
        $('.g-title').html(data.obj.newsTitle)
        // 帖子图片
        $('#img-father-div').html(imghtml(data.obj.icon))
        // 头像 
        $('.g-tx img').attr('src',IMGAPI+data.obj.headPic)
        // 内容
        $('.m-info').html(data.obj.summary);
        // 点赞数
        $('#like').html(data.obj.upVoteCount)
        // 评论数
        $('#commit').html(data.obj.commentNum)
        },
        //调用出错执行的函数
        error: function () {
            //请求出错处理         
        }
    });
})
// 留言按钮点击事件 
$('#commentBtn').click(function(){
    
})
// 处理后台传过来的标签
function labelhtml(label){
    var labellist=label.split(",")
    var htmlstr=""
    labellist.forEach(function (item, index) {
        htmlstr+=`
       <div class="fl">
        ${item}
        </div>
    `
    })
    return htmlstr;
}
// 处理后台传过来的img的src
function imghtml(img){   
    var img=img.split(",")
    var htmlstr=""
    img.forEach(function (item, index) {
        htmlstr+=`
        <div class="m-info-img">
        <img src="${IMGAPI+item}" alt="">
        </div> 
    `
    })
    return htmlstr;
}
// 点赞事件
function Clicklike(){
    var num=$('#like').html();
  if($('#likeicon').hasClass('icon-dianzan2')){
    $('#likeicon').removeClass('icon-dianzan2')
    $('#likeicon').addClass('icon-dianzan1')
    $('#like').html(parseInt(num)+1)
  }else{
    $('#likeicon').removeClass('icon-dianzan1')
    $('#likeicon').addClass('icon-dianzan2') 
    $('#like').html(parseInt(num)-1) 
  }
}