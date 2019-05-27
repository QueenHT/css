// 获取option类型
ueryType()
// 上传图片处理
var typelist=[];
// 社区热门类型列表
var typevalue='';
// 选中的社区热门类型
// 获取热门类型函数
$("#picker").picker({
    title: "",
    cols: [{
        textAlign: 'center',
        values:typelist
    }]
});
function uploadImg(file,imgNum){
    var div = $('#'+imgNum);
    if (file.files && file.files[0]){
    // div.innerHTML ='<img id="upImg" class="Communityicon-img">'; //生成图片
    // var img = div.getElementsByTagName('Img')[0]; //获得用户上传的图片节点
    var reader = new FileReader(); //判断图片是否加载完毕
    reader.onload = function(evt){
    if(reader.readyState === 2){ //加载完毕后赋值
        $('#'+imgNum).html('')
        $('#'+imgNum).css('background-image',"url("+evt.target.result+")");
        $('#'+imgNum).css('overflow',"hidden");
        $('#'+imgNum).css('background-size',"100% auto");
    }
    }
    reader.readAsDataURL(file.files[0]); 
    }
    }
    // 上传图片div点击事件
function clickMenu1() {  
    $("#upload_file").click();
   }
     // 上传图片div点击事件
function clickMenu2() {  
    $("#upload_file2").click();
    }
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
function back(){    
    window.history.go(-1)
  
}
