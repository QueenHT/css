
var name=localStorage.getItem('communityname')
var nameid=localStorage.getItem('communityId')
var size=0;
var form={
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
  icon:[],
  // 用来保存图片路径的数组
  imgstr:""
  // 用来保存渲染图片的字符串
  };
// form用来保存需要用到的数据
var imgList=[];
// 用来保存渲染图片是图片src的数组
// var form.imgstr  = "";
// // 用来保存图片路径的数组
// var icon=[];
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
  $('.fl-tz-div').css('color','#bfbfbf') ;
  // 使用go(-1)时会有数据缓存清除数据 
 $('#textArea').val('');
  imgList=[];
  form.icon=[];
  $('input').val('')
}else{
  form.channelId=nameid;
  $('.fl-tz-div').html(name)
  $('.fl-tz-div').css('color','#000')
  renderData();
}
function back(){
  localStorage.clear();
   var from = getQueryVariable('from')  
   if(from){
    goBackfn()
   }else{
    window.history.go(-1)  
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
      EXIF.getData(file, function() { 
        // alert(EXIF.pretty(this)); 
        console.log('file.',file)
         EXIF.getAllTags(this);  
         //alert(EXIF.getTag(this, 'Orientation'));  
         Orientation = EXIF.getTag(this, 'Orientation'); 
         //return; 
     }); 
      let reader = new FileReader();
      reader.vue = this;
      reader.readAsDataURL(file);    
      reader.onload = function() {     
        var image = new Image();
        image.src =this.result;  
        var base64=null;
        image.onload = function() { 
          console.log('image.onload')
          var expectWidth = this.naturalWidth; 
          var expectHeight = this.naturalHeight; 
           
          if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) { 
              expectWidth = 800; 
              expectHeight = expectWidth * this.naturalHeight / this.naturalWidth; 
          } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) { 
              expectHeight = 1200; 
              expectWidth = expectHeight * this.naturalWidth / this.naturalHeight; 
          } 
          var canvas = document.createElement("canvas"); 
          var ctx = canvas.getContext("2d"); 
          canvas.width = expectWidth; 
          canvas.height = expectHeight; 
          ctx.drawImage(this, 0, 0, expectWidth, expectHeight); 
          var base64 = null;           
          //修复ios 
          if (navigator.userAgent.match(/iphone/i)) { 
              //如果方向角不为1，都需要进行旋转 added by lzk 
              if(Orientation != "" && Orientation != 1){ 
                  alert('旋转处理'); 
                  switch(Orientation){ 
                      case 6://需要顺时针（向左）90度旋转 
                          alert('需要顺时针（向左）90度旋转'); 
                          rotateImg(this,'left',canvas); 
                          break; 
                      case 8://需要逆时针（向右）90度旋转 
                          alert('需要顺时针（向右）90度旋转'); 
                          rotateImg(this,'right',canvas); 
                          break; 
                      case 3://需要180度旋转 
                          alert('需要180度旋转'); 
                          rotateImg(this,'right',canvas);//转两次 
                          rotateImg(this,'right',canvas); 
                          break; 
                  }        
              } 
              base64 = canvas.toDataURL("image/jpeg", 0.8); 
          }
          console.log(base64)
          file.src =base64 ;
          console.log(file)
          console.log('1',file.src)
        }
          
        console.log('file',file)
        if (imgList.length >= 6) {
        } else {
          // 设置定时 拿到src的值再进行push和渲染
        setTimeout(function(){
          imgList.push({
            file
          });
          imghtml()
        },500)
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
    // size = size - imgList[index].file.size; //总大小
    imgList.splice(index, 1);  
    imghtml()
  }
function imghtml(){   
 
    form.imgstr='';
    for(var i=0;i<imgList.length;i++){

      console.log(imgList[i].file) 
      form.imgstr+= `
         <div class="img-upload">
         <div class="img-show"  style="background-image: url(`+imgList[i].file.src+`)">
            
           <p class="img-close"  >
             <img style="width:.3rem;height:.3rem;"  src="../img/del.png"  onclick="fileDel(`+i+`)" alt>
           </p>
         </div>
       </div>`
     }
    if(imgList.length>=6){
       $('#m-img').html(form.imgstr);
    }else{
      form.imgstr+=`  <div  class="fujian" id="fujian" onclick="clickMenu1()">
            <div style="width:1.6rem;height:1.6rem;margin:0 auto;text-align:center;">
              <img style="width:40%;padding-top:0.6rem;" src="../img/add.png" alt>
            </div>
              <div style="width:100%;height:.6rem;text-align:center">照片</div>           
          </div>`
          $('#m-img').html(form.imgstr);
    }
    manageimgurl()
   
}
function labelfn(id,val){
  // 得到当前是第几个输入框
  if(val){
    // 判断输入的内容
    //去除前后的空格
    var strs=val.replace(/(^\s+)|(\s+$)/g, "");
    //是否为长度为小于2的汉字
    if(strs.match(/^[\u4e00-\u9fa5]{1,2}$/)||strs.match(/^[a-zA-Z]{2,10}$/)){
    }else{
      Toast('标签为两位数汉字或两个英文单词')
      event.target.value='';
    }
  }else{
    Toast('您还未输入标签内容')
  }
}
function select(){
  // 跳转页面前 在本地保存已经输入的值。
  form.newsTitle=$('#titleInp').val();
  // 标题
  form.summary=$('#textArea').val().replace(/(^\s+)|(\s+$)/g, ""); 
  // 内容
  form.imgstr=form.imgstr;
  // 图片数组
  form.icon=form.icon;
  // 处理后的图片数组
  form.imgList=imgList;
  // 本地图片路径
  jointLabel();
  // 执行处理标签事件 为form.subtitle赋值
  localStorage.setItem('DBMform',JSON.stringify(form));
  localStorage.setItem('imgList',JSON.stringify(imgList));
  if (checkSystem()) {
    window.location.href = `./selectionsort.html?openId=${openId}&masterSecret=${masterSecret}`
  } else {
    data_href(`./selectionsort.html?openId=${openId}&masterSecret=${masterSecret}`)
  }
}
// 拼接输入的标签
function jointLabel(){  
  form.subTitle=''
  $('.g-bq-div input').each(function(){
    if($(this).val()){
      form.subTitle+=$(this).val()+',';
    }  
    
  });
  // 去除拼接字符串的最后一个逗号
  form.subTitle=(form.subTitle.substring(form.subTitle.length-1)==',')?form.subTitle.substring(0,form.subTitle.length-1):form.subTitle;
}
// 发布按钮点击事件
$('.m-button-div').click(function(){ 
  // 判断帖子标题是否为空
  form.newsTitle=$('#titleInp').val();
  form.summary=$('#textArea').val(); 
  jointLabel()
  if(form.newsTitle.length == 0 || form.newsTitle.match(/^\s+$/g)){
    Toast('请填写帖子标题')
  }else if(!form.channelId){
    Toast('请选择社区')
  }else if(form.summary.length == 0 || form.summary.match(/^\s+$/g)){
    Toast('请填写帖子内容')
  }else{
    release()    
  }
})

// 发布时请求的ajax
function release(){
  $.showLoading('正在提交')
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
      "newsTitle":form.newsTitle,
      "subTitle":form.subTitle,
      "channelId":form.channelId,
      "targetType":form.targetType,
      "summary":form.summary,
      "icon":JSON.stringify(form.icon),
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
        Toast('发布成功')
        localStorage.clear();
        var dynamicDetailsID=parseInt(data.msg)
      setTimeout(function(){
        if (checkSystem()) {
          window.location.href = `./postDetails.html?openId=${openId}&masterSecret=${masterSecret}&newsId=${dynamicDetailsID}&h5form=Post`
        } else {
          data_href(`./postDetails.html?openId=${openId}&masterSecret=${masterSecret}&newsId=${dynamicDetailsID}&h5form=Post`)
        }
      },1000)
      }else{
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
      form.icon=[];
      var list=data.list;
      for(var i=0;i<list.length;i++){
        form.icon.push({ path:list[i].newName})
      }
    },
    //调用出错执行的函数
    error: function () {

    }
});
}
function renderData(){
  var localform=JSON.parse(localStorage.getItem('DBMform'));
    $('#titleInp').val(localform.newsTitle);
  // 标题
if(localform.summary.length != 0){
  $('#textArea').val(localform.summary);
  $('#introTxt').css('display','none')
  }
labelhtml(localform.subTitle);
imgList=localform.imgList;
form.icon=localform.icon;
if(localform.imgstr){
  $('#m-img').html(localform.imgstr)
}

}
// 处理本地存储传过来的label字符串
function labelhtml(label){
 if(label){
  var labellist=label.split(",")
  labellist.forEach(function (item, index) {
     $('#labelInp'+index+1).val(item);
  })
 }
}
// 软键盘收起
$("input").on("blur",function(){
	window.scroll(0,0);//失焦后强制让页面归位
});