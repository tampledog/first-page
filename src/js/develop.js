function playVideo() {
    $(document).on('click', '.js-open-video', function () {
        var that = $(this);
       var src = $(this).parents('.video__box').find('.video__frame').attr('src');
       console.log(src);
        $(this).parents('.video__box').find('.video__frame').attr('src', src+'?autoplay=1&showinfo=0&controls=0&rel=0&modestbranding=1');
        setTimeout(function () {
            that.parents('.video__box').find('.video__frame').css('z-index', 100);
        }, 300);

    });
}

function changeBG() {
    $(document).on('click', '.js-bg', function (e) {

        e.preventDefault();
        var vid_id = $(this).data().vid;
        if (vid_id === 0) {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $('.index__body').css('display', 'block');
            } else {
                $(this).addClass('active');
                $('.index__body').css('display', 'none');
            }
        } else {
            $('.video-bg').fadeOut(400);
            $('.video-bg[data-vid="'+vid_id+'"]').fadeIn(400);
        }
    });
}

function openMenu() {
    $(document).on('click', '.js-cross', function () {
        console.log('click');
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('.main__menu-content').removeClass('active');
        } else {
            $(this).addClass('active');
            $('.main__menu-content').addClass('active');
        }
    });
}


function showVideos() {
    $(document).on('click', '.play-video', function () {
        $.fancybox.open({
            src  : '#video-popup'
        });
    });
}


$(document).ready(function () {
    showVideos();
    playVideo();
    changeBG();
    openMenu();
    // showNext();
});