
var communityList = {
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
    communityList.currentPage = 1
    communityList.list = []
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
if( communityList.currentPage >= communityList.totalPages){
    $('#noMore').css('display','block')
    $('#wait').css('display','none')
    loading = false;
    return
 }else{
    communityList.currentPage ++
 }

setTimeout(function () {
    getCommunityList()
    loading = false;
}, 1000); //模拟延迟
});


//获取社区贴子列表
function getCommunityList(){
var sessioncommunityList = JSON.parse(window.sessionStorage.getItem('communityList'))
if( sessioncommunityList ){
    communityList = sessioncommunityList
    renderList(communityList.list) 
    getAnyMore(communityList.currentPage,communityList.totalPages)
    $('.community_main').scrollTop(communityList.scrollTop)
    window.sessionStorage.clear()
    return
}
$.ajax({
    crossDomain: true,
    type: "GET",
    jsonp: "callback",
    jsonpCallback: "successCallback",
    url: API + "/dynamic/queryCommunityDynamicListByUserId.shtml",
    headers:{
        openId: openId,
        signature: signature,
        nonceStr: nonceStr,
        timestamp: timestamp,
        appId: appId,
    },
    data: {
        currentPage: communityList.currentPage,
        pageSize:10
    },
    success: function (data) {
        if(data.status){
            Toast(data.msg)
        }
        var arr = data.list
        communityList.currentPage = data.pageInfo.currentPage;
        communityList.totalPages = data.pageInfo.totalPages;
        getAnyMore( communityList.currentPage, communityList.totalPages )
        arr.forEach(function(item){
            communityList.list.push(item)
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
 
    var imgIcon = item.icon
    htmlStr = `<div onclick="toMessageInfo(${item.newsId})" divId=${item.newsId}>
    <div class="community_item">
        <div class="community_item_top">
            <div class=" community_item_head">
                <img src="${IMGAPI+item.headPic}"  onerror="this.src='../img/dbm_images/logo.png'" />
            </div>
            <div style="flex:1;">
                <div class="community_item_username">
                    <div><span>${item.nickName}</span></div>
                </div>
                <div class="community_item_zuanfa"><span>${item.createTime}</span></div>
            </div>
        </div>
        <div class="community_item_center">
            <div class="community_item_content"><span>${item.newsTitle}</span></div>  
            <div class="community_item_content"><span>${item.summary}</span></div>
            <div class="community_item_imgs thumbs" newsId="${item.newsId}" >
                
            </div>
        </div>
    </div>
    <div class="community_item_operate">
        <div class="operate_box">
            <div>
                <span dzId="${item.newsId}" isVote="${item.isVote}" class="iconfont operate_icon" onclick="clickLike(${item.newsId},${item.upVoteCount},this,event)"></span>
                <span class="operate_count">${item.upVoteCount}</span>
            </div>
            <div>
                <span class="iconfont icon-duihua operate_icon" onclick="handleComment()"></span>
                <span class="operate_count">${item.commentNum}</span>
            </div>
            <div>
                <span class="iconfont icon-shanchu operate_icon"  onclick="handleDelete(${item.newsId},${index},event)"></span>
            </div>
        </div>
    </div>
    <div class="split_line"></div>
</div>`
    $('.community_body').append(htmlStr)
    if(imgIcon){
        var str = `<div>
                    <a href="${IMGAPI+imgIcon}">
                        <img src="${IMGAPI+imgIcon}"alt="" onerror="this.src='../img/dbm_images/logo.png'">
                    </a>
                 </div>`
        $(`div[newsId='${item.newsId}']`).html(str);
    }
    if(parseInt(item.isVote)){
        $(`span[dzId='${item.newsId}']`).addClass('icon-dianzan1');
        
       
    }else{
        $(`span[dzId='${item.newsId}']`).addClass('icon-xin');
    }
});

$('.thumbs a').touchTouch();
//阻止图片查看
$('.thumbs a').on('click',function(e){
    e.stopPropagation();
    return
})
$('span[delete=0]').css('display','none')  
}
/**
* 去贴子详情
* @param {*} id 贴子ID
*/
function toMessageInfo(id){
communityList.scrollTop = $('.community_main').scrollTop()
window.sessionStorage.setItem('communityList',JSON.stringify( communityList ))
if (checkSystem()) {
    window.location.href =`./postDetails.html?openId=${openId}&masterSecret=${masterSecret}&newsId=${id}`
    } else {
     data_href(`./postDetails.html?openId=${openId}&masterSecret=${masterSecret}&newsId=${id}`)
    }
}

/**
* @param {*} id 贴子id
* @param {*} isvote 是否点赞 0未点赞  1点赞
* @param {*} upVoteCount 点赞数
* @param {*} obj 元素本身
* @param {*} e    事件机制
*/
function clickLike(id,upVoteCount,obj,e){
e.stopPropagation()
var isVote = parseInt(e.target.getAttribute('isVote')) 
var upVoteCount = parseInt(upVoteCount)
console.log(isVote)
if(isVote){
    $.ajax({
        crossDomain: true,
        type: "GET",
        jsonp: "callback",
        jsonpCallback: "successCallback",
        url: API + "/comment/deleteVoteUp.shtml",
        //提交的数据
        headers:{
            openId: openId,
            signature: signature,
            nonceStr: nonceStr,
            timestamp: timestamp,
            appId: appId,
        },
        data: {
            busiType:2,
            busiId:id
        },
        success: function (data) {
            if(!data.status === 0){
                Toast(data.msg);
                return
            }
            $(obj).removeClass('icon-dianzan1').addClass('icon-xin');
            e.target.setAttribute('isVote',0)
            // console.log($(obj).next().html())
            $(obj).next().html(parseInt($(obj).next().html())-1)
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
        url: API + "/comment/createVoteUp.shtml",
        //提交的数据
        headers:{
            openId: openId,
            signature: signature,
            nonceStr: nonceStr,
            timestamp: timestamp,
            appId: appId,
        },
        data: {
            busiType:2,
            busiId:id
        },
        success: function (data) {
            if(!data.status === 0){
                Toast(data.msg);
                return
            }
            $(obj).removeClass('icon-xin').addClass('icon-dianzan1');
            e.target.setAttribute('isVote',1)
            // console.log()
            $(obj).next().html(parseInt($(obj).next().html())+1)
        },
        error: function () {
            Toast('出错啦')
        }
    })
}

}
/**
* 删除贴子
* @param {} id 帖子id
@param {} id 当前帖子的索引
@param {} id 

*/
function handleDelete(id,i,e){
    e.stopPropagation();
    $.confirm('你确定要删除贴子吗?',function(){
     $.showLoading('正在删除')
    $.ajax({
        crossDomain: true,
        type: "GET",
        jsonp: "callback",
        jsonpCallback: "successCallback",
        url: API + `/dynamic/delectTranspondDynamic?newsId=${id}`,
        //提交的数据
        headers:{
            openId: openId,
            signature: signature,
            nonceStr: nonceStr,
            timestamp: timestamp,
            appId: appId,
        },
        data: {},
        success: function (data) {
            $.hideLoading()  
            if(data.status ==0){
                Toast('删除成功');
              $(`div[divId=${id}]`).remove()
              communityList.list.splice(i,1)
              if(communityList.list.length==LAST_COUNT){
                getCommunityList()
            }
              return
            }         
           else{
            Toast('删除失败')
            }
         
        },
        error: function () {
            $.hideLoading()  
            Toast('出错啦')
        }
    })
})
}
function getBackHref(){
    var from = getQueryVariable('from')
    if(from){
      goBackfn()
    }else{
      window.history.go(-1)  
    }
  }
