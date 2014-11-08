(function(jsGrid, $, undefined) {
    
    var sortStrategies = {
        string: function(str1, str2) {
            return str1.localeCompare(str2);
        },

        number: function(n1, n2) {
            return n1 - n2;
        },

        date: function(dt1, dt2) {
            return dt1 - dt2;
        },
        
        numberAsString: function(n1, n2) {
            return parseFloat(n1) - parseFloat(n2);
        }
    };

    jsGrid.sortStrategies = sortStrategies;
    
}(jsGrid, jQuery));