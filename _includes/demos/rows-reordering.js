$(function() {

    $("#jsGrid").jsGrid({
        height: "70%",
        width: "100%",
        autoload: true,

        rowClass: function(item, itemIndex) {
            return "client-" + itemIndex;
        },

        controller: {
            loadData: function() {
                return db.clients.slice(0, 15);
            }
        },

        fields: [
            { name: "Name", type: "text", width: 150 },
            { name: "Age", type: "number", width: 50 },
            { name: "Address", type: "text", width: 200 },
            { name: "Country", type: "select", items: db.countries, valueField: "Id", textField: "Name" },
            { name: "Married", type: "checkbox", title: "Is Married", sorting: false }
        ],

        onRefreshed: function() {
            var $gridData = $("#jsGrid .jsgrid-grid-body tbody");

            $gridData.sortable({
                update: function(e, ui) {
                    // array of indexes
                    var clientIndexRegExp = /\s+client-(\d+)\s+/;
                    var indexes = $.map($gridData.sortable("toArray", { attribute: "class" }), function(classes) {
                        return clientIndexRegExp.exec(classes)[1];
                    });
                    alert("Reordered indexes: " + indexes.join(", "));

                    // arrays of items
                    var items = $.map($gridData.find("tr"), function(row) {
                        return $(row).data("JSGridItem");
                    });
                    console && console.log("Reordered items", items);
                }
            });
        }
    });

});