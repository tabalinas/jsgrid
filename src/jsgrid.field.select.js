(function(jsGrid, $, undefined) {

    var NumberField = jsGrid.NumberField;

    function SelectField(config) {
        this.items = [];
        this.selectedIndex = -1;
        this.valueField = "";
        this.textField = "";

        if(config.valueField && config.items.length) {
            this.valueType = typeof config.items[0][config.valueField];
        }

        this.sorter = this.valueType;

        NumberField.call(this, config);
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

            var result = (textField ? resultItem[textField] : resultItem);

            return (result === undefined || result === null) ? "" : result;
        },

        filterTemplate: function() {
            if(!this.filtering)
                return "";

            var grid = this._grid;
            var $result = this.filterControl = this.showFilterOption ? this._createFilterSelect() : this._createSelect();

            if(this.autosearch) {
                $result.on("change", function(e) {
                    grid.search();
                });
            }

            return $result;
        },

        insertTemplate: function() {
            if(!this.inserting)
                return "";

            var $result = this.insertControl = this._createSelect();
            return $result;
        },

        editTemplate: function(value) {
            if(!this.editing)
                return this.itemTemplate(value);

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

        _createFilterSelect: function() {
            var div = $("<div>");
            var select = this._createSelect();
            div.append(this._createFilterOption()).append(select);
            div.val = function(value) {
                return select.val();
            };

            return div;
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

    SelectField.prototype.filterOptions = ['eq', 'ne'];

    jsGrid.fields.select = jsGrid.SelectField = SelectField;

}(jsGrid, jQuery));
