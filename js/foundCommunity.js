
    var foundCommunity = {
        currentPage:1,
        totalPages: 0,
        queryIndex: 0,
        foundList: [],
        scrollTop: 0
      
    }
    //scrollTop()
    //刷新
    $('.scroll_wrap').pullToRefresh({
        onRefresh: function () {
            $('.community_body').html('')
            foundCommunity.currentPage = 1
            foundCommunity.mineList = []
            foundCommunity.othterList = []
            $('#noMore').css('display','none')
            $('#wait').css('display','block')
            
            setTimeout(function () {
                getJoined()
                $('.scroll_wrap').pullToRefreshDone();
            }, 500)
        },
        onPull: function (percent) {
            /* 用户下拉过程中会触发，接收一个百分比表示用户下拉的比例 */
        },
        distance: 50 
    });
    //滚动加载
    var loading = false //滚动状态标记
    $('.scroll_wrap').infinite(50).on("infinite", function () {
        if (loading) return;
        loading = true;
        console.log(foundCommunity.queryIndex)
        console.log($('.hot_menu_item').eq(foundCommunity.queryIndex).attr('incode'))
        var incode = $('.hot_menu_item').eq(foundCommunity.queryIndex).attr('incode')
        if( foundCommunity.currentPage >= foundCommunity.totalPages){
            $('#noMore').css('display','block')
            $('#wait').css('display','none')
            loading = false;
            return
        }else{
            foundCommunity.currentPage ++
            
           
        }
        setTimeout(function () {
            
            if(incode){
                getClassData(incode)
            }else{
                getJoined()
            }
           
            loading = false;
        }, 1000); //模拟延迟
    });
    $('#found_href').attr('href',`./postmessage.html?from=found&openId=${openId}&masterSecret=${masterSecret}`)
  
        computedScrollHeight();
        getClassification()
        getJoined()
    
    //点击搜索
    $('#searchArea').on('click',function(){
        if (checkSystem()) {
            window.location.href =`./searchCommunity.html?openId=${openId}&masterSecret=${masterSecret}&from=found`
      
        } else {
            data_href(`./searchCommunity.html?openId=${openId}&masterSecret=${masterSecret}&from=found`)
        }
    })
    //计算可滑动区域的高度 50滚动高度
    function computedScrollHeight(){
        var wrapH = $('body').height()- $('.header_wrap').outerHeight();
        $('#scroll').css('height',`${wrapH+50}px`);
    }

    //渲染热门分类
    function getClassification(){
        $.ajax({
            crossDomain: true,
            type: "GET",
            jsonp: "callback",
            async: false,
            jsonpCallback: "successCallback",
            url: API + "/community/communityClassification.shtml",
            //提交的数据
            headers:{
                appId: appId
            },
            data: {
                pageSize:7
            },
            success: function (data) {
                renderHot(data)
                
            },
            error: function () {
                Toast('出错啦')
            }
        })
    }
    function renderHot(data){
        var classifiCationList = data.list
        var classifyCount = data.pageInfo.totalRows
        var htmlStr = ''
        classifiCationList.forEach(function(item){
            htmlStr = ` <div class="hot_menu_item" incode="${item.incode}">
                        ${item.typeName}
                    </div>`
            $('.hot_menu_box').append(htmlStr)        
        });
        $('#hot_menu_count').text(classifyCount)
        $('.hot_menu_item').on('click',function(){
            var index = $(this).index();
            var incode = $(this).attr('incode');
            foundCommunity.queryIndex = index;
            $('.hot_menu_item').removeClass('hot_menu_active');
            $(this).addClass('hot_menu_active');
            $('#noMore').css('display','none');
            $('#wait').css('display','block');
            $('.community_body').html('');
            foundCommunity.currentPage = 1;
            foundCommunity.totalPages = 0;
            foundCommunity.foundList.length = 0;
            if(index){
                getClassData(incode)
                
                return
            }
            getJoined()
            
        })
    }

    
    //handleFavorite  点击喜欢/
    function handleFavorite(){

    }
    //handleComment  点击评论
    function handleComment(){

    }
    //handleTranspond 点击转发
    function handleTranspond(){

    }
 

    //点击去我的社区
    function toMineCommunity(){
        if (checkSystem()) {
            window.webkit.messageHandlers.haiyiJSCallNativeHandler.postMessage({
                "action": "hiddenTabs"
            });
            window.location.href =`./mineCommunity.html?openId=${openId}&masterSecret=${masterSecret}`
      
        } else {
            window.android.haiyiJSCallNativeHandler('hiddenTabs', '')
            data_href(`./mineCommunity.html?openId=${openId}&masterSecret=${masterSecret}`)
        }
    }

    //查询我加入的
    function getJoined(){
        var sessionCommunity = JSON.parse( window.sessionStorage.getItem('foundCommunity'))
        if(sessionCommunity){
            foundCommunity = sessionCommunity;
            var arr = sessionCommunity.foundList;
            $('.hot_menu_item').removeClass('hot_menu_active')
            $('.hot_menu_item').eq(foundCommunity.queryIndex).addClass('hot_menu_active')
           getAnyMore(foundCommunity.currentPage,foundCommunity.totalPages )
           renderHtml(arr);
           $('.scroll_wrap').scrollTop(foundCommunity.scrollTop)
           window.sessionStorage.clear()
        }else{
            $.ajax({
                crossDomain: true,
                type: "GET",
                jsonp: "callback",
                // async: false,
                jsonpCallback: "successCallback",
                url: API + "/dynamic/queryDynamicListByOpenId.shtml",
                //提交的数据
                headers:{
                    openId: openId,
                    signature: signature,
                    nonceStr: nonceStr,
                    timestamp: timestamp,
                    appId: appId,
                },
                data: {
                    currentPage: foundCommunity.currentPage,
                    pageSize: 10
                },
                success: function (data) {
                    
                    if(!data.status === 0){
                        Toast(data.msg);
                        return
                    }
                    var list = data.list
                    foundCommunity.currentPage = data.pageInfo.currentPage
                    foundCommunity.totalPages = data.pageInfo.totalPages
                    getAnyMore(foundCommunity.currentPage,foundCommunity.totalPages )
                    list.forEach(function(item){
                        foundCommunity.foundList.push(item)
                    })
                    renderHtml(list)
                },
                error: function () {
                    Toast('出错啦')
                }
            })
        }
        
    }
    
    //按照分类查询贴子
    /**
     * @param {string} code 分类code
     */
    function getClassData(code){
        $.ajax({
            crossDomain: true,
            type: "GET",
            jsonp: "callback",
            jsonpCallback: "successCallback",
            url: API + "/dynamic/queryDynamicListByComType.shtml",
            //提交的数据
            headers:{
                openId: openId,
                signature: signature,
                nonceStr: nonceStr,
                timestamp: timestamp,
                appId: appId,
            },
            data: {
                communityType:code,
                currentPage: foundCommunity.currentPage,
                pageSize:10
            },
            success: function (data) {
                if(!data.status === 0){
                    Toast(data.msg);
                    return
                }
                var list = data.list
                foundCommunity.currentPage = data.pageInfo.currentPage
                foundCommunity.totalPages = data.pageInfo.totalPages
                console.log("滚动加载其他",foundCommunity.currentPage,foundCommunity.totalPages)
                getAnyMore( foundCommunity.currentPage,foundCommunity.totalPages )
                list.forEach(function(item){
                    foundCommunity.foundList.push(item)
                })
                renderHtml(list)
            },
            error: function () {
                Toast('出错啦')
            }
        })
    }
    
    //渲染列表
    function renderHtml(arr){
      
        var htmlStr = ''
        arr.forEach(function (item){
            htmlStr = `   <div>
            <div class="community_item" onclick="toMessageInfo(${item.newsId})">
                <div class="community_item_top">
                    <div class=" community_item_head">
                        <img src="${item.headPic}" onerror="this.src='../img/demoimg/mm.jpg'"/>
                    </div>
                    <div style="flex:1;">
                        <div class="community_item_username">
                            <div><span>${item.createOper}</span></div>
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
                                <img src="${IMGAPI+item.icon}"alt="" onerror="this.src='../img/dbm_images/dbm_default.png'">
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="community_item_operate">
                <div class="operate_box">
                    <div>
                        <span class="iconfont icon-xin operate_icon"></span>
                        <span class="operate_count">${item.upVoteCount}</span>
                    </div>
                    <div>
                        <span class="iconfont icon-duihua operate_icon"></span>
                        <span class="operate_count">${item.commentNum}</span>
                    </div>
                    <div>
                        
                    </div>
                </div>
            </div>
            <div class="split_line"></div>
        </div>`
        $('.community_body').append(htmlStr)
        })
        $('#thumbs a').on('click',function(e){
            e.stopPropagation();
            return
        })
        $('#thumbs a').touchTouch();
    }

    /**
 * 去贴子详情
 * @param {*} id 贴子ID
 */
function toMessageInfo(id){
    foundCommunity.scrollTop = $('.scroll_wrap').scrollTop()
    window.sessionStorage.setItem('foundCommunity',JSON.stringify(foundCommunity))
    if (checkSystem()) {
        window.location.href =`./dynamicDetails.html?openId=${openId}&masterSecret=${masterSecret}&newsId=${id}`
        } else {
         data_href(`./dynamicDetails.html?openId=${openId}&masterSecret=${masterSecret}&newsId${id}`)
        }
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

