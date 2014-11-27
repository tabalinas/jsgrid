(function(jsGrid, $, undefined) {
    
    function LoadIndicator(config) {
        this._init(config);
    }

    LoadIndicator.prototype = {

        container: "body",
        message: "Loading...",
        shading: true,

        _init: function(config) {
            $.extend(true, this, config);
        },

        show: function() {

        },

        hide: function() {

        }

    };

    jsGrid.LoadIndicator = LoadIndicator;
    
}(jsGrid, jQuery));