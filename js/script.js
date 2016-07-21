// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

$(function() {

    // fix foundation toggle menu issue on mobile
    $('a.right-off-canvas-toggle').on('click',function() { });

    $(".demos-navigation").demoNav();

    $("#toggleCode").demoCodeExpander();

    $(".docs-navigation").stickyPanel({
        topOffset: 20,
        bottomOffset: 120,
        minWindowWidth: 641
    });

    $(".js-accordion").accordion();

    $(".docs-navigation").children().eq(0).treeView();
});