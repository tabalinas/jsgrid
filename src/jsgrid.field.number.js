(function(jsGrid, $, undefined) {

    var TextField = jsGrid.TextField;

    function NumberField(config) {
        TextField.call(this, config);
    }

    NumberField.prototype = new TextField({

        sorter: "number",
        align: "right",
		classNames: null,
		readOnly: false,

        filterValue: function() {
            return parseInt(this.filterControl.val() || 0, 10);
        },

        insertValue: function() {
            return parseInt(this.insertControl.val() || 0, 10);
        },

        editValue: function() {
            return parseInt(this.editControl.val() || 0, 10);
        },

        _createTextBox: function() {
			var $result = $("<input>").attr("type", "number");
			
			if (this.readOnly) $result.attr("readonly", "readonly");
			
			if (this.classNames !== undefined && this.classNames !== null) {
				$result.addClass(this.classNames);
			}
			
            return $result;
        }
    });

    jsGrid.fields.number = jsGrid.NumberField = NumberField;

}(jsGrid, jQuery));
