$('#mHref').attr('href', `./addAddress.html?from=2&openId=${openId}&masterSecret=${masterSecret}`)
var wrapH = $('body').height()- $('.manageheaderbox').outerHeight();
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
          
            if (data.list.length == 0) {  
                $.hideLoading()             
                    $('#addressNull').css('display', 'block')
                    $('#addressBox').css('display','none')
             
            } else {
                $.hideLoading()        
                $('#addressNull').css('display', 'none')
                $('#addressBox').css('display','block')
            
                drawAddressList(data.list)
                drawHr();
                defaultAddress();
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
    arr.map( function(item) {
        var addressStr = `${item.provinceName,item.cityName,item.countyName,item.detailAddress}`
       
        htmlStr += `<div class="address-box" onclick="getAddressId(event,${item.addressId},'${item.contactPerson}',${item.contactPhone},'${addressStr}')">
        <div class="tophr"></div>
        <div class="address-item">
            <div class="receive-info"><span>收货信息：</span><span>${item.contactPerson}</span></div>
            <div class="receive-edit">
                <a id="mEditHref" onclick="toEditAddress(event)" href="./chengeAddress.html?from=2&openId=${openId}&masterSecret=${masterSecret}&addressId=${item.addressId}"><span>【修改】</span></a>
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
                    <input id="item${item.addressId}" type="radio" name="item" ${item.defaultType==0? '':'checked'} value="${item.addressId}" onclick="setDefaultAddress(event,${item.addressId})">
                    <label for="item${item.addressId}"></label>
            </div>
        </div>
    </div>
                    `
    })
    $('#addressBox').html(htmlStr)
}


function toEditAddress(event){
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
//设置默认地址
function setDefaultAddress(event, id) {
    event.stopPropagation()
    if (id == addressId) {
        return
    }
    var message = "您确定要设置为默认地址吗"
    dialogBox(message,
        function () {
            $.ajax({
                crossDomain: true,
                type: "GET",
                jsonp: "callback",
                jsonpCallback: "successCallback",
                //提交的网址
                url: API + "/address/setDefaultAddress.shtml",
                //提交的数据
                data: {
                    addressId: id
                },
                async: false,
                headers: {
                    'nonceStr': nonceStr,
                    'openId': openId,
                    'signature': signature,
                    'timestamp': timestamp,
                },
                success: function (data) {
                    if (data.status == 0) {
                        Toast("设置默认地址成功")
                    }
                }
            })
            defaultAddress()
        },
        function () {
            console.log('取消')
        }
    )

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
            addressId = data.obj.addressId
        }
    })
}

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
        
            queryAddress()
            Toast('删除成功')


        }
    })
}
//点击地址获取到 地址id
function getAddressId(event,id,contactPerson,contactPhone,addressStr) {
    event.stopPropagation()
    if (checkSystem()) {
        window.webkit.messageHandlers.haiyiJSCallNativeHandler.postMessage({
            "action": "manageAddress",
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
      
        window.android.haiyiJSCallNativeHandler('manageAddress',jsonStr)
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


function back() {
    goBackfn()
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