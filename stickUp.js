jQuery(function($) {
    // 问题：不支持一个页面中多个元素固定
    //		 不支持固定方向的设置
    //		 不支持回调事件
    $(document).ready(function() {
        var contentButton = [],
            contentTop = [],
            content = [],
            lastScrollTop = 0,
            scrollDir = '',
            itemClass = '',
            itemHover = '',
            menuSize = null,
            stickyHeight = 0,
            stickyMarginB = 0,
            currentMarginT = 0,
            topMargin = 0;

        $(window).scroll(function(event) {
            var st = $(this).scrollTop();
            if (st > lastScrollTop) {
                scrollDir = 'down';
            } else {
                scrollDir = 'up';
            }
            lastScrollTop = st;
        });

        // 初始化各类参数，即解析options的值
        $.fn.stickUp = function(options) {
            // adding a class to users div
            $(this).addClass('stuckMenu');
            //getting options
            var objn = 0;
            if (options != null) {
                for (var o in options.parts) {
                    if (options.parts.hasOwnProperty(o)) {
                        content[objn] = options.parts[objn];
                        objn++;
                    }
                }
                if (objn == 0) {
                    console.log('error:needs arguments');
                }

                itemClass = options.itemClass;
                itemHover = options.itemHover;
                if (options.topMargin != null) {
                    if (options.topMargin == 'auto') {
                        topMargin = parseInt($('.stuckMenu').css('margin-top'));
                    } else {
                        if (isNaN(options.topMargin) && options.topMargin.search("px") > 0) {
                            topMargin = parseInt(options.topMargin.replace("px", ""));
                        } else if (!isNaN(parseInt(options.topMargin))) {
                            topMargin = parseInt(options.topMargin);
                        } else {
                            console.log("incorrect argument, ignored.");
                            topMargin = 0;
                        }
                    }
                } else {
                    topMargin = 0;
                }
                menuSize = $('.' + itemClass).size();
            }
            stickyHeight = parseInt($(this).height());
            stickyMarginB = parseInt($(this).css('margin-bottom'));
            currentMarginT = parseInt($(this).next().closest('div').css('margin-top'));
            vartop = parseInt($(this).offset().top);
            //$(this).find('*').removeClass(itemHover);
        }

        // 頁面滾動事件
        $(document).on('scroll', function() {
            varscroll = parseInt($(document).scrollTop());

            // 计算并给适当元素添加 itemHover 类
            if ( !! menuSize) {
                for (var i = 0; i < menuSize; i++) {
                    contentTop[i] = $('#' + content[i] + '').offset().top;

                    // 之前這裡定義了一個bottomView
                    // 会在每次执行这个地方的时候都去创建一个函数
                    // 实际上是很没必要的性能损耗，所以这里将代码移动下面
                    if (scrollDir == 'down' && varscroll > contentTop[i] - 50 && varscroll < contentTop[i] + 50) {
                        $('.' + itemClass).removeClass(itemHover);
                        $('.' + itemClass + ':eq(' + i + ')').addClass(itemHover);
                    }
                    if (scrollDir == 'up') {
                        // 这里就是原来的bottomView代码
                        contentView = $('#' + content[i] + '').height() * .4;
                        testView = contentTop[i] - contentView;
                        //console.log(varscroll);
                        if (varscroll > testView) {
                            $('.' + itemClass).removeClass(itemHover);
                            $('.' + itemClass + ':eq(' + i + ')').addClass(itemHover);
                        } else if (varscroll < 50) {
                            $('.' + itemClass).removeClass(itemHover);
                            $('.' + itemClass + ':eq(0)').addClass(itemHover);
                        }
                    }
                }
            }

            // 固定菜单栏目，使之固定（fixed）
            if (vartop < varscroll + topMargin) {
                $('.stuckMenu').addClass('isStuck');
                $('.stuckMenu').next().closest('div').css({
                    'margin-top': stickyHeight + stickyMarginB + currentMarginT + 'px'
                }, 10);
                $('.stuckMenu').css("position", "fixed");
                $('.isStuck').css({
                    top: '0px'
                }, 10, function() {

                });
            };

            // 菜單欄目，使之不固定（relative）
            if (varscroll + topMargin < vartop) {
                $('.stuckMenu').removeClass('isStuck');
                $('.stuckMenu').next().closest('div').css({
                    'margin-top': currentMarginT + 'px'
                }, 10);
                $('.stuckMenu').css("position", "relative");
            };
        });
    });

});