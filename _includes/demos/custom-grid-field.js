$(function() {

    var MyDateField = function(config) {
        jsGrid.Field.call(this, config);
    };

    MyDateField.prototype = new jsGrid.Field({
        sorter: function(date1, date2) {
            return new Date(date1) - new Date(date2);
        },

        itemTemplate: function(value) {
            return new Date(value).toDateString();
        },

        insertTemplate: function(value) {
            return this._insertPicker = $("<input>").datepicker({ defaultDate: new Date() });
        },

        editTemplate: function(value) {
            return this._editPicker = $("<input>").datepicker().datepicker("setDate", new Date(value));
        },

        insertValue: function() {
            return this._insertPicker.datepicker("getDate").toISOString();
        },

        editValue: function() {
            return this._editPicker.datepicker("getDate").toISOString();
        }
    });

    jsGrid.fields.myDateField = MyDateField;

    $("#jsGrid").jsGrid({
        height: "90%",
        width: "100%",

        inserting: true,
        editing: true,
        sorting: true,
        paging: true,

        data: db.users,

        fields: [
            { name: "Account", width: 150, align: "center" },
            { name: "Name", type: "text" },
            { name: "RegisterDate", type: "myDateField", width: 100, align: "center" },
            { type: "control", editButton: false, modeSwitchButton: false }
        ]
    });

});