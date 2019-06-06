    
    var allCommunity = {
        classList:[],
        communityList:[]
    }
    //发帖添加属性
    $('#mine_href').attr('href',`./postmessage.html?from=mine&openId=${openId}&masterSecret=${masterSecret}`)
    //计算可滑动区域的高度
    computedScrollHeight();
      //获取左侧分类
    getLeftClass()
    //获取默认情况下的所有社区列表
    getRightCommunity()
    $('#searchArea').on('click',function(){
        if (checkSystem()) {
            window.location.href =`./searchCommunity.html?openId=${openId}&masterSecret=${masterSecret}&from=all`
          
        } else {
            data_href(`./searchCommunity.html?openId=${openId}&masterSecret=${masterSecret}&from=all`)
        }
    })    
    function computedScrollHeight(){
        var wrapH = $('body').height()- $('.header_wrap').outerHeight()-$('#searchArea').outerHeight();
        $('#scroll').css('height',`${wrapH}px`);
    }
    //返回事件
    function back(){
        if (checkSystem()) {
            window.location.href =`./mineCommunity.html?openId=${openId}&masterSecret=${masterSecret}`
            } else {
             data_href(`./mineCommunity.html?openId=${openId}&masterSecret=${masterSecret}`)
            }
     }
   
     function getLeftClass(){
        $.ajax({
            crossDomain: true,
            type: "GET",
            jsonp: "callback",
            jsonpCallback: "successCallback",
            url: API + "/community/communityClassification.shtml",
            //提交的数据
            headers:{
                appId: appId,
            },
            data: {
                pageSize:10
            },
            success: function (data) {
                var classArr = data.list
                classArr.forEach(function(item){
                    allCommunity.classList.push(item)
                })
                renderClassHtml(allCommunity.classList)

            },
            error: function () {
                Toast('出错啦')
            }
        })
     }
     
     function getRightCommunity(type){
        var typeCode = '' || type    //是否存在type 不存在则查全部
        allCommunity.communityList.length = 0
        $.ajax({
            crossDomain: true,
            type: "GET",
            jsonp: "callback",
            jsonpCallback: "successCallback",
            url: API + "/community/getAllCommunityList.shtml",
            //提交的数据
            headers:{
                appId: appId,
            },
            data: {
                communityType:typeCode,
                pageSize:10
            },
            success: function (data) {
                if(data.status!==0){
                    Toast(data.msg)
                    return
                }
                var CommunityArr = data.list
                CommunityArr.forEach(function(item){
                    allCommunity.communityList.push(item)
                })
                renderCommunityList(allCommunity.communityList)

            },
            error: function () {
                Toast('出错啦')
            }
        })
     }
     //渲染分类列表
     function renderClassHtml(arr){
        var htmlStr = ''
        arr.forEach(function(item){
            htmlStr += `<div class="menu_item" onclick="getRightCommunity(${item.incode})">
                            <div class="menu_itembox ">
                                <div class="menu_itemtext">
                                ${item.typeName}
                                </div>
                            </div>
                        </div>`
        })
        $('#classBox').html(htmlStr)
        // $('.menu_item').eq(0).addClass('menu_active')
        $('.menu_item').on('click',function(){
            $('.menu_item').removeClass('menu_active');
            $('.menu_item').addClass('menu_default');
            $(this).addClass('menu_active');
        })
        
     }
     
     //渲染时社区列表
     function renderCommunityList(arr){
        var str = ''
        arr.forEach(function(item){
            str += `<div class="community_item" onclick="toCommunityInfo(${item.channelId})">
                        <div class="commuinty_img">
                            <img src="${item.communityIcon}" onerror="this.src='../img/demoimg/mm.jpg'" alt="">
                        </div>
                        <div class="community_name">
                            <span>${item.channelName}</span>
                        </div>
                    </div>`
        })
        $('#communityBox').html(str)

     }

     //去社区详情
     function toCommunityInfo(channelId){
        if (checkSystem()) {
            window.location.href =`./communityInfo.html?openId=${openId}&masterSecret=${masterSecret}&channelId=${channelId}&from=mine`
        } else {
             data_href(`./communityInfo.html?openId=${openId}&masterSecret=${masterSecret}&channelId=${channelId}&from=mine`)
        }
     }
