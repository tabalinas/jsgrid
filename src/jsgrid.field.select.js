(function(jsGrid, $, undefined) {

    var TextField = jsGrid.TextField;

    function SelectField(name, config) {
        this.items = [];
        this.selectedIndex = -1;
        this.valueField = "";
        this.textField = "";

        TextField.call(this, name, config);
    }

    SelectField.prototype = new TextField("", {
        
        sorter: "number",
        autosearch: true,
        selectedIndex: 0,

        itemTemplate: function(value) {
            var items = this.items,
                valueField = this.valueField,
                textField = this.textField,
                resultItem;

            if(valueField) {
                resultItem = $.grep(items, function(item, index) {
                    return item[valueField] === value;
                })[0] || {};
            }
            else {
                resultItem = items[value];
            }

            return (textField ? resultItem[textField] : resultItem) || "";
        },

        filterTemplate: function() {
            var grid = this._grid,
                $result = this.filterControl = this._createSelect();

            if(this.autosearch) {
                $result.on("change", function(e) {
                    grid.search();
                });
            }

            return $result;
        },

        insertTemplate: function() {
            var $result = this.insertControl = this._createSelect();
            return $result;
        },

        editTemplate: function(value) {
            var $result = this.editControl = this._createSelect();
            (value !== undefined) && $result.val(value);
            return $result;
        },

        filterValue: function() {
            return parseInt(this.filterControl.val(), 10);
        },

        insertValue: function() {
            return parseInt(this.insertControl.val(), 10);
        },

        editValue: function() {
            return parseInt(this.editControl.val(), 10);
        },

        _createSelect: function() {
            var $result = $("<select>"),
                valueField = this.valueField,
                textField = this.textField,
                selectedIndex = this.selectedIndex;

            $.each(this.items, function(index, item) {
                var value = valueField ? item[valueField] : index,
                    text = textField ? item[textField] : item;

                var $option = $("<option>")
                    .attr("value", value)
                    .text(text)
                    .appendTo($result);

                $option.prop("selected", (selectedIndex === index));
            });

            return $result;
        }
    });

    jsGrid.SelectField = SelectField;
    
}(jsGrid, jQuery));