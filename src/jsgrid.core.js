(function(window, $, undefined) {

    var JSGRID = "JSGrid",
        JSGRID_DATA_KEY = JSGRID,
        JSGRID_ROW_DATA_KEY = "JSGridItem",
        JSGRID_EDIT_ROW_DATA_KEY = "JSGridEditRow",

        SORT_ORDER_ASC = "asc",
        SORT_ORDER_DESC = "desc",

        FIRST_PAGE_PLACEHOLDER = "{first}",
        PAGES_PLACEHOLDER = "{pages}",
        PREV_PAGE_PLACEHOLDER = "{prev}",
        NEXT_PAGE_PLACEHOLDER = "{next}",
        LAST_PAGE_PLACEHOLDER = "{last}",
        PAGE_INDEX_PLACEHOLDER = "{pageIndex}",
        PAGE_COUNT_PLACEHOLDER = "{pageCount}",

        EMPTY_HREF = "javascript:void(0);";

    function Grid(element, config) {
        var $element = $(element);

        $element.data(JSGRID_DATA_KEY, this);

        this._container = $element;

        this.data = [];
        this.fields = [];

        this._editingRow = null;
        this._sortField = null;
        this._sortOrder = SORT_ORDER_ASC;

        this._init(config);
    }

    Grid.prototype = {
        width: "auto",
        height: "auto",
        scrollbar: true,
        updateOnResize: true,

        rowClass: $.noop,
        rowRenderer: null,

        rowClick: function(e) {
            if(this.editing) {
                this.editRow($(e.target).closest("tr"));
            }
        },

        noDataText: "Not found",
        noDataRowClass: "jsgrid-nodata-row",
        noDataContent: function() {
            return this.noDataText;
        },

        heading: true,
        headerRowRenderer: null,
        headerRowClass: "jsgrid-header-row", 

        filtering: false,
        filterRowRenderer: null,
        filterRowClass: "jsgrid-filter-row", 

        inserting: false,
        insertRowRenderer: null,
        insertRowClass: "jsgrid-insert-row",    

        editing: false,
        editRowRenderer: null,
        editRowClass: "jsgrid-edit-row",

        confirmDeleting: true,                  
        deleteConfirmMessage: "Are you sure?", 
        deleteConfirm: function(item) {
            return this.deleteConfirmMessage;
        },

        selecting: true,                       
        selectedRowClass: "jsgrid-selected-row",
        oddRowClass: "jsgrid-row", 
        evenRowClass: "jsgrid-alt-row",

        sorting: false,
        sortClass: "jsgrid-header-sort",
        sortAscClass: "jsgrid-header-sort-asc",
        sortDescClass: "jsgrid-header-sort-desc",

        paging: false,
        pagerContainer: null,
        pageIndex: 1,  
        pageSize: 20,
        pageButtonCount: 15,
        pagerFormat: "Pages: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} of {pageCount}",
        pagePrevText: "Prev",
        pageNextText: "Next",
        pageFirstText: "First",
        pageLastText: "Last",
        pageNavigatorNextText: "...",
        pageNavigatorPrevText: "...",
        pagerContainerClass: "jsgrid-pager-container",
        pagerClass: "jsgrid-pager",
        pagerNavButtonClass: "jsgrid-pager-nav-button",
        pageClass: "jsgrid-pager-page",
        currentPageClass: "jsgrid-pager-current-page",

        pageLoading: false,

        autoload: false,
        controller: null,

        onDataBinding: $.noop,
        onDataBound: $.noop,
        onRefreshing: $.noop,
        onRefreshed: $.noop,
        onItemDeleting: $.noop,
        onItemDeleted: $.noop,
        onItemInserting: $.noop,
        onItemInserted: $.noop,
        onItemUpdating: $.noop,
        onItemUpdated: $.noop,
        onDataLoading: $.noop,
        onDataLoaded: $.noop,
        onOptionChanging: $.noop,
        onOptionChanged: $.noop,

        containerClass: "jsgrid",
        tableClass: "jsgrid-table",
        gridHeaderClass: "jsgrid-grid-header",
        gridBodyClass: "jsgrid-grid-body",
                
        _init: function(config) {
            $.extend(true, this, config);
            this._initLoadStrategy();
            this._initFields();
            
            if(this.updateOnResize) {
                this._attachWindowResizeCallback();
            }
        },

        loadStrategy: function() {
            return this.pageLoading
                ? new jsGrid.loadStrategies.PageLoadingStrategy(this)
                : new jsGrid.loadStrategies.DirectLoadingStrategy(this);
        },

        _initLoadStrategy: function() {
            this._loadStrategy = this.loadStrategy();
        },

        _initFields: function() {
            var self = this;
            self.fields = $.map(self.fields, function(field) {
                if($.isPlainObject(field)) {
                    field = new jsGrid.Field(field.name, field);
                }
                field._grid = self;
                return field;
            });
        },

        _attachWindowResizeCallback: function() {
            var self = this;
            $(window).on("resize." + JSGRID, function() {
                self.refreshSize();
            });
        },

        _detachWindowResizeCallback: function() {
            $(window).off("." + JSGRID);
        },

        option: function(key, value) {
            var optionChangingEventArgs,
                optionChangedEventArgs;

            if(arguments.length === 1) {
                return this[key];
            }

            optionChangingEventArgs = {
                option: key,
                oldValue: this[key],
                newValue: value
            };
            this._callEventHandler(this.onOptionChanging, optionChangingEventArgs);

            this._handleOptionChange(optionChangingEventArgs.option, optionChangingEventArgs.newValue);

            optionChangedEventArgs = {
                option: optionChangingEventArgs.option,
                value: optionChangingEventArgs.newValue
            };
            this._callEventHandler(this.onOptionChanged, optionChangedEventArgs);

            return this;
        },

        _handleOptionChange: function(name, value) {
            this[name] = value;

            switch(name) {
                case "width":
                case "height":
                case "scrollbar":
                    this.refreshSize();
                    break;
                case "rowClass":
                case "rowRenderer":
                case "rowClick":
                case "noDataText":
                case "noDataRowClass":
                case "noDataContent":
                case "selecting":
                case "selectedRowClass":
                case "oddRowClass":
                case "evenRowClass":
                    this.refreshGridContent();
                    break;
                case "headerRowRenderer":
                case "headerRowClass":
                case "filterRowRenderer":
                case "filterRowClass":
                case "insertRowRenderer":
                case "insertRowClass":
                case "sorting":
                case "sortClass":
                case "sortAscClass":
                case "sortDescClass":
                case "pagerContainer":
                case "pagerContainerClass":
                case "containerClass":
                case "tableClass":
                case "gridHeaderClass":
                case "gridBodyClass":
                    this.render();
                    break;
                case "paging":
                case "pageButtonCount":
                case "pagerFormat":
                case "pagePrevText":
                case "pageNextText":
                case "pageFirstText":
                case "pageLastText":
                case "pageNavigatorNextText":
                case "pageNavigatorPrevText":
                case "pagerClass":
                case "pagerNavButtonClass":
                case "pageClass":
                case "currentPageClass":
                    this.refreshPager();
                    break;
                case "fields":
                    this._initFields();
                    this.render();
                    break;
                case "data":
                case "editing":
                    this.refresh();
                    break;
                case "pageLoading":
                    this._initLoadStrategy();
                    if(this.controller) {
                        this.search();
                    }
                    break;
                case "pageIndex":
                    this.openPage(value);
                    break;
                case "pageSize":
                    this.refresh();
                    if(this.controller) {
                        this.search();
                    }
                    break;
                case "heading":
                    this.refreshHeading();
                    break;
                case "filtering":
                    this.refreshFiltering();
                    break;
                case "inserting":
                    this.refreshInserting();
                    break;
                case "editRowRenderer":
                case "editRowClass":
                    this.cancelEdit();
                    break;
            }
        },

        destroy: function() {
            this._detachWindowResizeCallback();
            this._clear();
            this._container.removeData(JSGRID_DATA_KEY);
        },

        _clear: function() {
            if(this._pagerContainer) {
                this._pagerContainer.empty();
            }
            this._container.empty();
            return this;
        },

        render: function() {
            var headerRow = this._headerRow = this._createHeaderRow(),
                filterRow = this._filterRow = this._createFilterRow(),
                insertRow = this._insertRow = this._createInsertRow(),
                headerGrid,
                header,
                bodyGrid,
                body,
                content,
                pagerContainer;

            this._clear();
            
            headerGrid = this._headerGrid = $("<table />").addClass(this.tableClass)
                .append(headerRow)
                .append(filterRow)
                .append(insertRow);

            header = this._header = $("<div />").addClass(this.gridHeaderClass)
                .append(headerGrid);

            content = this._content = $("<tbody />");

            bodyGrid = this._bodyGrid = $("<table />").addClass(this.tableClass)
                .append(content);

            body = this._body = $("<div />").addClass(this.gridBodyClass)
                .append(bodyGrid);
            
            this._container.addClass(this.containerClass)
                .append(header)
                .append(body);

            pagerContainer = this.pagerContainer || $("<div />").appendTo(this._container);
            this._pagerContainer = $(pagerContainer).addClass(this.pagerContainerClass);
            
            this.reset();

            if(this.autoload) {
                this.loadData();
            }

            return this;
        },
        
        _createHeaderRow: function() {
            if($.isFunction(this.headerRowRenderer)) {
                return this.headerRowRenderer();
            }

            var result = $("<tr />").addClass(this.headerRowClass),
                grid = this;

            $.each(this.fields, function(index, field) {
                var $th = $("<th />").addClass(field.css)
                    .appendTo(result)
                    .append(field.headerTemplate ? field.headerTemplate() : "")
                    .width(field.width);

                if(grid.sorting && field.sorting) {
                    $th.addClass(grid.sortClass)
                        .on("click." + JSGRID, function() {
                            grid.sort(index);
                        });
                }
            });

            return result;
        },

        _createFilterRow: function() {
            if($.isFunction(this.filterRowRenderer)) {
                return this.filterRowRenderer();
            }

            var result = $("<tr />").addClass(this.filterRowClass);

            $.each(this.fields, function(index, field) {
                $("<td />").addClass(field.css)
                    .appendTo(result)
                    .append(field.filterTemplate ? field.filterTemplate() : "")
                    .width(field.width);
            });

            return result;
        },

        _createInsertRow: function() {
            if($.isFunction(this.insertRowRenderer)) {
                return this.insertRowRenderer();
            }

            var result = $("<tr />").addClass(this.insertRowClass);

            $.each(this.fields, function(index, field) {
                $("<td />").addClass(field.css)
                    .appendTo(result)
                    .append(field.insertTemplate ? field.insertTemplate() : "")
                    .width(field.width);
            });

            return result;
        },

        _callEventHandler: function(handler, eventParams) {
            handler.call(this, $.extend(eventParams, {
                grid: this
            }));
        },

        reset: function() {
            this.resetSorting();
            this.resetPager();
            this.refresh();
            return this;
        },

        resetPager: function() {
            this._firstDisplayingPage = 1;
            this._setPage(1);
            return this;
        },

        resetSorting: function() {
            this._sortField = null;
            this._sortOrder = SORT_ORDER_ASC;
            this._clearSortingCss();
            return this;
        },

        refresh: function() {
            this._callEventHandler(this.onRefreshing);

            this.cancelEdit();

            this.refreshHeading();
            this.refreshFiltering();
            this.refreshInserting();
            
            this.refreshGridContent();
            this.refreshPager();
            this.refreshSize();
            
            this._callEventHandler(this.onRefreshed);
            return this;
        },

        refreshHeading: function() {
            this._headerRow.toggle(this.heading);
            return this;
        },

        refreshFiltering: function() {
            this._filterRow.toggle(this.filtering);
            return this;
        },

        refreshInserting: function() {
            this._insertRow.toggle(this.inserting);
            return this;
        },

        refreshSize: function() {
            this.refreshScrollbar();
            this.refreshWidth();
            this.refreshHeight();
        },

        refreshWidth: function() {
            var headerGrid = this._headerGrid,
                bodyGrid = this._bodyGrid,
                header = this._header,
                body = this._body,
                width = this.width;

            headerGrid.width("auto");
            bodyGrid.width("auto");
            header.width(width === "auto" ? headerGrid.width() : width);
            body.outerWidth(header.outerWidth());
            headerGrid.width("100%");
            bodyGrid.width("100%");

            return this;
        },

        refreshHeight: function() {
            var container = this._container,
                pagerContainer = this._pagerContainer,
                header = this._header,
                body = this._body,
                height = this.height,
                nonBodyHeight;

            container.height(height);

            if(height !== "auto") {
                height = container.height();

                nonBodyHeight = header.outerHeight(true);
                if(pagerContainer.parents(container).length) {
                    nonBodyHeight += pagerContainer.outerHeight(true);
                }

                body.outerHeight(height - nonBodyHeight);
            }

            return this;
        },

        refreshScrollbar: function() {
            var header = this._header,
                body = this._body,
                scrollbar = this.scrollbar;

            body.css("overflow-y", scrollbar ? "scroll" : "hidden");
            header.css("padding-right", scrollbar ? "16px" : "0");
        },

        refreshGridContent: function() {
            var content = this._content,
                indexFrom,
                indexTo,
                item,
                itemIndex;

            content.empty();

            if(!this.data.length) {
                content.append(this._createNoDataRow());
                return this;
            }

            indexFrom = this._loadStrategy.firstDisplayIndex();
            indexTo = this._loadStrategy.lastDisplayIndex();

            for(itemIndex = indexFrom; itemIndex < indexTo; itemIndex += 1) {
                item = this.data[itemIndex];
                content.append(this._createRow(item, itemIndex));
            }
            return this;
        },

        _createNoDataRow: function() {
            return $("<tr />").addClass(this.noDataRowClass)
                .append($("<td />").attr("colspan", this.fields.length).append(this.noDataContent()));
        },

        _createRow: function(item, itemIndex) {
            var result,
                grid = this,
                selectedRowClass;

            if($.isFunction(grid.rowRenderer)) {
                result = grid.rowRenderer(item, itemIndex);
            }
            else {
                result = $("<tr />")
                    .addClass(((itemIndex + 1) % 2) ? grid.oddRowClass : grid.evenRowClass)
                    .addClass(grid.rowClass(item, itemIndex));

                grid._renderRowCells(result, item);
            }

            result.data(JSGRID_ROW_DATA_KEY, item);

            result.on("click." + JSGRID, function(e) {
                grid.rowClick(e, item, itemIndex);
            });

            if(this.selecting) {
                selectedRowClass = grid.selectedRowClass;
                result
                    .on("mouseover." + JSGRID, function() {
                        $(this).addClass(selectedRowClass);
                    })
                    .on("mouseout." + JSGRID, function() {
                        $(this).removeClass(selectedRowClass);
                    });
            }

            return result;
        },

        _renderRowCells: function($row, item) {
            $.each(this.fields, function(index, field) {
                var fieldValue = item[field.name],
                    $cell = $("<td />")
                        .addClass(field.css)
                        .append(field.itemTemplate ? field.itemTemplate(fieldValue, item) : fieldValue);

                if(field.align) {
                    $cell.addClass("jsgrid-align-" + field.align);
                }

                if(field.cellTemplate) {
                    $cell = field.cellTemplate($cell, fieldValue, item);
                }

                $cell.appendTo($row)
                    .width(field.width || "auto");
            });
            return this;
        },

        sort: function(index) {
            this._clearSortingCss();
            this._setSortingField(index);
            this._loadStrategy.sort();
            return this;
        },

        _clearSortingCss: function() {
            this._headerRow.find("th")
                .removeClass(this.sortAscClass)
                .removeClass(this.sortDescClass);
            return this;
        },

        _setSortingField: function(index) {
            var field = this.fields[index];

            this._sortOrder = (this._sortField === field)
                ? this._sortOrder === SORT_ORDER_ASC ? SORT_ORDER_DESC : SORT_ORDER_ASC
                : SORT_ORDER_ASC;
            this._sortField = field;

            this._headerRow.find("th").eq(index)
                .addClass(this._sortOrder === SORT_ORDER_ASC ? this.sortAscClass : this.sortDescClass);
            return this;
        },

        _sortData: function() {
            var self = this,
                sortField = self._sortField;
            if(!sortField) {
                return this;
            }
                        
            this.data.sort(function(item1, item2) {
                return self._sortFactor() * sortField.sortingFunc(item1[sortField.name], item2[sortField.name]);
            });
            return this;
        },

        _sortFactor: function() {
            return this._sortOrder === SORT_ORDER_ASC ? 1 : -1;
        },

        _itemsCount: function() {
            return this._loadStrategy.itemsCount();
        },

        _pagesCount: function() {
            var itemsCount = this._itemsCount(),
                pageSize = this.pageSize;
            return Math.floor(itemsCount / pageSize) + (itemsCount % pageSize ? 1 : 0);
        },

        refreshPager: function() {
            var pagerContainer = this._pagerContainer;
            pagerContainer.empty();

            if(this.paging && this._pagesCount() > 1) {
                pagerContainer.show()
                    .append(this._createPager());
            }
            else {
                pagerContainer.hide();
            }
            return this;
        },

        _createPager: function() {
            var pageIndex = this.pageIndex,
                pageCount = this._pagesCount(),
                pagerParts = this.pagerFormat.split(" "),
                $pager;

            pagerParts = $.map(pagerParts, $.proxy(function(pagerPart) {
                var result = pagerPart;

                if(pagerPart === PAGES_PLACEHOLDER) {
                    result = this._createPagerPages();
                } else if(pagerPart === FIRST_PAGE_PLACEHOLDER) {
                    result = pageIndex > 1 ? this._createPagerNavButton(this.pageFirstText, 1) : "";
                } else if(pagerPart === PREV_PAGE_PLACEHOLDER) {
                    result = pageIndex > 1 ? this._createPagerNavButton(this.pagePrevText, pageIndex - 1) : "";
                } else if(pagerPart === NEXT_PAGE_PLACEHOLDER) {
                    result = pageIndex < pageCount ? this._createPagerNavButton(this.pageNextText, pageIndex + 1) : "";
                } else if(pagerPart === LAST_PAGE_PLACEHOLDER) {
                    result = pageIndex < pageCount ? this._createPagerNavButton(this.pageLastText, pageCount) : "";
                } else if(pagerPart === PAGE_INDEX_PLACEHOLDER) {
                    result = pageIndex;
                } else if(pagerPart === PAGE_COUNT_PLACEHOLDER) {
                    result = pageCount;
                }

                return $.isArray(result) ? result.concat([" "]) : [result, " "];
            }, this));

            $pager = $("<div />").addClass(this.pagerClass)
                .append(pagerParts);

            return $pager;
        },

        _createPagerPages: function() {
            var pageCount = this._pagesCount(),
                pageButtonCount = this.pageButtonCount,
                firstDisplayingPage = this._firstDisplayingPage,
                pages = [],
                pageNumber,
                i;

            if(firstDisplayingPage > 1) {
                pages.push(this._createPagerPageNavButton(this.pageNavigatorNextText, this.showPrevPages));
            }

            for(i = 0, pageNumber = firstDisplayingPage; i < pageButtonCount && pageNumber <= pageCount; i += 1, pageNumber += 1) {
                pages.push(pageNumber === this.pageIndex
                    ? this._createPagerCurrentPage()
                    : this._createPagerPage(pageNumber));
            }

            if((firstDisplayingPage + pageButtonCount - 1) < pageCount) {
                pages.push(this._createPagerPageNavButton(this.pageNavigatorPrevText, this.showNextPages));
            }

            return pages;
        },

        _createPagerNavButton: function(text, pageIndex) {
            return this._createPagerButton(text, this.pagerNavButtonClass, function() {
                this.openPage(pageIndex);
            });
        },

        _createPagerPageNavButton: function(text, handler) {
            return this._createPagerButton(text, this.pagerNavButtonClass, handler);
        },

        _createPagerPage: function(pageIndex) {
            return this._createPagerButton(pageIndex, this.pageClass, function() {
                this.openPage(pageIndex);
            });
        },

        _createPagerButton: function(text, css, handler) {
            var $link = $("<a />").attr("href", EMPTY_HREF)
                .html(text)
                .on("click." + JSGRID, $.proxy(handler, this));

            return $("<span />").addClass(css).append($link);
        },

        _createPagerCurrentPage: function() {
            return $("<span />")
                .addClass(this.pageClass)
                .addClass(this.currentPageClass)
                .text(this.pageIndex);
        },

        showPrevPages: function() {
            var firstDisplayingPage = this._firstDisplayingPage,
                pageButtonCount = this.pageButtonCount;
            this._firstDisplayingPage = (firstDisplayingPage > pageButtonCount) ? firstDisplayingPage - pageButtonCount : 1;
            this.refreshPager();
            return this;
        },

        showNextPages: function() {
            var firstDisplayingPage = this._firstDisplayingPage,
                pageButtonCount = this.pageButtonCount,
                pageCount = this._pagesCount();
            this._firstDisplayingPage = (firstDisplayingPage + 2 * pageButtonCount > pageCount)
                ? pageCount - pageButtonCount + 1
                : firstDisplayingPage + pageButtonCount;
            this.refreshPager();
            return this;
        },

        openPage: function(pageIndex) {
            this._setPage(pageIndex);
            this._loadStrategy.openPage(pageIndex);
            return this;
        },

        _setPage: function(pageIndex) {
            var firstDisplayingPage = this._firstDisplayingPage,
                pageButtonCount = this.pageButtonCount;

            this.pageIndex = pageIndex;

            if(pageIndex < firstDisplayingPage) {
                this._firstDisplayingPage = pageIndex;
            }

            if(pageIndex > firstDisplayingPage + pageButtonCount - 1) {
                this._firstDisplayingPage = pageIndex - pageButtonCount + 1;
            }

            return this;
        },

        search: function() {
            this.resetSorting();
            this.resetPager();
            this.loadData();
            return this;
        },

        loadData: function() {
            var promise,
                filter = this.filtering ? this.getFilter() : {};

            $.extend(filter, this._loadStrategy.loadParams(), this._sortingParams());

            this._callEventHandler(this.onDataLoading, {
                filter: filter
            });

            promise = $.when(this.controller.loadData(filter))
                .done($.proxy(function(loadedData) {
                    this._loadStrategy.finishLoad(loadedData);

                    this._callEventHandler(this.onDataLoaded, {
                        data: loadedData
                    });
                }, this));

            return promise;
        },

        _sortingParams: function() {
            if(this.sorting && this._sortField) {
                return {
                    sortField: this._sortField.name,
                    sortOrder: this._sortOrder
                };
            }
            return {};
        },

        getFilter: function() {
            var result = {};
            $.each(this.fields, function(index, field) {
                if(field.filtering) {
                    result[field.name] = field.filterValue();
                }
            });
            return result;
        },

        setFilter: function(filter) {
            filter = filter || {};
            $.each(this.fields, function(index, field) {
                if(field.filtering) {
                    field.filterValue(filter[field.name]);
                }
            });
            return this;
        },

        clearFilter: function() {
            var filterRow = this._createFilterRow();
            this._filterRow.replaceWith(filterRow);
            this._filterRow = filterRow;
            return this;
        },

        insertItem: function() {
            var promise,
                insertingItem = this._getInsertItem();

            this._callEventHandler(this.onItemInserting, {
                item: insertingItem
            });

            promise = $.when(this.controller.insertItem(insertingItem))
                .done($.proxy(function(insertedItem) {
                    insertedItem = insertedItem || insertingItem;
                    this._loadStrategy.finishInsert(insertedItem);

                    this._callEventHandler(this.onItemInserted, {
                        item: insertedItem
                    });
                }, this));

            return promise;
        },

        _getInsertItem: function() {
            var result = {};
            $.each(this.fields, function(index, field) {
                if(field.inserting) {
                    result[field.name] = field.insertValue();
                }
            });
            return result;
        },

        clearInsert: function() {
            var insertRow = this._createInsertRow();
            this._insertRow.replaceWith(insertRow);
            this._insertRow = insertRow;
            return this;
        },

        editItem: function(item) {
            var $row = this.rowByItem(item);
            if($row) {
                this.editRow($row);
            }
        },

        rowByItem: function(item) {
            return this._content.find("tr").filter(function() {
                return $.data(this, JSGRID_ROW_DATA_KEY) === item;
            });
        },

        editRow: function($row) {
            if(!this.editing) {
                return;
            }

            if(this._editingRow) {
                this.cancelEdit();
            }

            var item = $row.data(JSGRID_ROW_DATA_KEY),
                $editRow = this._createEditRow(item);

            this._editingRow = $row;
            $row.hide();
            $editRow.insertAfter($row);
            $row.data(JSGRID_EDIT_ROW_DATA_KEY, $editRow);
        },

        _createEditRow: function(item) {
            if($.isFunction(this.editRowRenderer)) {
                return this.editRowRenderer(item);
            }

            var result = $("<tr />").addClass(this.editRowClass);

            $.each(this.fields, function(index, field) {
                $("<td />").addClass(field.css)
                    .appendTo(result)
                    .append(field.editTemplate ? field.editTemplate(item[field.name], item) : "")
                    .width(field.width || "auto");
            });

            return result;
        },

        updateItem: function() {
            var promise,
                $editingRow = this._editingRow,
                updatingItem = $editingRow.data(JSGRID_ROW_DATA_KEY),
                updatingItemIndex = $.inArray(updatingItem, this.data);

            $.extend(updatingItem, this._getEditedItem());

            this._callEventHandler(this.onItemUpdating, {
                row: $editingRow,
                item: updatingItem,
                itemIndex: updatingItemIndex
            });

            promise = $.when(this.controller.updateItem(updatingItem))
                .done($.proxy(function(updatedItem) {
                    updatedItem = updatedItem || updatingItem;
                    this._finishUpdate(updatedItem, updatingItemIndex);

                    this._callEventHandler(this.onItemUpdated, {
                        row: $editingRow,
                        item: updatedItem,
                        itemIndex: updatingItemIndex
                    });
                }, this));

            return promise;
        },

        _finishUpdate: function(updatedItem, updatedItemIndex) {
            var $row = this._editingRow;
            this.cancelEdit();
            this.data[updatedItemIndex] = updatedItem;
            $row.replaceWith(this._createRow(updatedItem, updatedItemIndex));
        },

        _getEditedItem: function() {
            var result = {};
            $.each(this.fields, function(index, field) {
                if(field.editing) {
                    result[field.name] = field.editValue();
                }
            });
            return result;
        },

        cancelEdit: function() {
            if(!this._editingRow) {
                return;
            }

            var $row = this._editingRow,
                $editRow = $row.data(JSGRID_EDIT_ROW_DATA_KEY);

            $editRow.remove();
            $row.show();
            this._editingRow = null;
        },

        deleteItem: function(item) {
            if(this.confirmDeleting && !window.confirm(this.deleteConfirm(item))) {
                return;
            }

            var $row = this._content.find("tr").filter(function() {
                return $.data(this, JSGRID_ROW_DATA_KEY) === item;
            });

            if($row.length) {
                return this.deleteRow($row);
            }
        },

        deleteRow: function($row) {
            var promise,
                deletingItem = $row.data(JSGRID_ROW_DATA_KEY),
                deletingItemIndex = $.inArray(deletingItem, this.data);

            this._callEventHandler(this.onItemDeleting, {
                row: $row,
                item: deletingItem,
                itemIndex: deletingItemIndex
            });

            promise = $.when(this.controller.deleteItem(deletingItem))
                .done($.proxy(function() {
                    this._loadStrategy.finishDelete(deletingItem, deletingItemIndex);

                    this._callEventHandler(this.onItemDeleted, {
                        row: $row,
                        item: deletingItem,
                        itemIndex: deletingItemIndex
                    });
                }, this));

            return promise;
        }
    };

    $.fn.jsGrid = function(config) {
        var args = $.makeArray(arguments),
            methodArgs = args.slice(1),
            result = this;

        this.each(function() {
            var $element = $(this),
                instance = $element.data(JSGRID_DATA_KEY),
                methodResult;

            if(instance) {
                if(typeof config === "string") {
                    methodResult = instance[config].apply(instance, methodArgs);
                    if(methodResult !== undefined && methodResult !== instance) {
                        result = methodResult;
                        return false;
                    }
                }
                else {
                    instance._detachWindowResizeCallback();
                    instance._init(config);
                    instance.render();
                }
            }
            else {
                instance = new Grid($element, config);
                instance.render();
            }
        });

        return result;
    };

    window.jsGrid = {
        Grid: Grid
    };

}(window, jQuery));