(function(jsGrid, $, undefined) {

    var NumberField = jsGrid.NumberField;

    function SelectField(config) {
        this.items = [];
        this.selectedIndex = -1;
        this.valueField = "";
        this.textField = "";

        NumberField.call(this, config);

        if(!config.valueType && this.valueField && this.items.length) {
            this.valueType = typeof this.items[0][this.valueField];
        }
    }

    SelectField.prototype = new NumberField({

        align: "center",
        valueType: "number",

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
            var val = this.filterControl.val();
            return this.valueType === "number" ? parseInt(val || 0, 10) : val;
        },

        insertValue: function() {
            var val = this.insertControl.val();
            return this.valueType === "number" ? parseInt(val || 0, 10) : val;
        },

        editValue: function() {
            var val = this.editControl.val();
            return this.valueType === "number" ? parseInt(val || 0, 10) : val;
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

    jsGrid.fields.select = jsGrid.SelectField = SelectField;
    
}(jsGrid, jQuery));