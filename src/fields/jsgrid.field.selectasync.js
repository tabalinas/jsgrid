(function (jsGrid, $, undefined) {

    var NumberField = jsGrid.NumberField;
    var numberValueType = "number";
    var stringValueType = "string";

    var SelectAsyncField = function (config) {
        this.items = [];
        this.selectedIndex = -1;
        this.valueField = "";
        this.textField = "";

        if (config.valueField && config.items && config.items.length) {
            var firstItemValue = config.items[0][config.valueField];
            this.valueType = (typeof firstItemValue) === numberValueType ? numberValueType : stringValueType;
        }

        this.sorter = this.valueType;

        NumberField.call(this, config);
    };

    SelectAsyncField.prototype = new NumberField({
        align: "center",
        valueType: numberValueType,

        itemTemplate: function (value) {
            var items = this.items,
                valueField = this.valueField,
                textField = this.textField,
                itemsAsync = this.itemsAsync,
                resultItem;

            if (valueField) {
                resultItem = $.grep(items, function (item, index) {
                    return item[valueField] === value;
                })[0] || {};
            }
            else {
                resultItem = items[value];
            }

            var result = (textField ? resultItem[textField] : resultItem);

            return (result === undefined || result === null) ? "" : result;
        },

        filterTemplate: function () {
            if (!this.filtering)
                return "";

            var grid = this._grid,
                that = this,
                $result;

            var promise = this._createSelect().then(function ($elem) {

                if (that.autosearch && $elem) {
                    $elem.on("change", function (e) {
                        grid.search();
                    });
                }
                that.filterControl = $elem;
                return $elem;
            });

            // Make temporary control to do sync filtering
            this.filterControl = $('<input type="text">');

            return promise;
        },

        insertTemplate: function () {
            var that = this;

            if (!this.inserting)
                return "";

            var promise = this._createSelect().then(function ($elem) {
                that.insertControl = $elem;
                return $elem;
            });
            return promise;
        },

        editTemplate: function (value) {
            var that = this;
            if (!this.editing)
                return this.itemTemplate.apply(this, arguments);

            var promise = this._createSelect().then(function ($elem) {
                that.editControl = $elem;
                if (value !== undefined)
                    $result.val(value);
                return $elem;
            });

            // Make temporary control to do sync filtering
            this.editControl = $('<input type="text">');

            return promise;
        },

        filterValue: function () {
            var val = this.filterControl.val();
            return this.valueType === numberValueType ? parseInt(val || 0, 10) : val;
        },

        insertValue: function () {
            var val = this.insertControl.val();
            return this.valueType === numberValueType ? parseInt(val || 0, 10) : val;
        },

        editValue: function () {
            var val = this.editControl.val();
            return this.valueType === numberValueType ? parseInt(val || 0, 10) : val;
        },

        _createSelect: function () {
            var $result = $("<select>"),
                valueField = this.valueField,
                textField = this.textField,
                items = this.items,
                itemsAsync = this.itemsAsync,
                selectedIndex = this.selectedIndex,
                grid = this._grid || {},
                controlClass = grid.controlClass;

            var $elem;

            return new Promise(function (res, rej) {
                if (itemsAsync) {
                    itemsAsync.then(function (data) {
                        $elem = _renderSelect(data);
                        res($elem);
                    });
                } else {
                    $elem = _renderSelect(items);
                    res($elem);
                }
            });

            function _renderSelect(items) {
                // Add null value
                $("<option>")
                    .attr("value", -1)
                    .text("-- Select --")
                    .appendTo($result);

                $.each(items, function (index, item) {
                    var value = valueField ? item[valueField] : index,
                        text = textField ? item[textField] : item;

                    var $option = $("<option>")
                        .attr("value", value)
                        .text(text)
                        .appendTo($result);

                    $option.prop("selected", (selectedIndex === index));
                });

                $result.prop("disabled", !!this.readOnly);
                $result.addClass(controlClass);

                return $result;
            }
        }
    });

    jsGrid.fields.selectasync = SelectAsyncField;
}(jsGrid, jQuery));
