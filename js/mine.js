computedScrollHeight();
var currentPage = 1
// 用来保存在data中拿到的list
var allList = []
// 请求数据
getallCommunity() 
    //计算可滑动区域的高度
function computedScrollHeight(){
    var wrapH = $('body').height()- $('.header_wrap').outerHeight();
    $('.g-body').css('height',`${wrapH}px`);
}
// 进入社区管理 参数为社区的名称以及社区id
function entermanagement(name,id){
    if (checkSystem()) {
        window.location.href = `./managementcommunity.html?openId=${openId}&masterSecret=${masterSecret}&communityName=${name}&communityId=${id}`

    } else {
        data_href(`./managementcommunity.html?openId=${openId}&masterSecret=${masterSecret}&communityName=${name}&communityId=${id}`)
    }
}
$('#mineCommunity').pullToRefresh({
    onRefresh: function () {
        currentPage = 1
        allList = []
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
    $.showLoading('正在加载') 
    $.ajax({
        //提交数据的类型 POST GET
        crossDomain: true,
        type: "GET",
        jsonp: "callback",
        jsonpCallback: "successCallback",
        //提交的网址
        url: API + `/community/getMineCommunityList.shtml?currentPage=${currentPage}`,
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
                console.log('数组',allList)
                rendGameHtml(allList)
                uploadFlag(currentPage,totalPages)

            }

        },
        //调用出错执行的函数
        error: function () {
           $.hideLoading()
            Toast('加载失败')
        }
    });
}
function getallCommunity() {
    $.showLoading('正在加载') 
    $('#noMore').css('display', 'none')
    $.ajax({
        //提交数据的类型 POST GET
        crossDomain: true,
        type: "GET",
        jsonp: "callback",
        jsonpCallback: "successCallback",
        //提交的网址
        url: API + `/community/getMineCommunityList.shtml?currentPage=${currentPage}`,
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
    console.log(arr)   
    var str = '';
    var len = arr.length;
    for (var i = 0; i < len; i++) { 
        str += `
        <div class="m-content-div">
                <div class="g-left">
                    <div class="g-img">
                            <img src="${arr[i].communityIcon}" alt="">
                    </div>
                </div>
                <div class="g-center">
                    <div class="g-name">
                       ${arr[i].channelName}
                    </div>
                    <div class="g-num">
                        人数: ${arr[i].attentionCount}
                    </div>
                    <div class="g-people">
                        创建人:  ${arr[i].nickName}
                    </div>
                </div>
                <div class="g-right">
                    <div class="g-btn" style="display:${arr[i].isCreateOper==1?'block':'none'}" onclick="entermanagement('${arr[i].channelName}',${arr[i].channelId})">
                        社区成员管理
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