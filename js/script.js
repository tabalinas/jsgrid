// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

$(function() {
    var DEMO_SELECTED_CLASS = "demo-selected";

    var $links = $(".demos-navigation").find("a");
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


    var isCodeHidden = true;

    $("#toggleCode").click(function(e) {
        var $button = $(e.target).closest("button");

        isCodeHidden = !isCodeHidden;
        $button.find("span").text(isCodeHidden ? "Show Code" : "Hide Code");
        $(".demo-code").slideToggle(isCodeHidden);
    });
});