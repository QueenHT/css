
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
            if(data.obj.headPic){
                $('#comHeader').css('background',`url(${IMGAPI+data.obj.headPic})`)
            }else{
                $('#comHeader').css('background','url(../img/dbm_images/logo.png)')
            }
           
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
        getAnyMore(communityInfo.currentPage,communityInfo.totalPages)
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
            pageSize: 10
        },
        success: function (data) {
            console.log(data)
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
        var imgIcon = item.icon
        htmlStr = `<div onclick="toMessageInfo(${item.newsId})">
        <div class="community_item">
            <div class="community_item_top">
                <div class=" community_item_head">
                    <img src="${item.headPic}" onerror="this.src='../img/dbm_images/logo.png'" />
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
                    <span class="iconfont operate_icon" deleteId="${item.newsId}" onclick="handleDelete(${item.newsId},event)"></span>
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
        if(parseInt(item.delFlag)){
            $(`span[deleteId='${item.newsId}']`).addClass('icon-shanchu')
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
    communityInfo.scrollTop = $('.community_main').scrollTop()
    window.sessionStorage.setItem('communityInfo',JSON.stringify( communityInfo ))
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
 * @param {} id 
 */
function handleDelete(id,event){
    event.stopPropagation();
   
    $.confirm('你确定要删除贴子吗?',function(){
        
        
        $.ajax({
            crossDomain: true,
            type: "GET",
            jsonp: "callback",
            jsonpCallback: "successCallback",
            url: API + "/dynamic/delectTranspondDynamic",
            headers:{
                openId: openId,
                signature: signature,
                nonceStr: nonceStr,
                timestamp: timestamp,
                appId: appId,
            },
            data: {
                newsId: id,

            },
            success: function (data) {
                if(data.status){
                    Toast(data.msg)
                }
                communityInfo.list.forEach(function(item,index){
                    if(id == item.newsId){
                       communityInfo.list.splice(index,1)
                       $('.community_body').html('')
                       renderList(communityInfo.list)
                    }
                })
                Toast('删除成功')
                if(communityInfo.list.length <= LAST_COUNT){
                    if(communityInfo.currentPage<communityInfo.totalPages){
                        communityInfo.currentPage++;
                        getCommunityList()
                    } 
                }
            },
            error: function () {
                Toast('删除失败')
            }
        })
    },function(){

    })
    
}

