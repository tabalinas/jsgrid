// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

$(function() {

    $(".demos-navigation").demoNav();

    $("#toggleCode").demoCodeExpander();

    $(".docs-navigation").stickyPanel({
        topOffset: 20,
        bottomOffset: 120,
        minWindowWidth: 641
    });

    $(".docs-navigation").children().eq(0).treeView();
});