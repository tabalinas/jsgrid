$(function() {

    $("#jsGrid").jsGrid({
        height: "40%",
        width: "100%",

        editing: true,
        autoload: true,

        deleteConfirm: function(item) {
            return "The client \"" + item.Name + "\" will be removed. Are you sure?";
        },

        controller: db,

        fields: [
            { name: "Name", type: "text", width: 150 },
            { name: "Age", type: "number", width: 50 },
            { name: "Address", type: "text", width: 200 },
            { name: "Country", type: "select", items: db.countries, valueField: "Id", textField: "Name" },
            { name: "Married", type: "checkbox", title: "Is Married", sorting: false },
            { type: "control", modeSwitchButton: false, editButton: false }
        ]
    });


    $("#add").click(function() {
        var newItem = {
            Name: $("#name").val(),
            Age: parseInt($("#age").val(), 10),
            Address: $("#address").val(),
            Country: parseInt($("#country").val(), 10),
            Married: $("#married").is(":checked")
        };

        $("#jsGrid").jsGrid("insertItem", newItem);

        $("#name").val("");
        $("#age").val("");
        $("#address").val("");
        $("#country").val("0");
        $("#married").prop("checked", false);
    });

});