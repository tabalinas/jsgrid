(function(jsGrid, $, undefined) {

    var TextField = jsGrid.TextField;

    function NumberField(config) {
        TextField.call(this, config);
    }

    NumberField.prototype = new TextField({

        sorter: "number",
        align: "right",
		readOnly: false,

        filterValue: function() {
            return this.filterControl.val()
                ? parseInt(this.filterControl.val() || 0, 10)
                : undefined;
        },

        insertValue: function() {
            return this.insertControl.val()
                ? parseInt(this.insertControl.val() || 0, 10)
                : undefined;
        },

        editValue: function() {
            return this.editControl.val()
                ? parseInt(this.editControl.val() || 0, 10)
                : undefined;
        },

        _createTextBox: function() {
			return $("<input>").attr("type", "number")
                .prop("readonly", !!this.readOnly);
        }
    });

    jsGrid.fields.number = jsGrid.NumberField = NumberField;

}(jsGrid, jQuery));
