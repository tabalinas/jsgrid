$(function() {

    $("#jsGrid").jsGrid({
        height: "80%",
        width: "100%",

        autoload: true,
        paging: true,
        pageLoading: true,
        pageSize: 15,
        pageIndex: 2,

        controller: {
            loadData: function(filter) {
                var startIndex = (filter.pageIndex - 1) * filter.pageSize;
                return {
                    data: db.clients.slice(startIndex, startIndex + filter.pageSize),
                    itemsCount: db.clients.length
                };
            }
        },

        fields: [
            { name: "Name", type: "text", width: 150 },
            { name: "Age", type: "number", width: 50 },
            { name: "Address", type: "text", width: 200 },
            { name: "Country", type: "select", items: db.countries, valueField: "Id", textField: "Name" },
            { name: "Married", type: "checkbox", title: "Is Married" }
        ]
    });


    $("#pager").on("change", function() {
        var page = parseInt($(this).val(), 10);
        $("#jsGrid").jsGrid("openPage", page);
    });

});