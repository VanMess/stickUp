jQuery(function($) {
    "use strict";

    var Context = function() {},
        _ctxList = {};
    Context.prototype = {
        selector: '',
        itemClass: '',
        itemHover: '',
        content: [],
        contentTop: [],
        jqDom: null,
        menuItems: [],
        height: 0,
        region: '',
        parentMarginTop: 0,
        top: 0,
        marginTop: 0,
        marginBottom: 0,
        onScroll: function(scrollDir, varscroll) {
            var contentView = null,
                testView = null,
                _me = this;

            // 计算并给适当元素添加 itemHover 类
            if ( !! _me.content && _me.content.length > 0) {
                var offset = null;
                for (var i = 0; i < _me.content.length; i++) {
                    offset = $('#' + _me.content[i] + '').offset();
                    _me.contentTop[i] = !! offset ? offset.top : 0;

                    // 之前這裡定義了一個bottomView
                    // 会在每次执行这个地方的时候都去创建一个函数
                    // 实际上是很没必要的性能损耗，所以这里将代码移动下面
                    if (scrollDir == 'down' && varscroll > _me.contentTop[i] - 50 && varscroll < _me.contentTop[i] + 50) {
                        $('.' + _me.itemClass).removeClass(_me.itemHover);
                        $('.' + _me.itemClass + ':eq(' + i + ')').addClass(_me.itemHover);
                    }
                    if (scrollDir == 'up') {
                        // 这里就是原来的bottomView代码
                        contentView = $('#' + _me.content[i] + '').height() * .4;
                        testView = _me.contentTop[i] - contentView;
                        if (varscroll > testView) {
                            $('.' + _me.itemClass).removeClass(_me.itemHover);
                            $('.' + _me.itemClass + ':eq(' + i + ')').addClass(_me.itemHover);
                        } else if (varscroll < 50) {
                            $('.' + _me.itemClass).removeClass(_me.itemHover);
                            $('.' + _me.itemClass + ':eq(0)').addClass(_me.itemHover);
                        }
                    }
                }
            }

            // 固定菜单栏目，使之固定（fixed）
            if (_me.top < varscroll + _me.marginTop) {
                _me.jqDom.addClass('isStuck');
                _me.jqDom.next().closest('div').css({
                    'margin-top': _me.height + _me.marginBottom + _me.parentMarginTop + 'px'
                }, 10);
                _me.jqDom.css("position", "fixed");
                _me.jqDom.css({
                    top: '0px'
                }, 10, function() {

                });
            };

            // 菜單欄目，使之不固定（relative）
            if (varscroll + _me.marginTop < _me.top) {
                _me.jqDom.removeClass('isStuck');
                _me.jqDom.next().closest('div').css({
                    'margin-top': _me.parentMarginTop + 'px'
                }, 10);
                _me.jqDom.css("position", "relative");
            };
        }
    };
    Context._init_ = function(option, dom, instance) {
        instance = instance || new Context();

        var _me = instance,
            objn = 0;
        _me.jqDom = $(dom);
        // adding a class to users div
        _me.jqDom.addClass('stuckMenu');

        //getting options
        if (option != null) {
            for (var o in option.parts) {
                if (option.parts.hasOwnProperty(o)) {
                    _me.content[objn] = option.parts[objn];
                    objn++;
                }
            }
            if (objn == 0) {
                console.log('warm:needs arguments');
            }

            _me.itemClass = option.itemClass;
            _me.itemHover = option.itemHover;
            if (option.topMargin != null) {
                if (option.topMargin == 'auto') {
                    _me.marginTop = parseInt(_me.jqDom.css('margin-top'));
                } else {
                    if (isNaN(option.topMargin) && option.topMargin.search("px") > 0) {
                        _me.marginTop = parseInt(option.topMargin.replace("px", ""));
                    } else if (!isNaN(parseInt(option.topMargin))) {
                        _me.marginTop = parseInt(option.topMargin);
                    } else {
                        console.log("incorrect argument, ignored.");
                        _me.marginTop = 0;
                    }
                }
            } else {
                _me.marginTop = 0;
            }
        }
        _me.height = parseInt(_me.jqDom.height());
        _me.marginBottom = parseInt(_me.jqDom.css('margin-bottom'));
        _me.parentMarginTop = parseInt(_me.jqDom.next().closest('div').css('margin-top'));
        _me.top = parseInt(_me.jqDom.offset().top);

        _ctxList[_me.selector] = _me;
    };

    // 问题：不支持一个页面中多个元素固定
    //		 不支持固定方向的设置
    //		 不支持回调事件
    $(document).ready(function() {
        var lastScrollTop = 0,
            scrollDir = 'down';

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
            if (!_ctxList[this.selector])
                Context._init_(options, this);
        }

        // 頁面滾動事件
        $(document).on('scroll', function() {
            var scrollOffest = parseInt($(document).scrollTop());
            for (var i in _ctxList) {
                _ctxList[i].onScroll(scrollDir, scrollOffest);
            }
        });
    });

});