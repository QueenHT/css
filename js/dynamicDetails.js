var dHeight =$(window).height();
var xheader=$('.header_wrap').height();
var xfooter=$('.m-footer').height();
var Height=dHeight-xheader-xfooter-2;
$('.m-content').height(Height+"px");
alert($(window).height())
var $input= document.getElementById('commentInp')
    listenKeybord($input);
// function commentClick(){
//     $('#commentInp').focus();
//     alert('window',$(window).height())   
//     $('.comment-input-div').css('display',none)
// }
function listenKeybord($input){  

if(checkSystem()){  
    console.log(123)  
// IOS 键盘弹起：IOS 和 Android 输入框获取焦点键盘弹起
 $input.addEventListener('focus',function(){
      console.log('IOS 键盘弹起啦！');     
// IOS 键盘弹起后操作    
},false)
// IOS 键盘收起：IOS 点击输入框以外区域或点击收起按钮，输入框都会失去焦点，键盘会收起，
    $input.addEventListener('blur',()=>{
              console.log('IOS 键盘收起啦！');      
// IOS 键盘收起后操作    
})
}
}
if (checkSystem()) {     
// IOS 键盘弹起：IOS 和 Android 输入框获取焦点键盘弹起
$input.addEventListener('focus', function(){
      alert('IOS 键盘弹起啦！');      
// IOS 键盘弹起后操作    
},false)    
// IOS 键盘收起：IOS 点击输入框以外区域或点击收起按钮，输入框都会失去焦点，键盘会收起，
    $input.addEventListener('blur', () => {
             alert('IOS 键盘收起啦！');      
// IOS 键盘收起后操作    
})
}else{

     var originHeight=document.documentElement.clientHeight||document.body.clientHeight;  
    window.addEventListener('resize',function(){ 
    var  resizeHeight  = document.documentElement.clientHeight||document.body.clientHeight; 
   if(originHeight<resizeHeight) 
   {  
          alert('Android 键盘收起啦！');
   // Android 键盘收起后操作         
   }else{   
           alert('Android 键盘弹起啦！' );             
   // Android 键盘弹起后操作           
   }    
    originHeight= resizeHeight;        
   },false)
}
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