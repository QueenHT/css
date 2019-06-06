
    var minCommunity = {
        communityList : [],
        currentPage : 1,
        totalPages : 0,
        scrollTop: 0
    }
    $('#all_href').attr('href',`./allCommunity.html?openId=${openId}&masterSecret=${masterSecret}`)
// 初始化数据    
computedScrollHeight();
initData() 
function  initData(){
    var sessionMine =  window.sessionStorage.getItem('minCommunity')
    if(sessionMine){
        minCommunity = JSON.parse(sessionMine)
        renderHtml(minCommunity.communityList)
        getAnyMore(minCommunity.currentPage,minCommunity.totalPages)
        $('.community_listwrap').scrollTop(minCommunity.scrollTop)
        window.sessionStorage.clear()

    }else{
        getMineCommunity();
    }
 }    


    //计算可滑动区域的高度
$('#searchArea').on('click',function(){
    if (checkSystem()) {
        window.location.href =`./searchCommunity.html?openId=${openId}&masterSecret=${masterSecret}&from=mine`
      
    } else {
        data_href(`./searchCommunity.html?openId=${openId}&masterSecret=${masterSecret}&from=mine`)
    }
})    
function computedScrollHeight(){
    var wrapH = $('body').height()- $('.header_wrap').outerHeight()-$('#searchArea').outerHeight();
    $('#scroll').css('height',`${wrapH}px`);
}

function back(){
    if (checkSystem()) {
        window.location.href =`./foundCommunity.html?openId=${openId}&masterSecret=${masterSecret}`
        } else {
         data_href(`./foundCommunity.html?openId=${openId}&masterSecret=${masterSecret}`)
        }
 }



//获取我的社区列表
function getMineCommunity(){
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
            currentPage: minCommunity.currentPage,
            pageSize:15
        },
        success: function (data) {
            console.log(data)
            if(data.status){
                Toast('请求数据出错啦')
            }
            var arr = data.list;
            minCommunity.currentPage = data.pageInfo.currentPage
            minCommunity.totalPages = data.pageInfo.totalPages
            arr.forEach(function(item){
                minCommunity.communityList.push(item)
            })
            renderHtml(arr)
            getAnyMore(minCommunity.currentPage,minCommunity.totalPages)
        },
            error: function () {
                Toast('出错啦')
            }
        })
    }
    function getAnyMore(currentPage,totalPages){
  
        if(currentPage < totalPages){
            $('#noMore').css('display','none')
            $('#wait').css('display','block')
        }else{
            $('#noMore').css('display','block')
            $('#wait').css('display','none')
        }
    }
    function renderHtml(arr){
        var htmlStr = ''
        arr.forEach(function(item){
            htmlStr = ` <div class="community_item" onclick="clickCommunityItem(${item.channelId})">
                            <div class="commuinty_img">
                                <img src="${item.communityIcon}" alt="communityImage"  onerror="this.src='../img/dbm_images/logo.png'">
                            </div>
                            <div class="community_name">
                                <span>${item.channelName}</span>
                            </div>
                        </div>`
             $('#contentBox').append(htmlStr) 
        });
             
    }
/**
 * 
 * @param {*} channelId  传社区Id
 */
function clickCommunityItem(channelId){

    minCommunity.scrollTop = $('.community_listwrap').scrollTop()
    window.sessionStorage.setItem('minCommunity',JSON.stringify(minCommunity))

    if (checkSystem()) {
        window.location.href =`./communityInfo.html?openId=${openId}&masterSecret=${masterSecret}&channelId=${channelId}&from=mine`
    } else {
         data_href(`./communityInfo.html?openId=${openId}&masterSecret=${masterSecret}&channelId=${channelId}&from=mine`)
    }
}
var loading = false //滚动状态标记
    $('.community_listwrap').infinite(50).on("infinite", function () {
        if (loading) return;
        loading = true;
        if( minCommunity.currentPage >= minCommunity.totalPages){
            $('#noMore').css('display','block')
            $('#wait').css('display','none')
            loading = false;
            return
        }else{
            minCommunity.currentPage ++
        }
        setTimeout(function () {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
            getMineCommunity()
            loading = false;
           
        }, 1000); //模拟延迟
    });    