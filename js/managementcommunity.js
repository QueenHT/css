var communityName=getParams('communityName');
var communityId=getQueryVariable('communityId');
var loading=false;
// 获取到上一个页面传过来的社区名称和id
var currentPage = 1
// 用来保存在data中拿到的list
var allList = []
// 请求数据
getallCommunity() 
computedScrollHeight();
    //计算可滑动区域的高度
function computedScrollHeight(){
    var wrapH = $('body').height()- $('.header_wrap').outerHeight();
    $('.g-body').css('height',`${wrapH+50}px`);
    // 更改header头部名称
    $('.header_name').html(communityName)
}
function back(){
    window.history.go(-1)
  }
  $('#mineCommunity').pullToRefresh({
    onRefresh: function () {
        
        getallCommunity()
        setTimeout(function () {
            $('#mineCommunity').pullToRefreshDone();
        }, 1500)
    },
    onPull: function (percent) {
        /* 用户下拉过程中会触发，接收一个百分比表示用户下拉的比例 */
    },
    distance: 50 /* 下拉刷新的触发距离， 注意，如果你重新定义了这个值，那么你需要重载一部分CSS才可以，请参考下面的自定义样式部分 */
});

$('#mineCommunity').infinite(50).on("infinite", function () {
    if (loading) return;
    loading = true;
    setTimeout(function () {       
        getallCommunityMore()
        loading = false;
    }, 1000); //模拟延迟
});
function getallCommunityMore() {
    currentPage++;
    $.ajax({
        //提交数据的类型 POST GET
        crossDomain: true,
        type: "GET",
        jsonp: "callback",
        jsonpCallback: "successCallback",
        //提交的网址
        url: API + `/community/getCommuityMemberList.shtml?currentPage=${currentPage}&channelId=${communityId}&pageSize=15`,
        //提交的数据
        data: {},
        //成功返回之后调用的函数
        headers: {
            'nonceStr': nonceStr,
            'openId': openId,
            'signature': signature,
            'timestamp': timestamp,
            'appId': appId,
        },
        success: function (data) {
            currentPage = data.pageInfo.currentPage
            totalPages = data.pageInfo.totalPages
            var gameLen = data.list.length            
            if (gameLen == 0) {
                rendGameHtml(allList)
                $('#noMore').css('display', 'block')
                $('#wait').css('display', 'none')
            } else {
                for(var i=0;i<gameLen;i++){
                    allList.push(data.list[i])
                }
                rendGameHtml(allList)
                uploadFlag(currentPage,totalPages)

            }

        },
        //调用出错执行的函数
        error: function () {
            //请求出错处理
        }
    });
}
function getallCommunity() {
    currentPage = 1
    allList = []
    $('#noMore').css('display', 'none')
    $.ajax({
        //提交数据的类型 POST GET
        crossDomain: true,
        type: "GET",
        jsonp: "callback",
        jsonpCallback: "successCallback",
        //提交的网址
        url: API + `/community/getCommuityMemberList.shtml?currentPage=${currentPage}&channelId=${communityId}&pageSize=15`,
        //提交的数据
        data: {},
        //成功返回之后调用的函数
        headers: {
            'nonceStr': nonceStr,
            'openId': openId,
            'signature': signature,
            'timestamp': timestamp,
            'appId': appId,
        },
        success: function (data) {
            console.log(data)
         
           if(data.status==0){
            $.hideLoading()
            currentPage = data.pageInfo.currentPage
            totalPages = data.pageInfo.totalPages
            var gameLen = data.list.length
            
            if (gameLen == 0) {
                rendGameHtml(allList)
                $('#noMore').css('display', 'block')
                $('#wait').css('display', 'none')
            } else {
                for(var i=0;i<gameLen;i++){
                    allList.push(data.list[i])
                }
                rendGameHtml(allList)
                uploadFlag(currentPage,totalPages)

            }
           }else{
            $.hideLoading()
            Toast('加载失败')
           }

        },
        //调用出错执行的函数
        error: function () {
            //请求出错处理
            $.hideLoading()
            Toast('加载失败')
        }
    });
}
function rendGameHtml(arr) {
    var str = '';
    var len = arr.length;
    for (var i = 0; i < len; i++) { 
        str += `
        <div class="m-content-div" style=" height:1.6rem;padding-bottom: 0;">
            <div class="g-left">
                <div class="g-img">
                        <img src=" ${IMGAPI+arr[i].headPic}" onerror="this.src='../img/dbm_images/logo.png'" alt="">
                </div>
            </div>
            <div class="g-center" style="width: 58%">
                <div class="g-people" style="line-height: 1.2rem;">
                ${arr[i].nickName}
                </div>
            </div>
            <div class="g-gl-right">
                <div class="g-sz-btn" style="display:${arr[i].sortOrder==0?'block':'none'}">
                    社长
                </div>
                <div class="g-gl-btn" style="display:${arr[i].sortOrder==1?'block':'none'}" onclick="delmember( ${arr[i].confId})">
                        删除
                    </div>
            </div>
        </div> 
             `
           
    }
    $(`#allCommunity`).html(str)
}
function uploadFlag(currentPage,totalPages){
    $('#noMore').css('display', 'none')
    if (currentPage < totalPages) {
        $('#wait').css('display', 'block')
        $('#noMore').css('display', 'none')
    } else {
        $('#wait').css('display', 'none')
        $('#noMore').css('display', 'block')
    }
}
function delmember(id){
    $.showLoading('正在删除')
    $.ajax({
        //提交数据的类型 POST GET
        crossDomain: true,
        type: "GET",
        jsonp: "callback",
        jsonpCallback: "successCallback",
        //提交的网址
        url: API + `/community/delCommunityMember.shtml?confId=${id}`,
        //提交的数据
        data: {},
        //成功返回之后调用的函数
        headers: {
            'nonceStr': nonceStr,
            'openId': openId,
            'signature': signature,
            'timestamp': timestamp,
        },
        success: function (data) {           
           if(data.status==0){
            $.hideLoading()  
            Toast('删除成功')
            $('#noMore').css('display', 'none')
            getallCommunity() 
           }else{
            $.hideLoading()
            Toast('删除失败')
           }

        },
        //调用出错执行的函数
        error: function () {
            //请求出错处理
            $.hideLoading()
            Toast('删除失败')
        }
    });
}