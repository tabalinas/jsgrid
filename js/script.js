// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

$(function() {
    var DEMO_SELECTED_CLASS = "demo-selected";

    var $links = $(".demos-navigation").find("a");

    $links.click(function(e) {
        $links.removeClass(DEMO_SELECTED_CLASS);
        $(e.target).closest("a").addClass(DEMO_SELECTED_CLASS);
    });
});