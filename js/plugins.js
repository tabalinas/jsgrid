(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

(function ($) {

    $.fn.stickyPanel = function(options) {
        options = options || {};
        var $element = $(this);
        if(!$element.length)
            return;

        var windowWidth,
            width,
            height,
            fixed;

        var $window = $(window);
        var topOffset = options.topOffset || 0;
        var bottomOffset = options.bottomOffset || topOffset;
        var minWindowWidth = options.minWindowWidth || 0;
        var threshold = $element.offset().top - topOffset;

        var initDimensions = function() {
            windowWidth = $window.width();
            width = $element.outerWidth();
            fixed = false;
        };

        var fixPanel = function() {
            $element.css({
                position: "fixed",
                top: topOffset,
                bottom: bottomOffset,
                width: width
            });

            fixed = true;
        };

        var unfixPanel = function() {
            $element.css({
                position: "static",
                width: "auto"
            });

            fixed = false;
        };

        var scrollHandler = function() {
            if(windowWidth <= minWindowWidth) {
                unfixPanel();
                return;
            }

            var scrollTop = $window.scrollTop();

            if(!fixed && scrollTop > threshold) {
                fixPanel();
            } else if(fixed && scrollTop < threshold) {
                unfixPanel();
            }
        };

        var resizeHandler = function() {
            unfixPanel();
            initDimensions();
            scrollHandler();
        };

        $window.on({
            scroll: scrollHandler,
            resize: resizeHandler
        });

        initDimensions();
    };

    $.fn.demoNav = function() {
        var $element = $(this);
        if(!$element.length)
            return;

        var DEMO_SELECTED_CLASS = "demo-selected";

        var $links = $element.find("a");
        var $codes = $(".demo-code").find("pre");
        var $infos = $(".demo-info").find("p");

        $links.click(function(e) {
            var $link = $(e.target).closest("a");
            $links.removeClass(DEMO_SELECTED_CLASS);
            $link.addClass(DEMO_SELECTED_CLASS);

            $codes.hide()
                    .eq($link.parent().index()).show();

            $infos.hide()
                    .eq($link.parent().index()).show();
        });
    };

    $.fn.demoCodeExpander = function() {
        var $element = $(this);
        if(!$element.length)
            return;

        var isCodeHidden = true;

        $element.click(function(e) {
            var $button = $(e.target).closest("button");

            isCodeHidden = !isCodeHidden;
            $button.find("span").text(isCodeHidden ? "Show Code" : "Hide Code");
            $(".demo-code").slideToggle(isCodeHidden);
        });
    }

    $.fn.treeView = function() {
        var $element = $(this);
        if(!$element.length)
            return;

        var initTree = function($elem) {
            $elem.children().each(function() {
                initNode(this);
            });
        };

        var initNode = function(elem) {
            var $elem = $(elem).addClass("tree-node");

            var $subTree = $elem.find("ul").first();

            if(!$subTree.length) {
                $elem.addClass("tree-node-leaf");
                return;
            }

            $elem.addClass("tree-node-parent");
            $subTree.addClass("tree-subtree").hide();

            var $collapseButton = $("<i>").addClass("tree-toggle-button fa fa-plus-square-o")
                .on("click", function() {
                    $subTree.slideToggle();
                    $collapseButton.toggleClass("fa-plus-square-o fa-minus-square-o");
                });

            $elem.prepend($collapseButton);

            initTree($subTree);
        };

        initTree($element);
    };

}(jQuery));

