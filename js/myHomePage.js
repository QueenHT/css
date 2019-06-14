$(function(){
    computedScrollHeight();
    $('.nav_item').on('click',function(){
        $('.nav_item').removeClass('nav_item_active')
        $(this).addClass('nav_item_active')
        var activeIndex = $('.nav_item').index(this)
        $('.timebase').css('display','none')
        $('.timebase').eq(activeIndex).css('display','block')
    })
})
function computedScrollHeight(){
    var wrapH = $('body').height()- $('.header_wrap').outerHeight();
    
    $('.myhome-scroll').css('height',`${wrapH}px`);
    // 更改header头部名称   
}

function back(){
    goBackfn()
}