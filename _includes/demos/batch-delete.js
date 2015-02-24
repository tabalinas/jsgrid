$(function() {

    $("#jsGrid").jsGrid({
        height: "50%",
        width: "100%",
        autoload: true,
        confirmDeleting: false,
        paging: true,
        controller: {
            loadData: function() {
                return db.clients;
            }
        },
        fields: [
            {
                headerTemplate: function() {
                    return $("<button>").attr("type", "button").text("Delete")
                            .on("click", function () {
                                deleteSelectedItems();
                            });
                },
                itemTemplate: function(_, item) {
                    return $("<input>").attr("type", "checkbox")
                            .on("change", function () {
                                $(this).is(":checked") ? selectItem(item) : unselectItem(item);
                            });
                },
                align: "center",
                width: 50
            },
            { name: "Name", type: "text", width: 150 },
            { name: "Age", type: "number", width: 50 },
            { name: "Address", type: "text", width: 200 }
        ]
    });


    var selectedItems = [];

    var selectItem = function(item) {
        selectedItems.push(item);
    };

    var unselectItem = function(item) {
        selectedItems = $.grep(selectedItems, function(i) {
            return i !== item;
        });
    };

    var deleteSelectedItems = function() {
        if(!selectedItems.length || !confirm("Are you sure?"))
            return;

        var $grid = $("#jsGrid");

        $.each(selectedItems, function(_, item) {
            $grid.jsGrid("deleteItem", item);
        });

        selectedItems = [];
    };

});