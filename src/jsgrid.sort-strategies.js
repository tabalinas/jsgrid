(function(jsGrid, $, undefined) {
    
    var sortStrategies = {
        "String": function(str1, str2) {
            return str1.localeCompare(str2);
        },

        "Number": function(n1, n2) {
            return n1 - n2;
        },

        "Date": function(dt1, dt2) {
            return dt1 - dt2;
        },
        
        "NumberAsString": function(n1, n2) {
            return parseFloat(n1) - parseFloat(n2);
        }
    };

    jsGrid.sortStrategies = sortStrategies;
    
}(jsGrid, jQuery));