var dHeight =$(window).height();
var xheader=$('.header_wrap').height();
var headerInp=$('.header_inp').height();
var Height=dHeight-xheader-headerInp-2;
$('.m-body').height(Height+'px')

//若存在已经被搜索优先渲染  为保证页面返回后上次搜索的数据还存在 sessionstorage
sessionRender()

function inpblur(v){
    if(v.replace(/(^\s*)|(\s*$)/g, "")==""){
        Toast('请输入搜索内容') 
        return
    }
    getCommunityData(v)
}
//获取焦点时
function onFocus(){
    window.sessionStorage.clear()
    $('.search-body').html('')
   
}
//点击取消时
function onCancel(){
    window.sessionStorage.clear()
    $('.search-body').html('')
    
}
//搜索社区
function getCommunityData(val){
    var from = getQueryVariable('from')
    if(from === 'mine'){
        $.ajax({
            crossDomain: true,
            type: "GET",
            jsonp: "callback",
            jsonpCallback: "successCallback",
            url: API + "/community/getMineCommunityList.shtml",
            headers:{
                openId: openId,
                timestamp: timestamp,
                signature: signature,
                nonceStr: nonceStr,
                appId: appId
            },
            data: {
                channelName:val
            },
            success: function (data) {
                var result = data.list;
                renderHtml(result)
    
            },
            error: function () {
                Toast('出错啦')
            }
        })
    }else{
        $.ajax({
            crossDomain: true,
            type: "GET",
            jsonp: "callback",
            jsonpCallback: "successCallback",
            url: API + "/community/communitySearch.shtml",
            headers:{
                openId: openId,
                timestamp: timestamp,
                signature: signature,
                nonceStr: nonceStr,
                appId: appId
            },
            data: {
                channelName:val
            },
            success: function (data) {
                var result = data.list;
                renderHtml(result)
    
            },
            error: function () {
                Toast('出错啦')
            }
        })
    }
   
}

function renderHtml(arr){
    var htmlStr = ''
    var storage = window.sessionStorage
    storage.setItem('searchResult',JSON.stringify(arr))
    arr.forEach(function(item){
        htmlStr += `<div class="m-fl-div" onclick="toCommunityInfo(${item.channelId})">
                        <div class="m-fl-left">
                            <div class="g-fl-img">
                                <img src="${item.communityIcon}" onerror="this.src='../img/info.jpg'" alt="" srcset="">
                            </div>
                        </div>
                        <div class="m-fl-center">
                            <div class="g-fl-text">
                                ${item.channelName}
                            </div>
                        </div>

                        <div class="m-fl-right">
                            <div class="enter-button">
                                进入社区
                            </div>
                        </div>
                    </div>`

    })
    $('.search-body').html(htmlStr)
}
//跳转详情
function toCommunityInfo(id){
    if (checkSystem()) {
            window.location.href =`./communityInfo.html?openId=${openId}&masterSecret=${masterSecret}&channelId=${id}`
        } else {
            data_href(`./communityInfo.html?openId=${openId}&masterSecret=${masterSecret}&channelId=${id}`)
     }
}

function sessionRender(){
    var session = window.sessionStorage
    if(session.getItem('searchResult')){
        var resList = JSON.parse(session.getItem('searchResult'))
        renderHtml(resList)
    }
}
function back(){
    window.sessionStorage.clear()
    window.history.go(-1)
}