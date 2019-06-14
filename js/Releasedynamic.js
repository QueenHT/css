// 获取option类型
ueryType()
setHeight();
var size=0;
var form=new Object();
var from={
  newsTitle:"",
  // 帖子标题
  subTitle:"",
  // 帖子标签
  newsType:0,
  // 社区id
  targetType:1,
  // 类型
  summary:"",
  // 内容
  icon:""
  // 图片
  };
function setHeight(){
  // 使用go(-1)时会有数据缓存清除数据 
  $('#textArea').val('');
    imgList=[];
    $('input').val('')
  var dHeight =$(window).height();
  var xheader=$('.header_wrap').height();
  var Height=dHeight-xheader;
  $('.m-content').height(Height+'px')
  }

var imgList=[];
var imgstr = "";
var typelist=[];
// 社区热门类型列表
var typevalue='';
// 选中的社区热门类型
var icon=[];
// 用来保存图片路径的数组
var typelistAll=[];
// 社区热门类型列表
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
function clickMenu1() {  
   $("#upload_file").click();
  }
 function fileDel(index) {
    imgList.splice(index, 1);  
    imghtml()
  }
function imghtml(){  
    var htmlstr='';
    for(var i=0;i<imgList.length;i++){
        htmlstr+= `
         <div class="img-upload">
         <div class="img-show"  style="background-image: url(`+imgList[i].src+`)">
            
           <p class="img-close"  >
             <img style="width:.3rem;height:.3rem;"  src="../img/del.png"  onclick="fileDel(`+i+`)" alt>
           </p>
         </div>
       </div>`
     }
    if(imgList.length>=6){
       $('#m-img').html(htmlstr);
    }else{
            htmlstr+=`  <div  class="fujian" id="fujian" onclick="clickMenu1()">
            <div style="width:1.6rem;height:1.6rem;margin:0 auto;text-align:center;">
              <img style="width:40%;padding-top:0.6rem;" src="../img/add.png" alt>
            </div>
              <div style="width:100%;height:.6rem;text-align:center">照片</div>           
          </div>`
          $('#m-img').html(htmlstr);
    }
}
function labelfn(id,val){
  // 得到当前是第几个输入框
  var num=parseInt(id.charAt(id.length-1))+1
  if(val){
    // 判断输入的内容
    //去除前后的空格
    var strs=val.replace(/(^\s+)|(\s+$)/g, "");
    //是否为长度为小于2的汉字
    if(strs.match(/^[\u4e00-\u9fa5]{1,2}$/)|| strs.match(/^[a-zA-Z]{2,10}$/)){
  }else{
      Toast('标签为两位数汉字或两个英文单词')
      event.target.value='';
    }
  }else{
    Toast('您还未输入标签内容')
  }
}

//事件返回
function back(){
  if (checkSystem()) {
    window.webkit.messageHandlers.haiyiJSCallNativeHandler.postMessage({
        "action": "back"
    }); 
} else {
    window.android.haiyiJSCallNativeHandler('back', '')  
}
}
// 点击发布按钮


$('.m-button-div').click(function(){
 
  // 获取当前选中的类型的code值
  judgeType($('#picker').val())
    // 判断帖子标题是否为空
  from.newsTitle=$('#titleInp').val();
  from.summary=$('#textArea').val(); 
  jointLabel()
  if(from.newsTitle.length == 0 || from.newsTitle.match(/^\s+$/g)){
    Toast('请填写动态标题')
  }else if(!from.newsType){
    Toast('请选择类型')
  }else if(from.summary.length == 0 || from.summary.match(/^\s+$/g)){
    Toast('请填写动态内容')
  }else{
          manageimgurl()

  }
})

// 发布时请求的ajax
function release(){
 
  $.ajax({
    //提交数据的类型 POST GET
    crossDomain: true,
    type: "GET",
    jsonp: "callback",
    jsonpCallback: "successCallback",
    //提交的网址
    url: API + `/dynamic/createDynamic.shtml`,
    //提交的数据
    data: {
      "newsTitle":from.newsTitle,
      "subTitle":from.subTitle,
      "newsType":from.newsType,
      "targetType":from.targetType,
      "summary":from.summary,
      "icon":JSON.stringify(icon),
    },
    //成功返回之后调用的函数
    headers: {
      'nonceStr': nonceStr,
       'openId': openId,
      'signature': signature,
      'timestamp': timestamp,
        'appId': appId,
    },
    success: function (data) {
      $.hideLoading()  
      if(data.status===0){
        $.hideLoading()  
        Toast('发布成功')        
        localStorage.clear();
        var dynamicDetailsID=parseInt(data.msg)
       setTimeout(function(){
        if (checkSystem()) {
          window.location.href = `./dynamicDetails.html?openId=${openId}&masterSecret=${masterSecret}&busiId=${dynamicDetailsID}&from=Releasedynamic`
        } else {
          data_href(`./dynamicDetails.html?openId=${openId}&masterSecret=${masterSecret}&busiId=${dynamicDetailsID}&from=Releasedynamic`)
        }
       },500)
      
      }else{
        $.hideLoading()  
        Toast('发布失败')
      }
    },
    //调用出错执行的函数
    error: function () {
      $.hideLoading()  
        //请求出错处理
        Toast('发布失败')
     
    }
});
}

$("#picker").picker({
  title: "",
  cols: [{
      textAlign: 'center',
      values:typelist
  }]
});
$("#picker").click(function(){
  $('#selectSpan').css('display','none')
})
function ueryType(){
  $.ajax({
      //提交数据的类型 POST GET
      crossDomain: true,
      type: "GET",
      jsonp: "callback",
      jsonpCallback: "successCallback",
      //提交的网址
      url: API + `/community/communityClassification.shtml`,
      //提交的数据
      data: {},
      //成功返回之后调用的函数
      headers: {
          'appId': appId,
      },
      success: function (data) { 
        typelistAll=data.list;             
         data.list.forEach(function (item,index) {
          typelist.push(item.typeName)
         })         
      },
      //调用出错执行的函数
      error: function () {
          //请求出错处理         
      }
  });
}
function manageimgurl(){
  $.showLoading('正在提交')
  var formData = new FormData()
             for(var i = 0; i < imgList.length; i++) {           
                formData.append('file', imgList[i]);
           }
  $.ajax({
    //提交数据的类型 POST GET
    crossDomain: true,
    type: "POST",
    jsonp: "callback",
    jsonpCallback: "successCallback",
    processData: false,   //必须
    contentType: false,   //必须  
    //提交的网址
    url: API + `/upload.shtml`,
    //提交的数据
    data:formData,
    //成功返回之后调用的函数
    success: function (data) {
      icon=[];
      var list=data.list;
      for(var i=0;i<list.length;i++){
        icon.push({ path:list[i].newName})
      }
      release()
    },
    //调用出错执行的函数
    error: function () {
      $.hideLoading()  
      Toast('发布失败')
    }
});
}
// 获取当前选中的类型的code值
function  judgeType(val){
  typelistAll.forEach(function (item,index) {
      if(item.typeName==val){
        from.newsType=item.incode
      }     
     })     
}
// 处理标签字符串
function jointLabel(){  
  from.subTitle=''
  $('.g-bq-div input').each(function(){
    if($(this).val()){
      from.subTitle+=$(this).val()+',';
    }  
    
  });
  from.subTitle=(from.subTitle.substring(from.subTitle.length-1)==',')?from.subTitle.substring(0,from.subTitle.length-1):from.subTitle;
}
// picker时不调起软键盘
$('#picker').click(function () {
  document.activeElement.blur();
})