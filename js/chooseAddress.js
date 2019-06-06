$('#cHref').attr('href', `./addAddress.html?from=1&openId=${openId}&masterSecret=${masterSecret}`)
var wrapH = $('body').height()- $('.manageheaderbox').outerHeight();

$('#address_wrap').css('height',`${wrapH}px`)
queryAddress();
//查询地址信息
function queryAddress() {
    $.showLoading('加载中')
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
            $.hideLoading()
            if (data.list.length == 0) {
                $('#addressNull').css('display', 'block')
                $('#addressBox').css('display', 'none')

            } else {

                $('#addressNull').css('display', 'none')
                $('#addressBox').css('display', 'block')

                drawAddressList(data.list)
                drawHr();
            }
        },
        error:function(){
            $.hideLoading()
        }
    })
}
/**
 * 渲染收货地址列表
 * @param {*} arr   地址列表数组
 */
function drawAddressList(arr) {
    var htmlStr = ''
    arr.map( function( item ) {
        var addressStr = `${item.provinceName+item.cityName+item.countyName+item.detailAddress}`
        htmlStr += `<div class="address-box" onclick="chooseAddress(event,${item.addressId},'${item.contactPerson}',${item.contactPhone},'${addressStr}')">
        <div class="tophr"></div>
        <div class="address-item">
            <div class="receive-info"><span>收货信息：</span><span>${item.contactPerson}</span></div>
            <div class="receive-edit">
            <a id="mEditHref" onclick="toEditAddress(event)" href="./chengeAddress.html?from=1&openId=${openId}&masterSecret=${masterSecret}&addressId=${item.addressId}"><span>【修改】</span></a>
                <span onclick="deleteAddress(event,${item.addressId})">【删除】</span>
            </div>
        </div>
        <div class="address-item">
            <div><span>手机号码：</span><span>${item.contactPhone}</span></div>
        </div>
        <div class="address-item addres-manger">
            <div class="itemname">详细地址：</div>
            <div class="address-info">${item.provinceName,item.cityName,item.countyName,item.detailAddress}</div>
            <div class="address-radio">
                    <input id="item${item.addressId}" type="radio" name="item" ${item.defaultType==0? '':'checked'} value="${item.addressId}">
                    <label for="item${item.addressId}"></label>
            </div>
        </div>
    </div>
                    `
    })
    $('#addressBox').html(htmlStr)
}
//去修改页面
function toEditAddress(event) {
    event.stopPropagation()
}
//渲染分割线
function drawHr() {

    var littlediv1 = "<div class='littdivcss'></div><div class='littdivpaddingcss'></div>";
    var docwidth = $(document).width();
    var numdiv = docwidth % 35 == 0 ? docwidth / 35 : (docwidth / 35) - 1;
    for (var i = 0; i < numdiv; i++) {
        $(".tophr").append(littlediv1);
    }
}

//选择地址
function chooseAddress(event,id, contactPerson, contactPhone,addressStr) { //地址id
    event.stopPropagation()
    
    if (checkSystem()) {
        window.webkit.messageHandlers.haiyiJSCallNativeHandler.postMessage({
            "action": "chooseAddress",
            "cAddressId": id,
            "contactPerson": contactPerson,
            "contactPhone": contactPhone,
            "addressStr": addressStr
        });
    } else {
        var json = {
            "cAddressId": id,
            "contactPerson": contactPerson,
            "contactPhone": contactPhone,
            "addressStr": addressStr
        };
        var jsonStr = JSON.stringify(json);
        window.android.haiyiJSCallNativeHandler('chooseAddress', jsonStr)
    }

}
//编辑地址

//删除地址
function deleteAddress(event, id) {
    $.showLoading('正在删除')
    event.stopPropagation()
    $.ajax({
        type: 'GET',
        contentType: "application/json;charset=UTF-8",
        url: API + '/address/deleteUserPostAddress.shtml',
        data: {
            recordId: id
        },
        headers: {
            'nonceStr': nonceStr,
            'openId': openId,
            'signature': signature,
            'timestamp': timestamp
        },
        success: function (data) {
            $.hideLoading()
            if (data.status != 0) {
                Toast('删除失败')
                return
            }
            Toast('删除成功')
            queryAddress()

        }
    })
}

//返回

function back() {

    if (checkSystem()) {
        console.log(checkSystem())
        window.webkit.messageHandlers.haiyiJSCallNativeHandler.postMessage({
            "action": "goBack"
        });
    } else {
        console.log(checkSystem())
        window.android.haiyiJSCallNativeHandler('goBack', '')
    }
}

//下拉刷新
$('.address').pullToRefresh({
    onRefresh: function () {
        //刷新
        queryAddress();
        setTimeout(function () {
            $('.address').pullToRefreshDone();
        }, 1500)
    },
    onPull: function (percent) {
        /* 用户下拉过程中会触发，接收一个百分比表示用户下拉的比例 */
    },
    distance: 50 /* 下拉刷新的触发距离， 注意，如果你重新定义了这个值，那么你需要重载一部分CSS才可以，请参考下面的自定义样式部分 */
});