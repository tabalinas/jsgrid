(function(jsGrid, $, undefined) {

    var TextField = jsGrid.TextField;

    function TextAreaField(config) {
        TextField.call(this, config);
    }

    TextAreaField.prototype = new TextField({
        
        insertTemplate: function() {
            var $result = this.insertControl = this._createTextArea();
            return $result;
        },

        editTemplate: function(value) {
            var $result = this.editControl = this._createTextArea();
            $result.val(value);
            return $result;
        },

        _createTextArea: function() {
            return $("<textarea>");
        }
    });

    jsGrid.fields.textarea = jsGrid.TextAreaField = TextAreaField;
    
}(jsGrid, jQuery));