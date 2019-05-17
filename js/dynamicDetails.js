var dHeight =$(window).height();
var xheader=$('.header_wrap').height();
var xfooter=$('.m-footer').height();
var Height=dHeight-xheader-xfooter-2;
$('.m-content').height(Height+"px");
// alert($(window).height())
// $("input").trigger("click").focus();

function commentClick(){
    
    $('.comment-input-div').css('display','block')
    $("#commentInp").trigger("click").focus();
    // $('#commentInp').focus(); 
  

}

document.getElementById("commentInp").addEventListener("focus", function(){
            alert('获取焦点')
});