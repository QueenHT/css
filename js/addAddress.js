// appId 10008
function data_href(url) {
    $("#href_true").attr("href", url); //传入参数  
    document.getElementById("href_true").click(); //模拟点击  
}
var shengvalue;
var shivalue;
var xianvalue;
var sheng = [];
var shengall = {};
var shiall = {};
var xianall = {};
var shengId;
var shiId;
var xianId;
var picker1 = {
    title: "",
    cols: [{
        textAlign: 'center',
        values: []
    }]
}
var picker2 = {
    title: "",
    cols: [{
        textAlign: 'center',
        values: []
    }]
}

function back() {
   
        if (checkSystem()) {
            window.location.href = `./addressList.html?openId=${openId}&masterSecret=${masterSecret}`

        } else {
            data_href(`./addressList.html?openId=${openId}&masterSecret=${masterSecret}`)
        }
    
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}
$.ajax({
    //提交数据的类型 POST GET
    crossDomain: true,
    type: "GET",
    jsonp: "callback",
    jsonpCallback: "successCallback",
    //提交的网址
    url: API + "/areaCode/queryAreaCode.shtml",
    // url:"http://172.20.188.191:8111/api/userInfo/login.shtml",
    //提交的数据
    data: {},
    //成功返回之后调用的函数
    success: function (data) {
        shengall = data.list;
        data.list.forEach(function (item, index) {
            sheng.push(item.areaName)
        })
    },
    //调用出错执行的函数
    error: function () {
        //请求出错处理
    }
});
$("#picker").picker({
    title: "",
    cols: [{
        textAlign: 'center',
        values: sheng
    }]
});
$("#picker1").picker(picker1);
$("#picker2").picker(picker2);
document.getElementById('picker1').onclick = function () {

}
document.getElementById('picker').onchange = function () {
    document.getElementById('picker1').value = "";
    document.getElementById('picker2').value = ""
}
document.getElementById('picker1').onchange = function () {
    document.getElementById('picker2').value = ""
}

function comfirmcity() {
    shengvalue = document.getElementById('picker').value
    shivalue = document.getElementById('picker1').value
    xianvalue = document.getElementById('picker2').value
    if (shengvalue && !shivalue) {
        shengall.forEach(function (item) {
            if (item.areaName == shengvalue) {
                shengId = item.areaCode
                $.ajax({
                    //提交数据的类型 POST GET
                    crossDomain: true,
                    type: "GET",
                    jsonp: "callback",
                    jsonpCallback: "successCallback",
                    //提交的网址
                    url: API + "/areaCode/queryAreaCode.shtml?fatherCode=" + item.areaCode,
                    // url:"http://172.20.188.191:8111/api/userInfo/login.shtml",
                    //提交的数据
                    data: {},
                    headers: {
                        'nonceStr': nonceStr,
                        'openId': openId,
                        'signature': signature,
                        'timestamp': timestamp,
                    },
                    //成功返回之后调用的函数
                    success: function (data) {
                        var s = []
                        shiall = data.list;
                        data.list.forEach(function (item, index) {
                            s.push(item.areaName)
                        })
                        picker1.cols[0].values = s
                    },
                    //调用出错执行的函数
                    error: function () {
                        //请求出错处理
                    }
                });

            }
        })
    } else if (shivalue && !xianvalue) {
        shiall.forEach(function (item) {
            if (item.areaName == shivalue) {
                shiId = item.areaCode
                $.ajax({
                    //提交数据的类型 POST GET
                    crossDomain: true,
                    type: "GET",
                    jsonp: "callback",
                    jsonpCallback: "successCallback",
                    //提交的网址
                    url: API + "/areaCode/queryAreaCode.shtml?fatherCode=" + item.areaCode,
                    // url:"http://172.20.188.191:8111/api/userInfo/login.shtml",
                    //提交的数据
                    data: {},
                    headers: {
                        'nonceStr': nonceStr,
                        'openId': openId,
                        'signature': signature,
                        'timestamp': timestamp,
                    },
                    //成功返回之后调用的函数
                    success: function (data) {
                        var s = []
                        xianall = data.list
                        data.list.forEach(function (item, index) {
                            s.push(item.areaName)
                        })
                        picker2.cols[0].values = s
                    },
                    //调用出错执行的函数
                    error: function () {
                        //请求出错处理
                    }
                });

            }
        })
    } else if (xianvalue) {
        xianall.forEach(function (item) {
            if (item.areaName == xianvalue) {
                xianId = item.areaCode
            }
        })
    }
}

function confirm() {
    var name;
    var phone;
    var address;
    var iszhixia = false;
    name = document.getElementById('name').value
    phone = document.getElementById('phone').value
    address = document.getElementById('address').value
    if (shengvalue == "香港" || shengvalue == "澳门" || shengvalue == "台湾省") {
        iszhixia = true
    }
    if (!name) {
        $.toast("姓名不能为空", "text");
    } else if (!phone) {
        $.toast("手机号不能为空", "text");
    } else if (!address) {
        $.toast("详细地址不能为空", "text");
    } else if (!shengvalue) {
        $.toast("省份不能为空", "text");
    } else if (!shivalue && iszhixia == false) {
        $.toast("城市不能为空", "text");
    } else if (!xianvalue && iszhixia == false) {
        $.toast("县区不能为空", "text");
    } else {
        $.showLoading('正在提交')
        $.ajax({
            //提交数据的类型 POST GET
            crossDomain: true,
            type: "GET",
            //提交的网址
            url: API + "/address/addUserPostAddress.shtml",
            // url:"http://172.20.188.191:8111/api/userInfo/login.shtml",
            //提交的数据
            data: {
                provinceCode: shengId,
                cityCode: shiId,
                countyCode: xianId,
                detailAddress: address,
                name: name,
                msisdn: phone
            },
            headers: {
                'nonceStr': nonceStr,
                'openId': openId,
                'signature': signature,
                'timestamp': timestamp,
            },
            //返回数据的格式
            //成功返回之后调用的函数
            success: function (data) {
                $.hideLoading()
                $.toast("已成功添加地址", "text");
         
                    if (checkSystem()) {
                        setTimeout(function () {
                            window.location.href =
                                `./addressList.html?openId=${openId}&masterSecret=${masterSecret}`
                        }, 1000)
                    } else {
                        setTimeout(function () {
                            data_href(
                                `./addressList.html?openId=${openId}&masterSecret=${masterSecret}`
                                )
                        }, 1000)
                    }
                
            },
            //调用出错执行的函数
            error: function () {
                //请求出错处理
                $.hideLoading()
                $.toast("提交失败", "text");
            }
        });
    }
}

function checkSystem() {
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        //这个是安卓操作系统
        return 0
    }
    if (isIOS) {
        //这个是ios操作系统
        return 1
    }
}

function upperCase() {

    var phone = document.getElementById('phone').value;

    if (!(/^1[34578]\d{9}$/.test(phone))) {

        
        $.toast("手机号格式有误", "text");
        return false;

    }

}
$('#picker').click(function () {
    document.activeElement.blur();
})
$('#picker1').click(function () {
    document.activeElement.blur();
})
$('#picker2').click(function () {
    document.activeElement.blur();
})
