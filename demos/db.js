(function() {

    var data = [];

    for(var i = 1; i <= 105; i++) {
        data.push({
            Name: "Client" + i,
            Age: 20 + i,
            Address: "St. Moscow " + i,
            Married: false,
            Country: i % 3 + 1
        });
    }

    var db = {

        loadData: function(filter) {
            var result;
            var filteredData = $.grep(data, function(item) {
                var found = true;
                $.each(filter, function(key, value) {
                    if(value != "" && value != "0" && item.hasOwnProperty(key) && item[key] != value) {
                        found = false;
                        return false;
                    }
                });
                return found;
            });

            if(filter.pageIndex !== undefined) {
                var startIndex = (filter.pageIndex - 1) * filter.pageSize;
                result = {
                    data: filteredData.slice(startIndex, startIndex + filter.pageSize),
                    itemsCount: filteredData.length
                };
            }
            else {
                result = filteredData;
            }

            return result;
        },

        insertItem: function(insertingItem) {
            data.push(insertingItem);
            return insertingItem;
        },

        updateItem: function(updatingItem) {
            updatingItem["Country"] = parseInt(updatingItem["Country"]);
            return updatingItem;
        },

        deleteItem: function(deletingItem) {
            data.splice($.inArray(deletingItem, data), 1);
            return deletingItem;
        }

    };

    window.db = db;

}());