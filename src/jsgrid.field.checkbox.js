(function(jsGrid, $, undefined) {

    var Field = jsGrid.Field;

    function CheckboxField(name, config) {
        Field.call(this, name, config);
    }

    CheckboxField.prototype = new Field("", {
        
        sorter: "Number",
        align: "center",
        autosearch: true,
        
        itemTemplate: function(value) {
            return this._createCheckbox().prop({
                checked: value,
                disabled: true
            });
        },

        filterTemplate: function() {
            var grid = this._grid,
                $result = this.filterControl = this._createCheckbox();

            if(this.autosearch) {
                $result.on("click", function() {
                    grid.search();
                });
            }

            return $result;
        },

        insertTemplate: function() {
            var $result = this.insertControl = this._createCheckbox();
            return $result;
        },

        editTemplate: function(value) {
            var $result = this.editControl = this._createCheckbox();
            $result.prop("checked", value);
            return $result;
        },

        filterValue: function() {
            return this.filterControl.is(":checked");
        },
        
        insertValue: function() {
            return this.insertControl.is(":checked");
        },

        editValue: function() {
            return this.editControl.is(":checked");
        },

        _createCheckbox: function() {
            return $("<input>").attr("type", "checkbox");
        }
    });

    jsGrid.CheckboxField = CheckboxField;
    
}(jsGrid, jQuery));