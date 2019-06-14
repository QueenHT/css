// 软键盘弹起和收起的处理

// 获取到焦点元素滚动到可视区
function activeElementScrollIntoView(activeElement,delay) 
{  
var editable = activeElement.getAttribute('contenteditable')  
// 输入框、textarea或富文本获取焦点后没有将该元素滚动到可视区  
if(activeElement.tagName =='INPUT'||activeElement.tagName =='TEXTAREA'|| editable ===''||editable){
      setTimeout(function(){activeElement.scrollIntoView();
      },delay)
  }
}
// ...
/**
 * ios键盘收起后页面不下滑
 * android键盘弹起后 input框被遮盖
 */
var judgeDeviceType = function(){ 
var ua = window.navigator.userAgent.toLocaleLowerCase();
var isIOS =/iphone|ipad|ipod/.test(ua);  
var isAndroid =/android/.test(ua);  
return{
    isIOS:isIOS,
    isAndroid:isAndroid 
}}();
// 监听输入框的软键盘弹起和收起事件
function listenKeybord($input){  

if(judgeDeviceType.isIOS) 
  {  
  // IOS 键盘弹起：IOS 和 Android 输入框获取焦点键盘弹起
      $input.addEventListener('focus',function(){
  // IOS 键盘弹起后操作    
  },false)    
// IOS 键盘收起：IOS 点击输入框以外区域或点击收起按钮，输入框都会失去焦点，键盘会收起，
    $input.addEventListener('blur',()=>{
     // 软键盘收起
$("input").on("blur",function(){
	window.scroll(0,0);//失焦后强制让页面归位
});     
// IOS 键盘收起后操作    
})  
}  
// Andriod 键盘收起：Andriod 键盘弹起或收起页面高度会发生变化，以此为依据获知键盘收起
if(judgeDeviceType.isAndroid) 
{    
 
var originHeight = document.documentElement.clientHeight || document.body.clientHeight;
    window.addEventListener('resize',function(){ 
var resizeHeight = document.documentElement.clientHeight|| document.body.clientHeight;    
if(originHeight < resizeHeight) {
// Android 键盘收起后操作      
}else{
// Android 键盘弹起后操作 
alert('弹起')
activeElementScrollIntoView($input,1000); 
}
 originHeight = resizeHeight;    
},false)  
}
}

var $inputs = document.querySelectorAll('input');
for(var i =0;i < $inputs.length; i++) {
  listenKeybord($inputs[i]);
}