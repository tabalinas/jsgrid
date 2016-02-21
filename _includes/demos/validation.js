$(function() {

    $("#jsGrid").jsGrid({
        height: "70%",
        width: "100%",
        filtering: true,
        editing: true,
        inserting: true,
        sorting: true,
        paging: true,
        autoload: true,
        pageSize: 15,
        pageButtonCount: 5,
        deleteConfirm: "Do you really want to delete the client?",
        controller: db,
        fields: [
            { name: "Name", type: "text", width: 150, validate: "required" },
            { name: "Age", type: "number", width: 50, validate: { validator: "range", param: [18, 80] } },
            { name: "Address", type: "text", width: 200, validate: { validator: "rangeLength", param: [10, 250] } },
            { name: "Country", type: "select", items: db.countries, valueField: "Id", textField: "Name",
                validate: { message: "Country should be specified", validator: function(value) { return value > 0; } } },
            { name: "Married", type: "checkbox", title: "Is Married", sorting: false },
            { type: "control" }
        ]
    });

});