
var name=localStorage.getItem('communityname')
var nameid=localStorage.getItem('communityId')
var size=0;
var from={
  newsTitle:"",
  // 帖子标题
  subTitle:"",
  // 帖子标签
  channelId:0,
  // 社区id
  targetType:2,
  // 类型
  summary:"",
  // 内容
  icon:[]
  // 图片
  };
// from用来保存需要用到的数据
var imgList=[];
// 用来保存渲染图片是图片src的数组
var imgstr = "";
// 用来保存图片路径的数组
var icon;
setHeight();
// 设置m-content的高度
function setHeight(){
  var dHeight =$(window).height();
  var xheader=$('.header_wrap').height();
  var Height=dHeight-xheader-2;
  $('.m-content').height(Height+'px')
  }
  // 如果当前页面获取到那么说明是从选择社区页面返回回来的 将选择的社区渲染到请选择的div
if(!name|| name=='null'){
  $('.fl-tz-div').html(`\<div class="fl-tz-tex">去选择</div>
  <div class="fl-tz-img"><img src="../img/right.png" alt="" srcset=""></div>`)
  $('.fl-tz-div').css('color','#bfbfbf') 
}else{
  from.channelId=nameid;
  $('.fl-tz-div').html(name)
  $('.fl-tz-div').css('color','#000')
  renderData();
}
$('#post_href').attr('href',getBackHref())
function getBackHref(){
  localStorage.clear();
 console.log
   var reqStr = getQueryVariable('from')
   switch(reqStr){
     case 'found':
        return `./foundCommunity.html?openId=${openId}&masterSecret=${masterSecret}`;
       break;
     case 'mine':
        return `./mineCommunity.html?openId=${openId}&masterSecret=${masterSecret}`;  
       break;
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
function clickMenu1() {  
   $("#upload_file").click();
  }
function fileChange(el) {    
    if (!el.target.files[0].size) return;
     fileList(el.target);
  }
  function fileList(fileList) {
    let files = fileList.files;

    for (let i = 0; i < files.length; i++) {
      //判断是否为文件夹
      if (files[i].type != "") {
 
        fileAdd(files[i]);
      } else {
        //文件夹处理
        folders(fileList.items[i]);
      }
    }
  }
  function folders(files) {
    //判断是否为原生file
    if (files.kind) {
      files = files.webkitGetAsEntry();
    }
    files.createReader().readEntries(function(file) {
      for (let i = 0; i < file.length; i++) {
        if (file[i].isFile) {
         foldersAdd(file[i]);
        } else {
      folders(file[i]);
        }
      }
      
    });
    
  }
  function fileAdd(file) {   
    //总大小
    size = this.size + file.size;
    //判断是否为图片文件
    if (file.type.indexOf("image") == -1) {
      return;
    } else {
       
      let reader = new FileReader();
      reader.vue = this;
      reader.readAsDataURL(file);
      reader.onload = function() {
        file.src = this.result;
        if (imgList.length >= 6) {
        } else {
        imgList.push({
            file
          });
          imghtml()
        }
      };     
    }
  }
 function  foldersAdd(entry) {
    entry.file(function(file) {
    fileAdd(file);
    });
  }
 function fileDel(index) {
    size = size - imgList[index].file.size; //总大小
    imgList.splice(index, 1);  
    imghtml()
  }
function imghtml(){    
    imgstr='';
    for(var i=0;i<imgList.length;i++){
      imgstr+= `
         <div class="img-upload">
         <div class="img-show"  style="background-image: url(`+imgList[i].file.src+`)">
            
           <p class="img-close"  >
             <img style="width:.3rem;height:.3rem;"  src="../img/del.png"  onclick="fileDel(`+i+`)" alt>
           </p>
         </div>
       </div>`
     }
    if(imgList.length>=6){
       $('#m-img').html(imgstr);
    }else{
      imgstr+=`  <div  class="fujian" id="fujian" onclick="clickMenu1()">
            <div style="width:1.6rem;height:1.6rem;margin:0 auto;text-align:center;">
              <img style="width:40%;padding-top:0.6rem;" src="../img/add.png" alt>
            </div>
              <div style="width:100%;height:.6rem;text-align:center">照片</div>           
          </div>`
          $('#m-img').html(imgstr);
    }
    manageimgurl()
   
}
function labelfn(id,val){
  // 得到当前是第几个输入框
  var num=parseInt(id.charAt(id.length-1))+1
  if(val){
    // 判断输入的内容
    //去除前后的空格
    var strs=val.replace(/(^\s+)|(\s+$)/g, "");
    //是否为长度为小于2的汉字
    if(strs.match(/^[\u4e00-\u9fa5]{1,2}$/)){
      //是否为长度为4-20的英文
      // 打开下一个标签的输入
      // if(num<=3){
      //   $('#labelInp'+num).removeAttr('disabled')
      // }
    }else if(strs.match(/[a-zA-Z]{2,20}$/)){
      // if(num<=3){
      //   // $('#labelInp'+num).removeAttr(' disabled')
      // }
    }else{
      Toast('标签为两位数汉字或两个英文单词')
      event.target.value='';
    }

  }else{
    Toast('您还未输入标签啊内容')
  }
}
function select(){
  // 跳转页面前 在本地保存已经输入的值。
  from.newsTitle=$('#titleInp').val();
  // 标题
  from.summary=$('#textArea').val().replace(/(^\s+)|(\s+$)/g, ""); 
  // 内容
  jointLabel();
  // 执行处理标签事件 为from.subtitle赋值
  localStorage.setItem('DBMfrom',JSON.stringify(from));
  if (checkSystem()) {
    window.location.href = `./selectionsort.html?openId=${openId}&masterSecret=${masterSecret}`
  } else {
    data_href(`./selectionsort.html?openId=${openId}&masterSecret=${masterSecret}`)
  }
}
//事件返回
function back(){
  window.history.go(-1)
}
// 点击发布按钮
function jointLabel(){  
  from.subTitle=''
  $('.g-bq-div input').each(function(){
    if($(this).val()){
      from.subTitle+=$(this).val()+',';
    }  
    
  });
  from.subTitle=(from.subTitle.substring(from.subTitle.length-1)==',')?from.subTitle.substring(0,from.subTitle.length-1):from.subTitle;
}
// 发布按钮点击事件
$('.m-button-div').click(function(){
 
  // 判断帖子标题是否为空
  from.newsTitle=$('#titleInp').val();
  from.summary=$('#textArea').val(); 
  console.log($('#titleInp').val())
  if(from.newsTitle.length == 0 || from.newsTitle.match(/^\s+$/g)){
    Toast('请填写帖子标题')
  }else if(!from.channelId){
    Toast('请选择社区')
  }else if(from.summary.length == 0 || from.summary.match(/^\s+$/g)){
    Toast('请填写帖子内容')
  }else{
    release()    
  }
})

// 发布时请求的ajax
function release(){
  jointLabel()
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
      "channelId":from.channelId,
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
      if(data.status===0){
        Toast('发布成功')
        localStorage.clear();
      }else{
        Toast('发布失败')
      }
    },
    //调用出错执行的函数
    error: function () {
        //请求出错处理
     
    }
});
}
// 处理图片url
function manageimgurl(){
  var formData = new FormData()
             for(var i = 0; i < imgList.length; i++) {           
                formData.append('file', imgList[i].file);
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
    },
    //调用出错执行的函数
    error: function () {

    }
});
}
function renderData(){
  var localfrom=JSON.parse(localStorage.getItem('DBMfrom'));
    $('#titleInp').val(localfrom.newsTitle);
  // 标题

if(localfrom.summary.length != 0){
  $('#textArea').val(localfrom.summary);
  $('#introTxt').css('display','none')
  }
labelhtml(localfrom.subTitle);
}
// 处理本地存储传过来的label字符串
function labelhtml(label){
  var labellist=label.split(",")
  labellist.forEach(function (item, index) {
     $('#labelInp'+index+1).val(item);
  })
}