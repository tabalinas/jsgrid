(function(jsGrid, $, undefined) {

    var TextField = jsGrid.TextField;

    function TextAreaField(config) {
        TextField.call(this, config);
    }

    TextAreaField.prototype = new TextField({

        insertTemplate: function() {
            if(!this.inserting)
                return "";

            return this.insertControl = this._createTextArea(typeof(this.id) !== "undefined"?this.id+"_insert":"");
        },

        editTemplate: function(value) {
            if(!this.editing)
                return this.itemTemplate.apply(this, arguments);

            var $result = this.editControl = this._createTextArea(typeof(this.id) !== "undefined"?this.id+"_edit":"");
            $result.val(value);
            return $result;
        },

        _createTextArea: function(unId ="") {
           
            var customField =  $("<textarea>").prop("readonly", !!this.readOnly);

            if(unId !== "")
                customField.attr("id",unId);

            return customField;

            //return $("<textarea>").prop("readonly", !!this.readOnly);
        }
    });

    jsGrid.fields.textarea = jsGrid.TextAreaField = TextAreaField;

}(jsGrid, jQuery));
