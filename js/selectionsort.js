// console.log(timestamp,openId,signature,nonceStr)
computedScrollHeight();
    //计算可滑动区域的高度
function computedScrollHeight(){
    var wrapH = $('body').height()- $('.header_wrap').outerHeight()-$('#searchArea').outerHeight();
    $('#scroll').css('height',`${wrapH}px`);
}
var allList=[];
getclassify();
// function inpblur(v){
//     if(v.replace(/(^\s*)|(\s*$)/g, "")==""){
//         Toast('请输入搜索内容') 
//     }
// }
function getclassify(){
        $.showLoading('正在加载')
        // 全部
        $.ajax({
            //提交数据的类型 POST GET
            crossDomain: true,
            type: "GET",
            jsonp: "callback",
            jsonpCallback: "successCallback",
            //提交的网址
            url: API + `/community/getMineCommunityList.shtml`,
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
                    // $.hideLoading()
                    var gameLen = data.list.length
                    allList=data.list
                    if (gameLen == 0) {
                    } else {
                        rendGameHtml(allList)
                    }
                }else{
                    $.hideLoading()
                    Toast('加载失败')
                }              
            },
            //调用出错执行的函数
            error: function () {
                //请求出错处理
            }
        });   
 }
 function uploadFlag(currentPage,totalPages){  
    $('#noMore').css('display', 'none') 
    if (currentPage < totalPages) {
        $('#wait').css('display', 'block')
        $('#noMore').css('display', 'none')
    } else {
        $('#wait').css('display', 'none')
        $('#noMore').css('display', 'block')
    }
}
$('#allclassify').pullToRefresh({
    onRefresh: function () {
        allList = []
        getclassify()
        setTimeout(function () {
            $('#allclassify').pullToRefreshDone();
        }, 1500)
    },
    onPull: function (percent) {
        /* 用户下拉过程中会触发，接收一个百分比表示用户下拉的比例 */
    },
    distance: 50 /* 下拉刷新的触发距离， 注意，如果你重新定义了这个值，那么你需要重载一部分CSS才可以，请参考下面的自定义样式部分 */
});

 function rendGameHtml(arr) {
    var str = '';    
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        str += `
                    <div class="community_item" onclick="backpost('${arr[i].channelName}',${arr[i].channelId})">
                    <div class="commuinty_img">
                        <img src="${arr[i].communityIcon}" onerror="this.src='../img/dbm_images/logo.png'" alt="">
                    </div>
                    <div class="community_name">
                        <span>${arr[i].channelName}</span>
                    </div>
                </div>
             `
    }
    $(`#all`).html(str)
}

$("#ssinput").on('keypress',function(e) {  
               var keycode = e.keyCode;  
               var searchName = $(this).val();  
               if(keycode=='13') {  
                    e.preventDefault();    
                      //请求搜索接口  
                 searchCommunity(searchName)
                }  
       }); 
function searchCommunity(searchName){
    $.ajax({
        //提交数据的类型 POST GET
        crossDomain: true,
        type: "GET",
        jsonp: "callback",
        jsonpCallback: "successCallback",
        //提交的网址
        url: API + `/community/getMineCommunityList.shtml?channelName=${searchName}`,
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
                var gameLen = data.list.length
                allList=data.list
                if (gameLen == 0) {                        
                    Toast('没有找到您搜索的社区')
                } else {
                    rendGameHtml(allList)
                }
    
            }else{
                $.hideLoading()
                Toast('加载失败')
            }              
        },
        //调用出错执行的函数
        error: function () {
            //请求出错处理
        }
    });  
  }
// function backpost(name,id){
//     localStorage.setItem('communityname',name);
//     localStorage.setItem('communityId',id);
//     window.history.go(-1)
//   }
  function backpost(){
    if (checkSystem()) {
        window.location.href =`./postmessage.html?openId=${openId}&masterSecret=${masterSecret}`
    } else {
        data_href(`./postmessage.html?openId=${openId}&masterSecret=${masterSecret}`)
 }
  }
  function back(){
    if (checkSystem()) {
        window.location.href =`./postmessage.html?openId=${openId}&masterSecret=${masterSecret}`
    } else {
        data_href(`./postmessage.html?openId=${openId}&masterSecret=${masterSecret}`)
 }
  }