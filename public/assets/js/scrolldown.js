
    'use strick'
    function scrolldown(){
        var scrolled=$('.content-wrap.messages').height()+500;
        console.log(scrolled);
        $('.content-wrap.messages').animate({
            scrollTop:scrolled
        })
    }
    $(document).ready(function(){
        scrolldown();

    });
