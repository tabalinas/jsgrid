(function(jsGrid, $, undefined) {

    var Field = jsGrid.Field;

    function TextField(config) {
        Field.call(this, config);
    }

    TextField.prototype = new Field({

        autosearch: true,

        showFilterOption: true,
        filterOptions: ['eq', 'ne', 'bw', 'bn', 'ew', 'en', 'cn', 'nc', 'nu', 'nn', 'in', 'ni'],

        filterTemplate: function() {
            if(!this.filtering)
                return "";

            var grid = this._grid;
            var $result = this.filterControl = this.showFilterOption ? this._createFilterTextBox() : this._createTextBox();

            if(this.autosearch) {
                $result.on("keypress", function(e) {
                    if(e.which === 13) {
                        grid.search();
                        e.preventDefault();
                    }
                });
            }

            return $result;
        },

        insertTemplate: function() {
            if(!this.inserting)
                return "";

            var $result = this.insertControl = this._createTextBox();
            return $result;
        },

        editTemplate: function(value) {
            if(!this.editing)
                return this.itemTemplate(value);

            var $result = this.editControl = this._createTextBox();
            $result.val(value);
            return $result;
        },

        filterValue: function() {
            return this.filterControl.val();
        },

        insertValue: function() {
            return this.insertControl.val();
        },

        editValue: function() {
            return this.editControl.val();
        },

        _createTextBox: function() {
            return $("<input>").attr("type", "text");
        },

        _createFilterTextBox: function() {
            var div = $("<div>");
            var textBox = this._createTextBox();
            div.append(this._createFilterOption()).append(textBox);
            div.val = function(value) {
                return textBox.val();
            };

            return div;
        }
    });

    jsGrid.fields.text = jsGrid.TextField = TextField;

}(jsGrid, jQuery));
