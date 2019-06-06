var manageArea = [] //可用地区
var manageCity = [] //某地区下的城市
var manageCounty = [] //某城市下的县
//进入时获取的地址
var firstAddress = {
    area:'',
    city:'',
    county:'',  
}
//修改后的地址Code
var lastCode = {
    areaCode:'',
    cityCode:'',
    countyCode:'',  
}
//修改后的地址
var lastAddress = {

}
//获取地址信息
getAddressInfo();

function getAddressInfo(){
  var id = getQueryVariable("addressId");
  $.ajax({
    crossDomain: true,
    type: "GET",
    jsonp: "callback",
    jsonpCallback: "successCallback",
    headers: {
        'nonceStr': nonceStr,
        'openId': openId,
        'signature': signature,
        'timestamp': timestamp,
    },
    url: API + "/address/getUserPostAddressById.shtml?" ,
    data: {
      addressId:id
    },
    success: function(data) {
      var addressData = data.obj
      firstAddress.area = addressData.provinceName
      firstAddress.city = addressData.cityName
      firstAddress.county = addressData.countyName
      $('#addressOne').text(addressData.provinceName+addressData.cityName+addressData.countyName)
      $('#addressTwo').text(addressData.detailAddress)
      $('#userName').text(addressData.contactPerson)
      $('#userPhone').text(addressData.contactPhone)
      if(addressData.defaultType==1){
        $('#defaddress').attr('checked','checked')
      }
      //获取code
      if(getQueryVariable('area')){
        firstAddress.area = decodeURI(getQueryVariable('area'))
        firstAddress.city = decodeURI(getQueryVariable('city'))
        firstAddress.county = decodeURI(getQueryVariable('county'))
        $('#addressOne').text(decodeURI(getQueryVariable('area'))+decodeURI(getQueryVariable('city'))+decodeURI(getQueryVariable('county')))
        $('#addressTwo').text('')
      }
      getAdressAreaCode();
    }
  });
}
//设置默认地址
function setDefaultAddress( id ) {
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
          nonceStr: nonceStr,
          openId: openId,
          signature: signature,
          timestamp: timestamp
        },
        success: function(data) {
          if(data.status === 0){
            $.toast('保存成功')
            setTimeout(() => {
              if (checkSystem()) {
                window.location.href = `./addressList.html?openId=${openId}&masterSecret=${masterSecret}`;
              } else {
                data_href(`./addressList.html?openId=${openId}&masterSecret=${masterSecret}`);
              } 
            },500);
            
          }else{
            $.toast('保存错误','cancel')
          }
          
        }
      });
}

//删除地址
function handleDelete(event) {
  // $.showLoading("正在删除");
  var id = getQueryVariable("addressId");
  event.stopPropagation();
  $.confirm({
    title: '温馨提示',
    text: '确定要删除该地址吗',
    onOK: function () {
      $.showLoading('正在删除');
      //点击确认
      $.ajax({
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        url: API + "/address/deleteUserPostAddress.shtml",
        data: {
          recordId: id
        },
        headers: {
          nonceStr: nonceStr,
          openId: openId,
          signature: signature,
          timestamp: timestamp
        },
        success: function(data) {
          $.hideLoading('正在删除');
          if (data.status != 0) {
            $.toast("删除失败","cancel");
            return;
          }
            $.toast("删除成功");
          if (checkSystem()) {
            window.location.href = `./addressList.html?openId=${openId}&masterSecret=${masterSecret}`;
          } else {
            data_href(`./addressList.html?openId=${openId}&masterSecret=${masterSecret}`);
          }
         
        }
      });
    },
    onCancel: function () {
    }
  });

  
}
//地址管理返回地址列表
function data_href(url) {
  $("#href_true").attr("href", url); //传入参数
  document.getElementById("href_true").click(); //模拟点击
}
//w兼容ios android ios:location.href跳转 android用a标签隐式跳转
function back() {
    if (checkSystem()) {
      window.location.href = `./addressList.html?openId=${openId}&masterSecret=${masterSecret}`;
    } else {
      data_href(`./addressList.html?openId=${openId}&masterSecret=${masterSecret}`);
    }
}
$('#editAddressBtn').on('click',function(){
    var id = getQueryVariable("addressId");
    if (checkSystem()) {
      window.location.href = `./chooseAddress.html?addressId=${id}`;
    } else {
      data_href(`./chooseAddress.html?addressId=${id}`);
    }
})
//假设用户没有改变地址  需要找到当前地址的code

function getAdressAreaCode(){
  $.ajax({
    crossDomain: true,
    type: "GET",
    jsonp: "callback",
    jsonpCallback: "successCallback",
    url: API + "/areaCode/queryAreaCode.shtml",
    //提交的数据
    data: {},
    success: function (data) {
      manageArea = data.list
      manageArea.forEach(function(item) {
          if( item.areaName===firstAddress.area ){
             lastCode.areaCode = item.areaCode
          }
      });
      getCityCode(lastCode.areaCode)

    },
    error: function () {
        Toast('出错啦')
    }
});
}
/**
 * @param {*} areacode '上级地址code'
 */
function getCityCode(areacode){
      $.ajax({
        crossDomain: true,
        type: "GET",
        jsonp: "callback",
        jsonpCallback: "successCallback",
        url: API + "/areaCode/queryAreaCode.shtml",
        //提交的数据
        data: {
            fatherCode: areacode
        },
        success: function (data) {
          manageCity = data.list
          manageCity.forEach(function(item){
              if(item.areaName === firstAddress.city){
                lastCode.cityCode = item.areaCode
              }
          })
          getCountyCode(lastCode.cityCode)
        },
        error: function () {
            Toast('出错啦')
        }
    })
}
function getCountyCode( cityCode ){
  $.ajax({
    crossDomain: true,
    type: "GET",
    jsonp: "callback",
    jsonpCallback: "successCallback",
    url: API + "/areaCode/queryAreaCode.shtml",
    //提交的数据
    data: {
        fatherCode: cityCode
    },
    success: function (data) {
      manageCounty = data.list
      manageCounty.forEach(function(item){
          if(item.areaName === firstAddress.county){
            lastCode.countyCode = item.areaCode
          }
      })
     console.log(lastCode)
       
    },
    error: function () {
        Toast('出错啦')
    }
})
}
// 保存地址
function submitAddress(){
  var name = $('#userName').text()
  var phone = $('#userPhone').text()
  var addressId = getQueryVariable('addressId')
  var address = $('#addressTwo').text()
  
  $.ajax({
    crossDomain: true,
    type: "GET",
    url: API + "/address/updateUserPostAddress.shtml",
    data: {
        provinceCode: lastCode.areaCode,
        cityCode: lastCode.cityCode,
        countyCode: lastCode.countyCode,
        detailAddress: address,
        name: name,
        msisdn: phone,
        recordId: addressId,
    },
    headers: {
        'nonceStr': nonceStr,
        'openId': openId,
        'signature': signature,
        'timestamp': timestamp,
    },
    success: function (data) {
        // $.toast("已成功修改地址", "text");
        setDefaultAddress(addressId)
        
    },
    error: function () {
        $.toast('网络错误','cancel')
    }
  });
}