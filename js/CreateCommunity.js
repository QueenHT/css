// 获取option类型
ueryType()
// 上传图片处理
var typelistAll=[];
// 社区热门类型列表
var typelist=[];
// 社区热门类型名称列表
var typeId;
// 选中的社区热门类型
// 获取热门类型函数
$("#picker").picker({
    title: "",
    cols: [{
        textAlign: 'center',
        values:typelist
    }]
});
// 上一个页面返回是存在的数据
$('input').val('');
    // 上传图片div点击事件
function clickMenu1() {  
    indextab=1
    cutWidth=1;
    cutHeight=1;
    $("#upload_file").click();
   }
     // 上传图片div点击事件
function clickMenu2() {  
    cutWidth=5.5;
    cutHeight=3;
    indextab=2
    $("#upload_file").click();
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

// 处理社区图片url
function manageCommunityurl(){

    var formData = new FormData()              
     formData.append('file',CommunitySrc);        
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
            Communityicon=data.list[0].newName;
            // 处理背景图片url  背景图片处理成功后 再执行创建请求
            manageBackgroundurl()
        },
        //调用出错执行的函数
        error: function () {
            $.hideLoading() 
            Toast('创建失败')
        }
    });
}
// 处理背景图片url
function manageBackgroundurl(){
    var formData = new FormData()             
      formData.append('file',BackgroundSrc);                         
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
            Backgroundicon=data.list[0].newName;
            // 执行创建社区请求
            $.ajax({
                //提交数据的类型 POST GET
                crossDomain: true,
                type: "GET",
                jsonp: "callback",           
                //提交的网址
                url: API + `/community/setCommunityConf.shtml`,
                //提交的数据
                data:{
                    channelName:newsTitle,
                    communityIcon:Communityicon,
                    communityType:typeId,
                    communitySetting:Backgroundicon,
                },
                headers: {
                    'nonceStr': nonceStr,
                     'openId': openId,
                    'signature': signature,
                    'timestamp': timestamp,
                      'appId': appId,
                  },
                //成功返回之后调用的函数
                success: function (data) {
                    if(data.status===0){
                        $.hideLoading() 
                        Toast('创建成功')
                        localStorage.clear();
                        var channelId=parseInt(data.msg)
                        console.log(data)
                        setTimeout(function(){
                            if (checkSystem()) {
                                window.location.href =`./communityInfo.html?openId=${openId}&masterSecret=${masterSecret}&channelId=${channelId}`
                            } else {
                                 data_href(`./communityInfo.html?openId=${openId}&masterSecret=${masterSecret}&channelId=${channelId}`)
                            }
                          },500)
            
                      }else{
                        $.hideLoading() 
                        Toast(data.msg)
                      }
                },
                //调用出错执行的函数
                error: function () {
                    $.hideLoading() 
                    Toast('创建失败')
                }
            });
        },
        //调用出错执行的函数
        error: function () {
            $.hideLoading() 
            Toast('创建失败')
             
        }
    });
}
$('.m-footer-btn').click(function(){
    // 获取当前选中的类型的code值
    judgeType($('#picker').val());
    newsTitle=$('#newsTtile').val();
    if(newsTitle.length == 0 ||newsTitle.match(/^\s+$/g)){
        Toast('请填写社区名称')
      }else if(!typeId){
        Toast('请选择社区类型')
      }else{
        //   先处理社区图标 社区图标成功后再处理 背景图片
        $.showLoading('正在提交')
        manageCommunityurl()
      }
})
// 获取当前选中的类型的code值
function  judgeType(val){
    typelistAll.forEach(function (item,index) {
        if(item.typeName==val){
            typeId=item.incode
        }     
       })     
}
function back(){
    
    var from = getQueryVariable('from')  
    if(from){
        goBackfn()
    }else{
     window.history.go(-1)  
    }
}
// picker时不调起软键盘
$('#picker').click(function () {
    document.activeElement.blur();
  })