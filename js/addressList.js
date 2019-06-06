$('#mHref').attr('href', `./addAddress.html?from=2&openId=${openId}&masterSecret=${masterSecret}`)
var wrapH = $('body').height()- $('.header_wrap').outerHeight();
$('#address_wrap').css('height',`${wrapH}px`)
var addressId;
queryAddress();

//跳转新增

//查询地址信息
function queryAddress() {
    $.showLoading('正在加载')
    $.ajax({
        crossDomain: true,
        type: "GET",
        jsonp: "callback",
        jsonpCallback: "successCallback",
        //提交的网址
        url: API + "/address/queryUserPostAddress.shtml",
        //提交的数据
        data: {},
        headers: {
            'nonceStr': nonceStr,
            'openId': openId,
            'signature': signature,
            'timestamp': timestamp,
        },
        success: function (data) {
            console.log(data)
            if (data.list.length == 0) {  
                $.hideLoading()             
                    $('#addressNull').css('display', 'block')
                    $('#addressBox').css('display','none')
            } else {
                $.hideLoading()        
                $('#addressNull').css('display', 'none')
                $('#addressBox').css('display','block')
                drawAddressList(data.list)
                // defaultAddress();
            }
        }
    })
}

/**
 * 渲染收货地址列表
 * @param {*} arr   地址列表数组
 */
function drawAddressList(arr) {
    var htmlStr = ''
    arr.map( function(item) {
        var addressStr = `${item.provinceName,item.cityName,item.countyName,item.detailAddress}`
       
        htmlStr += `<div class="addressbox_list" defaultaddress="${item.defaultType}" onclick="getAddressId(event,${item.addressId},'${item.contactPerson}',${item.contactPhone},'${addressStr}')">
        <div></div>
        <div class="address_right">
            <div class="address_rightwrap">
                <div class="address_username">
                    <span>${item.contactPerson}</span>
                    <span class="address_phone">电话:</span>
                    <span>${item.contactPhone}</span>
                </div>
                <div class="address_userinfo">
                    <div class="address_position">
                        <span>${item.provinceName},${item.cityName},${item.countyName},${item.detailAddress}</span>
                    </div>
                </div>
            </div>
            <a href="./addressManage.html?addressId=${item.addressId}">
                <div class="address_nextbtn">
                    <span class="iconfont icon-xiangyou"></span>
                </div>
            </a>
        </div>
    </div>`
    })
    $('#addressBox').html(htmlStr)
    $("div[defaultaddress='1']").addClass('address_default')
}


//查询地址是默认地址
function defaultAddress(id) {
    $.ajax({
        crossDomain: true,
        type: "GET",
        jsonp: "callback",
        jsonpCallback: "successCallback",
        //提交的网址
        url: API + "/address/queryDefaultPostAddress.shtml",
        //提交的数据
        data: {},
        headers: {
            'nonceStr': nonceStr,
            'openId': openId,
            'signature': signature,
            'timestamp': timestamp,
        },
        success: function (data) {
            // addressId = data.obj.addressId
        }
    })
}

//点击地址获取到 地址id
/**
 *  getAddressId() 用于向ios android传递 点击的地址信息 
 * @param {*} event   事件event
 * @param {*} id ‘地址id’
 * @param {*} contactPerson ‘联系人’
 * @param {*} contactPhone  '联系电话'
 * @param {*} addressStr    '地址拼接字符串'
 */
function getAddressId(event,id,contactPerson,contactPhone,addressStr) {
    console.log(event,id,contactPerson,contactPhone,addressStr)
    event.stopPropagation()
    if (checkSystem()) {
        window.webkit.messageHandlers.haiyiJSCallNativeHandler.postMessage({
            "action": "chooseAddress",
            "mAddressId": id,
            "contactPerson":contactPerson,
            "contactPhone":contactPhone,
            "addressStr":addressStr
        });
    } else {
       
        var json = {
            "mAddressId": id,
            "contactPerson":contactPerson,
            "contactPhone":contactPhone,
            "addressStr":addressStr
        };
        var jsonStr = JSON.stringify(json);
      
        window.android.haiyiJSCallNativeHandler('chooseAddress',jsonStr)
    }
}

function dialogBox(message, yesCallback, noCallback) {
    if (message) {
        $('.dialog-message').html(message);
    }
    // 显示遮罩和对话框
    $('.wrap-dialog').removeClass("hide");
    // 确定按钮
    $('#confirm').click(function () {
        $('.wrap-dialog').addClass("hide");
        yesCallback();
    });
    // 取消按钮
    $('#cancel').click(function () {
        $('.wrap-dialog').addClass("hide");
        noCallback();
    });
}

$('.address').pullToRefresh({
    onRefresh: function () {
        //刷新
        queryAddress();
        setTimeout(function () {
            $('.address').pullToRefreshDone();
        }, 1500)
    },
    onPull: function (percent) {
        /* 用户下拉过程中会触发，接收一个百分比表示用户下拉的比例 */ },
    distance: 50 /* 下拉刷新的触发距离， 注意，如果你重新定义了这个值，那么你需要重载一部分CSS才可以，请参考下面的自定义样式部分 */
});

// 返回
function back() {
    if (checkSystem()) {
        window.webkit.messageHandlers.haiyiJSCallNativeHandler.postMessage({
            "action": "goBack"
        });
    } else {
        window.android.haiyiJSCallNativeHandler('goBack', '')
    }
}