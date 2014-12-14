// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

$(function() {
    var DEMO_SELECTED_CLASS = "demo-selected";

    var $links = $(".demos-navigation").find("a");
    var $codes = $(".demo-code").find("pre");

    $links.click(function(e) {
        var $link = $(e.target).closest("a");
        $links.removeClass(DEMO_SELECTED_CLASS);
        $link.addClass(DEMO_SELECTED_CLASS);

        $codes.hide();
        $codes.eq($link.parent().index()).show();
    });
});