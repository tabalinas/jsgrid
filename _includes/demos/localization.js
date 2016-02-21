$(function() {

    jsGrid.locale("fr");

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
        controller: db,
        fields: [
            { name: "Name", title: "Nom", type: "text", width: 150, validate: "required" },
            { name: "Age", title: "Âge", type: "number", width: 50, validate: { validator: "range", param: [18,80] } },
            { name: "Address", title: "Adresse", type: "text", width: 200, validate: { validator: "rangeLength", param: [10, 250] } },
            { name: "Country", title: "Pays", type: "select", items: db.countries, valueField: "Id", textField: "Name" },
            { name: "Married", title: "Marié", type: "checkbox", sorting: false },
            { type: "control" }
        ]
    });

});