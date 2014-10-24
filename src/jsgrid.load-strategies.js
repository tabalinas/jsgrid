(function(jsGrid, $, undefined) {
    
    function DirectLoadingStrategy(grid) {
        this._grid = grid;
    }

    DirectLoadingStrategy.prototype = {
        firstDisplayIndex: function() {
            var grid = this._grid;
            return grid.paging ? (grid.pageIndex - 1) * grid.pageSize : 0;
        },

        lastDisplayIndex: function() {
            var grid = this._grid;
            return grid.paging
                ? Math.min(grid.pageIndex * grid.pageSize, grid.data.length)
                : grid.data.length;
        },

        itemsCount: function() {
            return this._grid.data.length;
        },

        openPage: function(index) {
            this._grid.refresh();
        },

        loadParams: function() {
            return {};
        },

        sort: function() {
            this._grid._sortData()
                .refresh();
        },

        finishLoad: function(loadedData) {
            this._grid.option("data", loadedData);
        },

        finishInsert: function(insertedItem) {
            var grid = this._grid;
            grid.data.push(insertedItem);
            grid.refresh();
        },

        finishDelete: function(deletedItem, deletedItemIndex) {
            var grid = this._grid;
            grid.data.splice(deletedItemIndex, 1);
            grid.reset();
        }
    };
   
    
    function PageLoadingStrategy(grid) {
        this._grid = grid;
        this._itemsCount = 0;
    }

    PageLoadingStrategy.prototype = {
        firstDisplayIndex: function() {
            return 0;
        },

        lastDisplayIndex: function() {
            return this._grid.data.length;
        },

        itemsCount: function() {
            return this._itemsCount;
        },

        openPage: function(index) {
            this._grid.loadData();
        },

        loadParams: function() {
            var grid = this._grid;
            return {
                pageIndex: grid.pageIndex,
                pageSize: grid.pageSize
            };
        },

        sort: function() {
            this._grid.loadData();
        },

        finishLoad: function(loadedData) {
            this._itemsCount = loadedData.itemsCount;
            this._grid.option("data", loadedData.data);
        },

        finishInsert: function(insertedItem) {
            this._grid.reset()
                .loadData();
        },

        finishDelete: function(deletedItem, deletedItemIndex) {
            this._grid.reset()
                .loadData();
        }
    };
    
    jsGrid.loadStrategies = {
        DirectLoadingStrategy: DirectLoadingStrategy,
        PageLoadingStrategy: PageLoadingStrategy
    };
    
}(jsGrid, jQuery));