$(function() {

    $("#jsGrid").jsGrid({
        height: "80%",
        width: "100%",

        autoload: true,
        selecting: false,

        controller: db,

        fields: [
            { name: "Name", type: "text", width: 150 },
            { name: "Age", type: "number", width: 50 },
            { name: "Address", type: "text", width: 200 },
            { name: "Country", type: "select", items: db.countries, valueField: "Id", textField: "Name" },
            { name: "Married", type: "checkbox", title: "Is Married" }
        ]
    });


    $("#sort").click(function() {
        var field = $("#sortingField").val();
        $("#jsGrid").jsGrid("sort", field);
    });

});