

var communityInfo = {
        name:'',
        channelId:'',
        list:[],
        currentPage: 1,
        totalPages: 0,
        scrollTop: 0  
}
$('#noMore').css('display','none')
//计算滑动高度
computedScrollHeight();
//获取社区详情及列表
getComunityInfo()
getCommunityList()   

function computedScrollHeight(){
    var wrapH = $('body').height()- $('#comHeader').outerHeight();
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

function getComunityInfo(){
    var cId = getQueryVariable('channelId')
    
    $.ajax({
        crossDomain: true,
        type: "GET",
        jsonp: "callback",
        jsonpCallback: "successCallback",
        url: API + "/community/getCommunityDetails",
        headers:{
            openId: openId,
            signature: signature,
            nonceStr: nonceStr,
            timestamp: timestamp,
            appId: appId,
        },
        data: {
            channelId: cId
        },
        success: function (data) {
            if(data.status){
                Toast(data.msg)
            }
            communityInfo.name = data.obj.channelName
            communityInfo.channelId = data.obj.channelId
            $('#communityName').text(data.obj.channelName)
            $('#communityImg').attr( 'src', data.obj.communityIcon)
            $('#communityUserCount').text(data.obj.attentionCount)
            $('#comHeader').css('background','url(../img/demoimg/mm.jpg)')
            if(data.obj.joinFlag){
                $('#jionCommunity').attr('joinFlag',data.obj.joinFlag)
                $('#jionCommunity').css('background','#585e63')
            }
        },
        error: function () {
            Toast('出错啦')
        }
    })
}
//获取社区贴子列表
function getCommunityList(){
    var cId = getQueryVariable('channelId');
    var sessionCommunityInfo = JSON.parse(window.sessionStorage.getItem('communityInfo'))
    if( sessionCommunityInfo ){
        communityInfo = sessionCommunityInfo
        renderList(communityInfo.list) 
        $('.community_main').scrollTop(communityInfo.scrollTop)
        window.sessionStorage.clear()
        return
    }
    $.ajax({
        crossDomain: true,
        type: "GET",
        jsonp: "callback",
        jsonpCallback: "successCallback",
        url: API + "/community/getCommunityNewsList",
        headers:{
            openId: openId,
            signature: signature,
            nonceStr: nonceStr,
            timestamp: timestamp,
            appId: appId,
        },
        data: {
            channelId: cId,
            currentPage: communityInfo.currentPage,
            pageSize: 4
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

//加入社区事件
$('#jionCommunity').click(function(){
    var joinFlag = $(this).attr('joinFlag')
    if(joinFlag){
        Toast('你已经加入该社区')
        return 
    }
    if (checkSystem()) {
        window.location.href =`./joincommunity.html?openId=${openId}&masterSecret=${masterSecret}&joinName=${communityInfo.name}&channelId=${communityInfo.channelId}`
        } else {
         data_href(`./joincommunity.html?openId=${openId}&masterSecret=${masterSecret}&joinName=${communityInfo.name}&channelId${communityInfo.channelId}`)
        }
})


//返回事件
function back(){    
    window.history.go(-1)
}
/**
 * 列表渲染
 * @param {*} arr  贴子列表数组 
 */
function renderList(arr){
   
    var htmlStr = ''
    arr.forEach(function(item) {
        htmlStr = `<div onclick="toMessageInfo(${item.newsId})">
        <div class="community_item">
            <div class="community_item_top">
                <div class=" community_item_head">
                    <img src="${item.headPic}" onerror="this.src='../img/demoimg/mm.jpg'" />
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
                <div class="community_item_imgs" id="thumbs">
                    <div>
                        <a href="${IMGAPI+item.icon}">
                                <img src="${IMGAPI+item.icon}" alt="" onerror="this.src='../img/dbm_images/dbm_default.png'">
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="community_item_operate">
            <div class="operate_box">
                <div>
                    <span class="iconfont icon-xin operate_icon" onclick="handleFavorite()"></span>
                    <span class="operate_count">${item.upVoteCount}</span>
                </div>
                <div>
                    <span class="iconfont icon-duihua operate_icon" onclick="handleComment()"></span>
                    <span class="operate_count">${item.commentNum}</span>
                </div>
                <div>
                    <span class="iconfont icon-shanchu operate_icon" delete="${item.delFlag}" onclick="handleDelete(${item.newsId})"></span>
                </div>
            </div>
        </div>
        <div class="split_line"></div>
    </div>`
    $('.community_body').append(htmlStr)
    });
    
    $('#thumbs a').touchTouch();
    //阻止图片查看
    $('#thumbs a').on('click',function(e){
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
    communityInfo.scrollTop = $('.community_main').scrollTop()
    window.sessionStorage.setItem('communityInfo',JSON.stringify( communityInfo ))
    if (checkSystem()) {
        window.location.href =`./dynamicDetails.html?openId=${openId}&masterSecret=${masterSecret}&newsId=${id}`
        } else {
         data_href(`./dynamicDetails.html?openId=${openId}&masterSecret=${masterSecret}&newsId${id}`)
        }
}
/**
 * 删除贴子
 * @param {} id 
 */
function handleDelete(id){

}

