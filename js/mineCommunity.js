
$('#all_href').attr('href',`./allCommunity.html?openId=${openId}&masterSecret=${masterSecret}`)
computedScrollHeight();
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
 getMineCommunity();
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
            pageSize:7
        },
        success: function (data) {
            if(data.status){
                Toast('请求数据出错啦')
            }
            var arr = data.list;
            var htmlStr = ''
            arr.forEach(function(item){
                htmlStr += ` <div class="community_item" onclick="clickCommunityItem(${item.channelId})">
                                <div class="commuinty_img">
                                    <img src="${item.communityIcon}" alt="communityImage" onerror="this.src='../img/demoimg/mm.jpg'">
                                </div>
                                <div class="community_name">
                                    <span>${item.channelName}</span>
                                </div>
                            </div>`
            });
            $('#comunityBox').html(htmlStr)        
       

        },
            error: function () {
                Toast('出错啦')
            }
        })
    }
/**
 * 
 * @param {*} channelId  传社区Id
 */
function clickCommunityItem(channelId){
    if (checkSystem()) {
        window.location.href =`./communityInfo.html?openId=${openId}&masterSecret=${masterSecret}&channelId=${channelId}&from=mine`
    } else {
         data_href(`./communityInfo.html?openId=${openId}&masterSecret=${masterSecret}&channelId=${channelId}&from=mine`)
    }
}