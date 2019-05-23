var dHeight =$(window).height();
var xheader=$('.header_wrap').height();
var xfooter=$('.m-footer').height();
var Height=dHeight-xheader-xfooter-2;
$('.m-content').height(Height+"px");
// alert($(window).height())
var $input= document.getElementById('commentInp')
//     listenKeybord($input);
function commentClick(){
    $('#commentInp').focus();
    $('.m-footer').css('display','none')
    $('.comment-input-div').css('display','block')    
}
$('#commentBtn').click(function(){
    $('.comment-input-div').css('display','none')
    $('.m-footer').css('display','flex')
})
function activeElementScrollIntoView(activeElement,delay){  
var editable = activeElement.getAttribute('contenteditable')  
// 输入框、textarea或富文本获取焦点后没有将该元素滚动到可视区  
if(activeElement.tagName=='INPUT'||activeElement.tagName=='TEXTAREA'||editable===''||editable)
    {
    setTimeout(function()
        {activeElement.scrollIntoView();
        },delay) 
    }
}
// ...
// Android 键盘弹起后操作
activeElementScrollIntoView($input,1000);
function back(){
    window.history.go(-1)
}
// 键盘收起时让页面自动滑到顶部
document.body.addEventListener('focusout', function (){ 
    window.scrollTo(0,0);
});
