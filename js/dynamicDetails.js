var dHeight =$(window).height();
var xheader=$('.header_wrap').height();
var xfooter=$('.m-footer').height();
var Height=dHeight-xheader-xfooter-2;
$('.m-content').height(Height+"px");
alert($(window).height())
function commentClick(){
    $('#commentInp').click()
    alert('window',$(window).height())
   
    $('.comment-input-div').css('display',none)
}