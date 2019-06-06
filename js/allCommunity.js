    
    var allCommunity = {
        classList:[],
        communityList:[],
        classCurrentPage:1,
        classTotalPages:0,
        currentPage:1,
        totalPages:0,
        classIndex:0,
        classScrollTop:0,
        scrollTop:0
    }
    //发帖添加属性
    $('#mine_href').attr('href',`./postmessage.html?h5from=mine&openId=${openId}&masterSecret=${masterSecret}`)
    //计算可滑动区域的高度
    computedScrollHeight();
      //获取左侧分类
    getAllData()
    function getAllData(){
        var sessionAll = JSON.parse(window.sessionStorage.getItem('allCommunity'))
        if(sessionAll){
            allCommunity = sessionAll
            renderClassHtml(allCommunity.classList)
            renderCommunityList(allCommunity.communityList)
            $(`div[incode="${allCommunity.classIndex}"]`).addClass('menu_active')
            allCommunity.classScrollTop = $('#classBox').scrollTop(allCommunity.classScrollTop)
            allCommunity.scrollTop = $('.community_listwrap').scrollTop(allCommunity.scrollTop)
            getAnyMore(allCommunity.currentPage,allCommunity.totalPages)
            window.sessionStorage.clear()

        }else{
            getLeftClass()
            getRightCommunity()
        }
    }  
   
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
                currentPage: allCommunity.classCurrentPage,
                pageSize:15
            },
            success: function (data) {
                if(data.status!==0){
                    Toast(data.msg)
                    return
                }
                allCommunity.classCurrentPage = data.pageInfo.currentPage;
                allCommunity.classTotalPages = data.pageInfo.totalPages;
                var classArr = data.list
                classArr.forEach(function(item){
                    allCommunity.classList.push(item)
                })
                renderClassHtml(classArr)
                getAnyMore(allCommunity.classCurrentPage,allCommunity.classTotalPages)
            },
            error: function () {
                Toast('出错啦')
            }
        })
     }
     
     function getRightCommunity(type){
        var typeCode = '' || type    //是否存在type 不存在则查全部
        
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
                currentPage: allCommunity.currentPage,
                communityType:typeCode,
                pageSize:15
            },
            success: function (data) {
                if(data.status!==0){
                    Toast(data.msg)
                    return
                }
                var CommunityArr = data.list
                allCommunity.currentPage = data.pageInfo.currentPage;
                allCommunity.totalPages = data.pageInfo.totalPages;
                CommunityArr.forEach(function(item){
                    allCommunity.communityList.push(item)
                })
               
                renderCommunityList(CommunityArr)
                getAnyMore(allCommunity.currentPage,allCommunity.totalPages)

            },
            error: function () {
                Toast('出错啦')
            }
        })
     }
     //渲染分类列表
     function renderClassHtml(arr){
         console.log(arr)
        var htmlStr = ''
        arr.forEach(function(item){
            htmlStr = `<div class="menu_item" incode="${item.incode}">
                            <div class="menu_itembox ">
                                <div class="menu_itemtext">
                                ${item.typeName}
                                </div>
                            </div>
                        </div>`
          $('#classBox').append(htmlStr)
        })
       
        // $('.menu_item').eq(0).addClass('menu_active')
        $('.menu_item').on('click',function(){
            $('.menu_item').removeClass('menu_active');
            $('.menu_item').addClass('menu_default');
            $(this).addClass('menu_active');
            var index =  $(this).attr('incode') 
            allCommunity.currentPage = 1;
            allCommunity.communityList.length = 0;
            allCommunity.classIndex = index
            $('#communityBox').html('')
            getRightCommunity(index)
        })
        
     }
     
     //渲染时社区列表
     function renderCommunityList(arr){
        var str = ''
        arr.forEach(function(item){
            str = `<div class="community_item" onclick="toCommunityInfo(${item.channelId})">
                        <div class="commuinty_img">
                            <img src="${item.communityIcon}"  onerror="this.src='../img/dbm_images/logo.png'" alt="">
                        </div>
                        <div class="community_name">
                            <span>${item.channelName}</span>
                        </div>
                    </div>`
         $('#communityBox').append(str)
        })
       

     }

     //去社区详情
     function toCommunityInfo(channelId){
        allCommunity.classScrollTop = $('#classBox').scrollTop()
        allCommunity.scrollTop = $('.community_listwrap').scrollTop()
        window.sessionStorage.setItem('allCommunity',JSON.stringify(allCommunity))
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
        if( allCommunity.currentPage >= allCommunity.totalPages){
            loading = false;
            return
        }else{
            allCommunity.currentPage ++
        }
        setTimeout(function () {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
            getRightCommunity()
            loading = false;
           
        }, 1000); //模拟延迟
    });
    var classLoading = false
    $('#classBox').infinite(50).on("infinite", function () {
        console.log(222)
        if (classLoading) return;
        classLoading = true;
        if( allCommunity.classCurrentPage >= allCommunity.classTotalPages){
            $('#noMore').css('display','block')
            $('#wait').css('display','none')
            classLoading = false;
            return
        }else{
            allCommunity.classCurrentPage ++
        }
        setTimeout(function () {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
            getLeftClass()
            classLoading = false;
           
        }, 1000); //模拟延迟
    });

    function getAnyMore(currentPage,totalPages){
  
        if(currentPage < totalPages){
            $('#noMore').css('display','none')
            $('#wait').css('display','block')
        }else{
            $('#noMore').css('display','block')
            $('#wait').css('display','none')
        }
    }
