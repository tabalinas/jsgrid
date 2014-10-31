(function(jsGrid, $, undefined) {

    function Field(name, config) {
        this.name = name;
        $.extend(true, this, config);
        this.sortingFunc = this._getSortingFunc();
    }

    Field.prototype = {
        name: "",
        title: "",
        css: "",
        align: "",
        width: 100,
        
        filtering: true,
        inserting: true,
        editing: true,
        sorting: true,
        sorter: "String", // name of SortStrategy or function to compare elements

        headerTemplate: function() {
            return this.title;
        },

        itemTemplate: function(value, item) {
            return value;
        },

        filterTemplate: function() {
            return "";
        },

        insertTemplate: function() {
            return "";
        },

        editTemplate: function(value, item) {
            return this.itemTemplate(value, item);
        },

        filterValue: function(value) {
            return "";
        },

        insertValue: function() {
            return "";
        },

        editValue: function() {
            return "";
        },

        _getSortingFunc: function() {
            var sorter = this.sorter;

            if($.isFunction(sorter)) {
                return sorter;
            }

            if(typeof sorter === "string") {
                return jsGrid.sortStrategies[sorter];
            }

            throw Error("Wrong sorter for the field \"" + this.name + "\"!");
        }
    };
    
    jsGrid.Field = Field;
    
}(jsGrid, jQuery));