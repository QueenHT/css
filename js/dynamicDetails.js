var dHeight =$(window).height();
var xheader=$('.header_wrap').height();
var xfooter=$('.m-footer').height();
var Height=dHeight-xheader-xfooter-2;
$('.m-content').height(Height+"px");
<<<<<<< HEAD
alert($(window).height())
function commentClick(){
    $('#commentInp').click()
    alert('window',$(window).height())
   
    $('.comment-input-div').css('display',none)
}
=======
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
>>>>>>> e1c93c1a4c3214d9a1be5b4ef400aaa4c3f3c1db
