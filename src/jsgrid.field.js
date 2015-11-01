(function(jsGrid, $, undefined) {

    function Field(config) {
        $.extend(true, this, config);
        this.sortingFunc = this._getSortingFunc();
    }

    Field.prototype = {
        name: "",
        title: "",
        css: "",
        align: "",
        width: 100,

        visible: true,
        filtering: true,
        inserting: true,
        editing: true,
        sorting: true,
        sorter: "string", // name of SortStrategy or function to compare elements

        filterTranslations: {
            "eq" : ["==", "equal"],
            "ne" : ["!=", "not equal"],
            "lt" : ["<",  "less"],
            "le" : ["<=", "less or equal"],
            "gt" : [">",  "greater"],
            "ge" : [">=", "greater or equal"],
            "cn" : ["~",  "contains"],
            "nc" : ["!~", "does not contain"],
            "nu" : ["#",  "is null"],
            "nn" : ["!#", "is not null"],
            "bw" : ["^",  "begins with"],
            "bn" : ["!^", "does not begin with"],
            "ew" : ["$",  "ends with"],
            "en" : ["!$", "does not end with"],
            "in" : ["=",  "is in"],
            "ni" : ["!=", "is not in"]
        },

        showFilterOption: false,
        defaultFilterOption: "==",
        selectedFilterOption: ["==", "equal"],

        headerTemplate: function() {
            return this.title || this.name;
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
            this._value = value;
            return this.itemTemplate(value, item);
        },

        filterValue: function() {
            return "";
        },

        insertValue: function() {
            return "";
        },

        editValue: function() {
            return this._value;
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
        },

        _createFilterOption: function() {
            var thisField = this;

            var aMenu = $("<a />", { href : "#" }).css("float", "left").click(function() {
                $(this).find("div").slideToggle("fast");
            });

            aMenu.append("<span width='25px'>" + thisField.defaultFilterOption + "</span>");

            var menu = $("<div>").hide();

            var ul = $("<ul />").addClass("jsgrid-search-menu");
            $.each(this.filterOptions, function(index, value) {
                var shortText = thisField.filterTranslations[value][0];
                var longText = thisField.filterTranslations[value][1];

                var li = $("<li />").addClass("jsgrid-menu-item");

                var a = $("<a />")
                    .addClass("g-menu-item")
                    .attr("value", value)
                    .click(function() {
                        aMenu.find("span").text(shortText);
                        this.selectedFilterOption = thisField.filterTranslations[value];
                    });

                var table = $("<table />");
                var tr = $("<tr />");
                tr.append('<td width="25px">' + shortText + '</td>');
                tr.append('<td>' + longText + '</td>');

                table.append(tr);
                a.append(table);
                li.append(a);
                ul.append(li);
            });

            menu.append(ul);
            aMenu.append(menu);

            return aMenu;
        }
    };

    jsGrid.Field = Field;

}(jsGrid, jQuery));
