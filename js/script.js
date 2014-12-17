// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

(function ($) {

    $.fn.stickyPanel = function(options) {
        var $element = $(this);
        if(!$element.length || Modernizr.mq('only screen and (max-width: 641px)'))
            return;

        var $window = $(window);

        var offset = options.offset;
        var threshold = $element.offset().top - offset;
        var width = $element.outerWidth();
        var height = $window.height() - 2 * offset;

        var fixed = false;

        var onScroll = function() {
            var scrollTop = $window.scrollTop();

            if(!fixed && scrollTop > threshold) {
                $element.css({
                    position: "fixed",
                    top: offset,
                    width: width,
                    height: height
                });

                fixed = true;

            } else if(fixed && scrollTop < threshold) {
                $element.css({
                    position: "static",
                    top: 0,
                    width: "auto",
                    height: "auto"
                });

                fixed = false;
            }
        };

        $window.on("scroll", onScroll);

        $window.on("resize", function() {
            $element.css({
                position: "static",
                width: "auto"
            });
            fixed = false;
            width = $element.outerWidth();
            height = $window.height() - 2 * offset;

            onScroll();
        });
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

}(jQuery));


$(function() {

    $(".demos-navigation").demoNav();

    $("#toggleCode").demoCodeExpander();

    $(".docs-navigation").stickyPanel({
        offset: 20
    });
});