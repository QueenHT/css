
var communityInfo = {
    name:'',
    list:[],
    currentPage: 1,
    totalPages: 0,
    scrollTop: 0  
}
$('#noMore').css('display','none')
//计算滑动高度
computedScrollHeight();
//获取帖子及列表
getCommunityList()   

function computedScrollHeight(){
var wrapH = $('body').height()- $('.header_wrap').outerHeight();
$('#community_art').css('height',`${wrapH+50}px`);
}

//刷新
$('.community_main').pullToRefresh({
onRefresh: function () {
    $('.community_body').html('')
    communityInfo.currentPage = 1
    communityInfo.list = []
    $('#noMore').css('display','none')
    $('#wait').css('display','none')
    setTimeout(function () {
        getCommunityList()
        $('.community_main').pullToRefreshDone();
    }, 1000)
},
onPull: function (percent) {
    /* 用户下拉过程中会触发，接收一个百分比表示用户下拉的比例 */
},
distance: 50 
});


//滚动加载
var loading = false //状态标记
$('.community_main').infinite(50).on("infinite", function () {
if (loading) return;
loading = true;
if( communityInfo.currentPage >= communityInfo.totalPages){
    $('#noMore').css('display','block')
    $('#wait').css('display','none')
    loading = false;
    return
 }else{
    communityInfo.currentPage ++
 }

setTimeout(function () {
    getCommunityList()
    loading = false;
}, 1000); //模拟延迟
});


//获取社区贴子列表
function getCommunityList(){
var sessionCommunityInfo = JSON.parse(window.sessionStorage.getItem('communityInfo'))
if( sessionCommunityInfo ){
    communityInfo = sessionCommunityInfo
    renderList(communityInfo.list) 
    getAnyMore(communityInfo.currentPage,communityInfo.totalPages)
    $('.community_main').scrollTop(communityInfo.scrollTop)
    window.sessionStorage.clear()
    return
}
$.ajax({
    crossDomain: true,
    type: "GET",
    jsonp: "callback",
    jsonpCallback: "successCallback",
    url: API + "/community/getMineCommunityList.shtml",
    headers:{
        openId: openId,
        signature: signature,
        nonceStr: nonceStr,
        timestamp: timestamp,
        appId: appId,
    },
    data: {
        currentPage: communityInfo.currentPage,
        pageSize:10
    },
    success: function (data) {
        if(data.status){
            Toast(data.msg)
        }
        var arr = data.list
        communityInfo.currentPage = data.pageInfo.currentPage;
        communityInfo.totalPages = data.pageInfo.totalPages;
        getAnyMore( communityInfo.currentPage, communityInfo.totalPages )
        arr.forEach(function(item){
            communityInfo.list.push(item)
        })
        renderList(arr)
    },
    error: function () {
        Toast('请求数据出错啦')
    }
})
}
//是否显示加载 没有更多
function getAnyMore(currentPage,totalPages){

if(currentPage < totalPages){
    $('#noMore').css('display','none')
    $('#wait').css('display','block')
}else{
    $('#noMore').css('display','block')
    $('#wait').css('display','none')
}
}

/**
* 列表渲染
* @param {*} arr  贴子列表数组 
*/
function renderList(arr){
var htmlStr = ''
arr.forEach(function(item,index) { 
    htmlStr = `  <div class="m-content-div">
    <div class="g-left">
        <div class="g-img">
                <img src="${IMGAPI+item.communityIcon}"  onerror="this.src='../img/dbm_images/logo.png'" salt="">
        </div>
    </div>
    <div class="g-center">
        <div class="g-name">
           ${item.channelName}
        </div>
        <div class="g-num">
            人数: ${item.attentionCount}
        </div>
        <div class="g-people">
            创建人:  ${item.nickName}
        </div>
    </div>
    <div class="g-right">
        <div class="g-btn" style="display:${item.isCreateOper==1?'block':'none'}" onclick="entermanagement('${item.channelName}',${item.channelId})">
            社区成员管理
        </div>
    </div>
</div> `
    $('.community_body').append(htmlStr)
});
}
/**
 * 进入社区成员管理页面
 * @param {*} name 社区名称
 * @param {*} id 社区id 
 */
function entermanagement(name,id){
communityInfo.scrollTop = $('.community_main').scrollTop()
window.sessionStorage.setItem('communityInfo',JSON.stringify( communityInfo ))
    if (checkSystem()) {
        window.location.href = `./managementcommunity.html?openId=${openId}&masterSecret=${masterSecret}&communityName=${name}&communityId=${id}`

    } else {
        data_href(`./managementcommunity.html?openId=${openId}&masterSecret=${masterSecret}&communityName=${name}&communityId=${id}`)
    }
}
function backcreated(){
    if (checkSystem()) {
        window.location.href = `./CreateCommunity.html?openId=${openId}&masterSecret=${masterSecret}`
    } else {
        data_href(`./CreateCommunity.html?openId=${openId}&masterSecret=${masterSecret}`)
    }
}
//返回事件
function back(){    
    if (checkSystem()) {
        window.webkit.messageHandlers.haiyiJSCallNativeHandler.postMessage({
            "action": "back"
        }); 
    } else {
        window.android.haiyiJSCallNativeHandler('back', '')  
    }
    }