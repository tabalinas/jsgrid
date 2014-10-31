(function(jsGrid, $, undefined) {

    var Field = jsGrid.Field;

    function ControlField(config) {
        Field.call(this, "", config);
    }

    ControlField.prototype = new Field("", {
        css: "jsgrid-control-field",
        align: "center",
        width: 50,
        filtering: false,
		inserting: false,
        editing: false,
        sorting: false,

        buttonClass: "jsgrid-button",
        modeButtonClass: "jsgrid-mode-button",

        searchModeButtonClass: "jsgrid-search-mode-button",
        insertModeButtonClass: "jsgrid-insert-mode-button",
        editButtonClass: "jsgrid-edit-button",
        deleteButtonClass: "jsgrid-delete-button",
        searchButtonClass: "jsgrid-search-button",
        clearFilterButtonClass: "jsgrid-clear-filter-button",
        insertButtonClass: "jsgrid-insert-button",
        updateButtonClass: "jsgrid-update-button",
        cancelEditButtonClass: "jsgrid-cancel-edit-button",

        searchModeButtonTooltip: "Switch to searching",
        insertModeButtonTooltip: "Switch to inserting",
        editButtonTooltip: "Edit",
        deleteButtonTooltip: "Delete",
        searchButtonTooltip: "Search",
        clearFilterButtonTooltip: "Clear filter",
        insertButtonTooltip: "Insert",
        updateButtonTooltip: "Update",
        cancelEditButtonTooltip: "Cancel edit",

        editButton: true,
        deleteButton: true,
        clearFilterButton: true,
        modeSwitchButton: true,

        headerTemplate: function() {
            return this.modeSwitchButton ? this._createModeSwitchButton() : "";
        },

        itemTemplate: function(value, item) {
            var $result = $([]);

            if(this.editButton) {
                $result = $result.add(this._createEditButton(item));
            }

            if(this.deleteButton) {
                $result = $result.add(this._createDeleteButton(item));
            }

            return $result;
        },

        filterTemplate: function() {
            var $result = this._createSearchButton();
            return this.clearFilterButton ? $result.add(this._createClearFilterButton()) : $result;
        },

        insertTemplate: function() {
            return this._createInsertButton();
        },

        editTemplate: function(value, item) {
            return this._createUpdateButton().add(this._createCancelEditButton());
        },

        _createModeSwitchButton: function() {
            var isInserting = false;
            var grid = this._grid;
            var field = this;

            var updateButtonState = function() {
                $button.attr("title", isInserting ? field.insertModeButtonClass : field.searchModeButtonTooltip)
                    .toggleClass(field.insertModeButtonClass, !isInserting)
                    .toggleClass(field.searchModeButtonClass, isInserting);
            };

            var $button = $("<input>").addClass(field.buttonClass)
                .addClass(field.modeButtonClass)
                .attr("type", "button")
                .on("click", function() {
                    isInserting = !isInserting;
                    grid.option("inserting", isInserting);
                    grid.option("filtering", !isInserting);
                    updateButtonState();
                });

            updateButtonState();

            return $button;
        },

        _createEditButton: function(item) {
            var grid = this._grid;

            return $("<input>").addClass(this.buttonClass)
                .addClass(this.editButtonClass)
                .attr({
                    type: "button",
                    title: this.editButtonTooltip
                })
                .on("click", function(e) {
                    grid.editItem(item);
                    e.stopPropagation();
                });
        },

        _createDeleteButton: function(item) {
            var grid = this._grid;

            return $("<input>").addClass(this.buttonClass)
                .addClass(this.deleteButtonClass)
                .attr({
                    type: "button",
                    title: this.deleteButtonTooltip
                })
                .on("click", function(e) {
                    grid.deleteItem(item);
                    e.stopPropagation();
                });
        },

        _createSearchButton: function() {
            var grid = this._grid;

            return $("<input>").addClass(this.buttonClass)
                .addClass(this.searchButtonClass)
                .attr({
                    type: "button",
                    title: this.searchButtonTooltip
                })
                .on("click", function() {
                    grid.search();
                });
        },

        _createClearFilterButton: function() {
            var grid = this._grid;

            return $("<input>").addClass(this.buttonClass)
                .addClass(this.clearFilterButtonClass)
                .attr({
                    type: "button",
                    title: this.clearFilterButtonTooltip
                })
                .on("click", function() {
                    grid.clearFilter();
                    grid.search();
                });
        },

        _createInsertButton: function() {
            var grid = this._grid;

            return $("<input>").addClass(this.buttonClass)
                .addClass(this.insertButtonClass)
                .attr({
                    type: "button",
                    title: this.insertButtonTooltip
                })
                .on("click", function() {
                    grid.insertItem();
                    grid.clearInsert();
                });
        },

        _createUpdateButton: function() {
            var grid = this._grid;

            return $("<input>").addClass(this.buttonClass)
                .addClass(this.updateButtonClass)
                .attr({
                    type: "button",
                    title: this.updateButtonTooltip
                })
                .on("click", function(e) {
                    grid.updateItem();
                    e.stopPropagation();
                });
        },

        _createCancelEditButton: function() {
            var grid = this._grid;

            return $("<input>").addClass(this.buttonClass)
                .addClass(this.cancelEditButtonClass)
                .attr({
                    type: "button",
                    title: this.cancelEditButtonTooltip
                })
                .on("click", function(e) {
                    grid.cancelEdit();
                    e.stopPropagation();
                });
        }

    });

    jsGrid.ControlField = ControlField;

}(jsGrid, jQuery));