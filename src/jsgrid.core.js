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
        ITEM_COUNT_PLACEHOLDER = "{itemCount}",

        EMPTY_HREF = "javascript:void(0);";

    var getOrApply = function(value, context) {
        if($.isFunction(value)) {
            return value.apply(context, $.makeArray(arguments).slice(2));
        }
        return value;
    };

    var normalizePromise = function(promise) {
        var d = $.Deferred();

        if(promise && promise.then) {
            promise.then(function() {
                d.resolve.apply(d, arguments);
            }, function() {
                d.reject.apply(d, arguments);
            });
        } else {
            d.resolve(promise);
        }

        return d.promise();
    };

    var defaultController = {
        loadData: $.noop,
        insertItem: $.noop,
        updateItem: $.noop,
        deleteItem: $.noop
    };


    function Grid(element, config) {
        var $element = $(element);

        $element.data(JSGRID_DATA_KEY, this);

        this._container = $element;

        this.data = [];
        this.fields = [];

        this._editingRow = null;
        this._sortField = null;
        this._sortOrder = SORT_ORDER_ASC;
        this._firstDisplayingPage = 1;

        this._init(config);
        this.render();
    }

    Grid.prototype = {
        width: "auto",
        height: "auto",
        updateOnResize: true,

        rowClass: $.noop,
        rowRenderer: null,

        rowClick: function(args) {
            if(this.editing) {
                this.editItem($(args.event.target).closest("tr"));
            }
        },
        rowDoubleClick: $.noop,

        noDataContent: "Not found",
        noDataRowClass: "jsgrid-nodata-row",

        heading: true,
        headerRowRenderer: null,
        headerRowClass: "jsgrid-header-row",
        headerCellClass: "jsgrid-header-cell",

        filtering: false,
        filterRowRenderer: null,
        filterRowClass: "jsgrid-filter-row",

        inserting: false,
        insertRowLocation: "bottom",
        insertRowRenderer: null,
        insertRowClass: "jsgrid-insert-row",

        editing: false,
        editRowRenderer: null,
        editRowClass: "jsgrid-edit-row",

        confirmDeleting: true,
        deleteConfirm: "Are you sure?",

        autocommit: false,
        confirmAutocommit: true,
        autocommitConfirm: "Save changes?",

        selecting: true,
        selectedRowClass: "jsgrid-selected-row",
        oddRowClass: "jsgrid-row",
        evenRowClass: "jsgrid-alt-row",
        cellClass: "jsgrid-cell",

        sorting: false,
        sortableClass: "jsgrid-header-sortable",
        sortAscClass: "jsgrid-header-sort jsgrid-header-sort-asc",
        sortDescClass: "jsgrid-header-sort jsgrid-header-sort-desc",

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
        pagerNavButtonInactiveClass: "jsgrid-pager-nav-inactive-button",
        pageClass: "jsgrid-pager-page",
        currentPageClass: "jsgrid-pager-current-page",

        customLoading: false,
        pageLoading: false,

        autoload: false,
        controller: defaultController,

        loadIndication: true,
        loadIndicationDelay: 500,
        loadMessage: "Please, wait...",
        loadShading: true,

        invalidMessage: "Invalid data entered!",

        invalidNotify: function(args) {
            var messages = $.map(args.errors, function(error) {
                return error.message || null;
            });

            window.alert([this.invalidMessage].concat(messages).join("\n"));
        },

        onInit: $.noop,
        onRefreshing: $.noop,
        onRefreshed: $.noop,
        onPageChanged: $.noop,
        onItemDeleting: $.noop,
        onItemDeleted: $.noop,
        onItemInserting: $.noop,
        onItemInserted: $.noop,
        onItemEditing: $.noop,
        onItemEditCancelling: $.noop,
        onItemUpdating: $.noop,
        onItemUpdated: $.noop,
        onItemInvalid: $.noop,
        onDataLoading: $.noop,
        onDataLoaded: $.noop,
        onDataExporting: $.noop,
        onOptionChanging: $.noop,
        onOptionChanged: $.noop,
        onError: $.noop,

        invalidClass: "jsgrid-invalid",

        containerClass: "jsgrid",
        tableClass: "jsgrid-table",
        gridHeaderClass: "jsgrid-grid-header",
        gridBodyClass: "jsgrid-grid-body",

        _init: function(config) {
            $.extend(this, config);
            this._initLoadStrategy();
            this._initController();
            this._initFields();
            this._attachWindowLoadResize();
            this._attachWindowResizeCallback();
            this._callEventHandler(this.onInit)
        },

        loadStrategy: function() {
            return this.pageLoading
                ? new jsGrid.loadStrategies.PageLoadingStrategy(this)
                : new jsGrid.loadStrategies.DirectLoadingStrategy(this);
        },

        _initLoadStrategy: function() {
            this._loadStrategy = getOrApply(this.loadStrategy, this);
        },

        _initController: function() {
            this._controller = $.extend({}, defaultController, getOrApply(this.controller, this));
        },

        renderTemplate: function(source, context, config) {
            var args = [];
            for(var key in config) {
                args.push(config[key]);
            }

            args.unshift(source, context);

            source = getOrApply.apply(null, args);
            return (source === undefined || source === null) ? "" : source;
        },

        loadIndicator: function(config) {
            return new jsGrid.LoadIndicator(config);
        },

        validation: function(config) {
            return jsGrid.Validation && new jsGrid.Validation(config);
        },

        _initFields: function() {
            var self = this;
            self.fields = $.map(self.fields, function(field) {
                if($.isPlainObject(field)) {
                    var fieldConstructor = (field.type && jsGrid.fields[field.type]) || jsGrid.Field;
                    field = new fieldConstructor(field);
                }
                field._grid = self;
                return field;
            });
        },

        _attachWindowLoadResize: function() {
            $(window).on("load", $.proxy(this._refreshSize, this));
        },

        _attachWindowResizeCallback: function() {
            if(this.updateOnResize) {
                $(window).on("resize", $.proxy(this._refreshSize, this));
            }
        },

        _detachWindowResizeCallback: function() {
            $(window).off("resize", this._refreshSize);
        },

        option: function(key, value) {
            var optionChangingEventArgs,
                optionChangedEventArgs;

            if(arguments.length === 1)
                return this[key];

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
        },

        fieldOption: function(field, key, value) {
            field = this._normalizeField(field);

            if(arguments.length === 2)
                return field[key];

            field[key] = value;
            this._renderGrid();
        },

        _handleOptionChange: function(name, value) {
            this[name] = value;

            switch(name) {
                case "width":
                case "height":
                    this._refreshSize();
                    break;
                case "rowClass":
                case "rowRenderer":
                case "rowClick":
                case "rowDoubleClick":
                case "noDataRowClass":
                case "noDataContent":
                case "selecting":
                case "selectedRowClass":
                case "oddRowClass":
                case "evenRowClass":
                    this._refreshContent();
                    break;
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
                case "pagerRenderer":
                    this._refreshPager();
                    break;
                case "fields":
                    this._initFields();
                    this.render();
                    break;
                case "data":
                case "editing":
                case "heading":
                case "filtering":
                case "inserting":
                case "paging":
                    if (name == "inserting") this._checkAutocommit();
                    this.refresh();
                    break;
                case "loadStrategy":
                case "pageLoading":
                    this._initLoadStrategy();
                    this.search();
                    break;
                case "pageIndex":
                    this.openPage(value);
                    break;
                case "pageSize":
                    this.refresh();
                    this.search();
                    break;
                case "editRowRenderer":
                case "editRowClass":
                    this.cancelEdit();
                    break;
                case "updateOnResize":
                    this._detachWindowResizeCallback();
                    this._attachWindowResizeCallback();
                    break;
                case "invalidNotify":
                case "invalidMessage":
                    break;
                default:
                    this.render();
                    break;
            }
        },

        destroy: function() {
            this._detachWindowResizeCallback();
            this._clear();
            this._container.removeData(JSGRID_DATA_KEY);
        },

        render: function() {
            this._renderGrid();
            return this.autoload ? this.loadData() : $.Deferred().resolve().promise();
        },

        _renderGrid: function() {
            this._clear();

            this._container.addClass(this.containerClass)
                .css("position", "relative")
                .append(this._createHeader())
                .append(this._createBody());

            this._pagerContainer = this._createPagerContainer();
            this._loadIndicator = this._createLoadIndicator();
            this._validation = this._createValidation();

            this.refresh();
        },

        _createLoadIndicator: function() {
            return getOrApply(this.loadIndicator, this, {
                message: this.loadMessage,
                shading: this.loadShading,
                container: this._container
            });
        },

        _createValidation: function() {
            return getOrApply(this.validation, this);
        },

        _clear: function() {
            this.cancelEdit();

            clearTimeout(this._loadingTimer);

            this._pagerContainer && this._pagerContainer.empty();

            this._container.empty()
                .css({ position: "", width: "", height: "" });
        },

        _createHeader: function() {
            var $headerRow = this._headerRow = this._createHeaderRow(),
                $filterRow = this._filterRow = this._createFilterRow(),
                $insertRow = this._insertRow = this._createInsertRow();

            var $headerGrid = this._headerGrid = $("<table>").addClass(this.tableClass)
                .append($headerRow)
                .append($filterRow)
                .append($insertRow);

            var $header = this._header = $("<div>").addClass(this.gridHeaderClass)
                .addClass(this._scrollBarWidth() ? "jsgrid-header-scrollbar" : "")
                .append($headerGrid);

            return $header;
        },

        _createBody: function() {
            var $content = this._content = $("<tbody>");

            var $bodyGrid = this._bodyGrid = $("<table>").addClass(this.tableClass)
                .append($content);

            var $body = this._body = $("<div>").addClass(this.gridBodyClass)
                .append($bodyGrid)
                .on("scroll", $.proxy(function(e) {
                    this._header.scrollLeft(e.target.scrollLeft);
                }, this));

            return $body;
        },

        _createPagerContainer: function() {
            var pagerContainer = this.pagerContainer || $("<div>").appendTo(this._container);
            return $(pagerContainer).addClass(this.pagerContainerClass);
        },

        _eachField: function(callBack) {
            var self = this;
            $.each(this.fields, function(index, field) {
                if(field.visible) {
                    callBack.call(self, field, index);
                }
            });
        },

        _createHeaderRow: function() {
            if($.isFunction(this.headerRowRenderer))
                return $(this.renderTemplate(this.headerRowRenderer, this));

            var $result = $("<tr>").addClass(this.headerRowClass);

            this._eachField(function(field, index) {
                var $th = this._prepareCell("<th>", field, "headercss", this.headerCellClass)
                    .append(this.renderTemplate(field.headerTemplate, field))
                    .appendTo($result);

                if(this.sorting && field.sorting) {
                    $th.addClass(this.sortableClass)
                        .on("click", $.proxy(function() {
                            this.sort(index);
                        }, this));
                }
            });

            return $result;
        },

        _prepareCell: function(cell, field, cssprop, cellClass) {
            return $(cell).css("width", field.width)
                .addClass(cellClass || this.cellClass)
                .addClass((cssprop && field[cssprop]) || field.css)
                .addClass(field.align ? ("jsgrid-align-" + field.align) : "");
        },

        _createFilterRow: function() {
            if($.isFunction(this.filterRowRenderer))
                return $(this.renderTemplate(this.filterRowRenderer, this));

            var $result = $("<tr>").addClass(this.filterRowClass);

            this._eachField(function(field) {
                this._prepareCell("<td>", field, "filtercss")
                    .append(this.renderTemplate(field.filterTemplate, field))
                    .appendTo($result);
            });

            return $result;
        },

        _createInsertRow: function() {
            if($.isFunction(this.insertRowRenderer))
                return $(this.renderTemplate(this.insertRowRenderer, this));

            var $result = $("<tr>").addClass(this.insertRowClass);

            this._eachField(function(field) {
                this._prepareCell("<td>", field, "insertcss")
                    .append(this.renderTemplate(field.insertTemplate, field))
                    .appendTo($result);
            });

            return $result;
        },

        _callEventHandler: function(handler, eventParams) {
            handler.call(this, $.extend(eventParams, {
                grid: this
            }));

            return eventParams;
        },

        reset: function() {
            this._resetSorting();
            this._resetPager();
            return this._loadStrategy.reset();
        },

        _resetPager: function() {
            this._firstDisplayingPage = 1;
            this._setPage(1);
        },

        _resetSorting: function() {
            this._sortField = null;
            this._sortOrder = SORT_ORDER_ASC;
            this._clearSortingCss();
        },

        refresh: function() {
            this._callEventHandler(this.onRefreshing);

            this.cancelEdit();

            this._refreshHeading();
            this._refreshFiltering();
            this._refreshInserting();
            this._refreshContent();
            this._refreshPager();
            this._refreshSize();

            this._callEventHandler(this.onRefreshed);
        },

        _refreshHeading: function() {
            this._headerRow.toggle(this.heading);
        },

        _refreshFiltering: function() {
            this._filterRow.toggle(this.filtering);
        },

        _refreshInserting: function() {
            this._insertRow.toggle(this.inserting);
        },

        _refreshContent: function() {
            var $content = this._content;
            $content.empty();

            if(!this.data.length) {
                $content.append(this._createNoDataRow());
                return this;
            }

            var indexFrom = this._loadStrategy.firstDisplayIndex();
            var indexTo = this._loadStrategy.lastDisplayIndex();

            for(var itemIndex = indexFrom; itemIndex < indexTo; itemIndex++) {
                var item = this.data[itemIndex];
                $content.append(this._createRow(item, itemIndex));
            }
        },

        _createNoDataRow: function() {
            var amountOfFields = 0;
            this._eachField(function() {
                amountOfFields++;
            });

            return $("<tr>").addClass(this.noDataRowClass)
                .append($("<td>").addClass(this.cellClass).attr("colspan", amountOfFields)
                    .append(this.renderTemplate(this.noDataContent, this)));
        },

        _createRow: function(item, itemIndex) {
            var $result;

            if($.isFunction(this.rowRenderer)) {
                $result = this.renderTemplate(this.rowRenderer, this, { item: item, itemIndex: itemIndex });
            } else {
                $result = $("<tr>");
                this._renderCells($result, item);
            }

            $result.addClass(this._getRowClasses(item, itemIndex))
                .data(JSGRID_ROW_DATA_KEY, item)
                .on("click", $.proxy(function(e) {
                    this.rowClick({
                        item: item,
                        itemIndex: itemIndex,
                        event: e
                    });
                }, this))
                .on("dblclick", $.proxy(function(e) {
                    this.rowDoubleClick({
                        item: item,
                        itemIndex: itemIndex,
                        event: e
                    });
                }, this));

            if(this.selecting) {
                this._attachRowHover($result);
            }

            return $result;
        },

        _getRowClasses: function(item, itemIndex) {
            var classes = [];
            classes.push(((itemIndex + 1) % 2) ? this.oddRowClass : this.evenRowClass);
            classes.push(getOrApply(this.rowClass, this, item, itemIndex));
            return classes.join(" ");
        },

        _attachRowHover: function($row) {
            var selectedRowClass = this.selectedRowClass;
            $row.hover(function() {
                    $(this).addClass(selectedRowClass);
                },
                function() {
                    $(this).removeClass(selectedRowClass);
                }
            );
        },

        _renderCells: function($row, item) {
            this._eachField(function(field) {
                $row.append(this._createCell(item, field));
            });
            return this;
        },

        _createCell: function(item, field) {
            var $result;
            var fieldValue = this._getItemFieldValue(item, field);

            var args = { value: fieldValue, item : item };
            if($.isFunction(field.cellRenderer)) {
                $result = this.renderTemplate(field.cellRenderer, field, args);
            } else {
                $result = $("<td>").append(this.renderTemplate(field.itemTemplate || fieldValue, field, args));
            }

            return this._prepareCell($result, field);
        },

        _getItemFieldValue: function(item, field) {
            var props = field.name.split('.');
            var result = item[props.shift()];

            while(result && props.length) {
                result = result[props.shift()];
            }

            return result;
        },

        _setItemFieldValue: function(item, field, value) {
            var props = field.name.split('.');
            var current = item;
            var prop = props[0];

            while(current && props.length) {
                item = current;
                prop = props.shift();
                current = item[prop];
            }

            if(!current) {
                while(props.length) {
                    item = item[prop] = {};
                    prop = props.shift();
                }
            }

            item[prop] = value;
        },

        sort: function(field, order) {
            if($.isPlainObject(field)) {
                order = field.order;
                field = field.field;
            }

            this._clearSortingCss();
            this._setSortingParams(field, order);
            this._setSortingCss();
            return this._loadStrategy.sort();
        },

        _clearSortingCss: function() {
            this._headerRow.find("th")
                .removeClass(this.sortAscClass)
                .removeClass(this.sortDescClass);
        },

        _setSortingParams: function(field, order) {
            field = this._normalizeField(field);
            order = order || ((this._sortField === field) ? this._reversedSortOrder(this._sortOrder) : SORT_ORDER_ASC);

            this._sortField = field;
            this._sortOrder = order;
        },

        _normalizeField: function(field) {
            if($.isNumeric(field)) {
                return this.fields[field];
            }

            if(typeof field === "string") {
                return $.grep(this.fields, function(f) {
                    return f.name === field;
                })[0];
            }

            return field;
        },

        _reversedSortOrder: function(order) {
            return (order === SORT_ORDER_ASC ? SORT_ORDER_DESC : SORT_ORDER_ASC);
        },

        _setSortingCss: function() {
            var fieldIndex = this._visibleFieldIndex(this._sortField);

            this._headerRow.find("th").eq(fieldIndex)
                .addClass(this._sortOrder === SORT_ORDER_ASC ? this.sortAscClass : this.sortDescClass);
        },

        _visibleFieldIndex: function(field) {
            return $.inArray(field, $.grep(this.fields, function(f) { return f.visible; }));
        },

        _sortData: function() {
            var sortFactor = this._sortFactor(),
                sortField = this._sortField;

            if(sortField) {
                var self = this;
                self.data.sort(function(item1, item2) {
                    var value1 = self._getItemFieldValue(item1, sortField);
                    var value2 = self._getItemFieldValue(item2, sortField);
                    return sortFactor * sortField.sortingFunc(value1, value2);
                });
            }
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

        _refreshPager: function() {
            var $pagerContainer = this._pagerContainer;
            $pagerContainer.empty();

            if(this.paging) {
                $pagerContainer.append(this._createPager());
            }

            var showPager = this.paging && this._pagesCount() > 1;
            $pagerContainer.toggle(showPager);
        },

        _createPager: function() {
            var $result;

            if($.isFunction(this.pagerRenderer)) {
                $result = $(this.pagerRenderer({
                    pageIndex: this.pageIndex,
                    pageCount: this._pagesCount()
                }));
            } else {
                $result = $("<div>").append(this._createPagerByFormat());
            }

            $result.addClass(this.pagerClass);

            return $result;
        },

        _createPagerByFormat: function() {
            var pageIndex = this.pageIndex,
                pageCount = this._pagesCount(),
                itemCount = this._itemsCount(),
                pagerParts = this.pagerFormat.split(" ");

            return $.map(pagerParts, $.proxy(function(pagerPart) {
                var result = pagerPart;

                if(pagerPart === PAGES_PLACEHOLDER) {
                    result = this._createPages();
                } else if(pagerPart === FIRST_PAGE_PLACEHOLDER) {
                    result = this._createPagerNavButton(this.pageFirstText, 1, pageIndex > 1);
                } else if(pagerPart === PREV_PAGE_PLACEHOLDER) {
                    result = this._createPagerNavButton(this.pagePrevText, pageIndex - 1, pageIndex > 1);
                } else if(pagerPart === NEXT_PAGE_PLACEHOLDER) {
                    result = this._createPagerNavButton(this.pageNextText, pageIndex + 1, pageIndex < pageCount);
                } else if(pagerPart === LAST_PAGE_PLACEHOLDER) {
                    result = this._createPagerNavButton(this.pageLastText, pageCount, pageIndex < pageCount);
                } else if(pagerPart === PAGE_INDEX_PLACEHOLDER) {
                    result = pageIndex;
                } else if(pagerPart === PAGE_COUNT_PLACEHOLDER) {
                    result = pageCount;
                } else if(pagerPart === ITEM_COUNT_PLACEHOLDER) {
                    result = itemCount;
                }

                return $.isArray(result) ? result.concat([" "]) : [result, " "];
            }, this));
        },

        _createPages: function() {
            var pageCount = this._pagesCount(),
                pageButtonCount = this.pageButtonCount,
                firstDisplayingPage = this._firstDisplayingPage,
                pages = [];

            if(firstDisplayingPage > 1) {
                pages.push(this._createPagerPageNavButton(this.pageNavigatorPrevText, this.showPrevPages));
            }

            for(var i = 0, pageNumber = firstDisplayingPage; i < pageButtonCount && pageNumber <= pageCount; i++, pageNumber++) {
                pages.push(pageNumber === this.pageIndex
                    ? this._createPagerCurrentPage()
                    : this._createPagerPage(pageNumber));
            }

            if((firstDisplayingPage + pageButtonCount - 1) < pageCount) {
                pages.push(this._createPagerPageNavButton(this.pageNavigatorNextText, this.showNextPages));
            }

            return pages;
        },

        _createPagerNavButton: function(text, pageIndex, isActive) {
            return this._createPagerButton(text, this.pagerNavButtonClass + (isActive ? "" : " " + this.pagerNavButtonInactiveClass),
                isActive ? function() { this.openPage(pageIndex); } : $.noop);
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
            var $link = $("<a>").attr("href", EMPTY_HREF)
                .html(text)
                .on("click", $.proxy(handler, this));

            return $("<span>").addClass(css).append($link);
        },

        _createPagerCurrentPage: function() {
            return $("<span>")
                .addClass(this.pageClass)
                .addClass(this.currentPageClass)
                .text(this.pageIndex);
        },

        _refreshSize: function() {
            this._refreshHeight();
            this._refreshWidth();
        },

        _refreshWidth: function() {
            var width = (this.width === "auto") ? this._getAutoWidth() : this.width;

            this._container.width(width);
        },

        _getAutoWidth: function() {
            var $headerGrid = this._headerGrid,
                $header = this._header;

            $headerGrid.width("auto");

            var contentWidth = $headerGrid.outerWidth();
            var borderWidth = $header.outerWidth() - $header.innerWidth();

            $headerGrid.width("");

            return contentWidth + borderWidth;
        },

        _scrollBarWidth: (function() {
            var result;

            return function() {
                if(result === undefined) {
                    var $ghostContainer = $("<div style='width:50px;height:50px;overflow:hidden;position:absolute;top:-10000px;left:-10000px;'></div>");
                    var $ghostContent = $("<div style='height:100px;'></div>");
                    $ghostContainer.append($ghostContent).appendTo("body");
                    var width = $ghostContent.innerWidth();
                    $ghostContainer.css("overflow-y", "auto");
                    var widthExcludingScrollBar = $ghostContent.innerWidth();
                    $ghostContainer.remove();
                    result = width - widthExcludingScrollBar;
                }
                return result;
            };
        })(),

        _refreshHeight: function() {
            var container = this._container,
                pagerContainer = this._pagerContainer,
                height = this.height,
                nonBodyHeight;

            container.height(height);

            if(height !== "auto") {
                height = container.height();

                nonBodyHeight = this._header.outerHeight(true);
                if(pagerContainer.parents(container).length) {
                    nonBodyHeight += pagerContainer.outerHeight(true);
                }

                this._body.outerHeight(height - nonBodyHeight);
            }
        },

        showPrevPages: function() {
            var firstDisplayingPage = this._firstDisplayingPage,
                pageButtonCount = this.pageButtonCount;

            this._firstDisplayingPage = (firstDisplayingPage > pageButtonCount) ? firstDisplayingPage - pageButtonCount : 1;

            this._refreshPager();
        },

        showNextPages: function() {
            var firstDisplayingPage = this._firstDisplayingPage,
                pageButtonCount = this.pageButtonCount,
                pageCount = this._pagesCount();

            this._firstDisplayingPage = (firstDisplayingPage + 2 * pageButtonCount > pageCount)
                ? pageCount - pageButtonCount + 1
                : firstDisplayingPage + pageButtonCount;

            this._refreshPager();
        },

        openPage: function(pageIndex) {
            if(pageIndex < 1 || pageIndex > this._pagesCount())
                return;

            this._setPage(pageIndex);
            this._loadStrategy.openPage(pageIndex);
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

            this._callEventHandler(this.onPageChanged, {
                pageIndex: pageIndex
            });
        },

        _controllerCall: function(method, param, isCanceled, doneCallback) {
            if(isCanceled)
                return $.Deferred().reject().promise();

            this._showLoading();

            var controller = this._controller;
            if(!controller || !controller[method]) {
                throw Error("controller has no method '" + method + "'");
            }

            return normalizePromise(controller[method](param))
                .done($.proxy(doneCallback, this))
                .fail($.proxy(this._errorHandler, this))
                .always($.proxy(this._hideLoading, this));
        },

        _errorHandler: function() {
            this._callEventHandler(this.onError, {
                args: $.makeArray(arguments)
            });
        },

        _showLoading: function() {
            if(!this.loadIndication)
                return;

            clearTimeout(this._loadingTimer);

            this._loadingTimer = setTimeout($.proxy(function() {
                this._loadIndicator.show();
            }, this), this.loadIndicationDelay);
        },

        _hideLoading: function() {
            if(!this.loadIndication)
                return;

            clearTimeout(this._loadingTimer);
            this._loadIndicator.hide();
        },

        search: function(filter) {
            this._resetSorting();
            this._resetPager();
            return this.loadData(filter);
        },

        loadData: function(filter) {
            filter = filter || (this.filtering ? this.getFilter() : {});

            $.extend(filter, this._loadStrategy.loadParams(), this._sortingParams());

            var args = this._callEventHandler(this.onDataLoading, {
                filter: filter
            });

            return this._controllerCall("loadData", filter, args.cancel, function(loadedData) {
                if(!loadedData)
                    return;

                this._loadStrategy.finishLoad(loadedData);

                this._callEventHandler(this.onDataLoaded, {
                    data: loadedData
                });
            });
        },
        
        exportData: function(exportOptions){
            var options = exportOptions || {};
            var type = options.type || "csv";
            
            var result = "";
            
            this._callEventHandler(this.onDataExporting);
            
            switch(type){
                
                case "csv":
                    result = this._dataToCsv(options);
                    break;
                
            }
            return result;
        },
        
        _dataToCsv: function(options){
            var options = options || {};
            var includeHeaders = options.hasOwnProperty("includeHeaders") ? options.includeHeaders : true;
            var subset = options.subset || "all";
            var filter = options.filter || undefined;
            
            var result = [];
            
            if (includeHeaders){
                var fieldsLength = this.fields.length;
                var fieldNames = {};
                
                for(var i=0;i<fieldsLength;i++){
                    var field = this.fields[i];
                    
                    if ("includeInDataExport" in field){
                        if (field.includeInDataExport === true)
                            fieldNames[i] = field.title || field.name;
                    }
                        
                }
                
                var headerLine = this._itemToCsv(fieldNames,{},options);
                result.push(headerLine);
            }
            
            var exportStartIndex = 0;
            var exportEndIndex = this.data.length;
            
            switch(subset){
                
                case "visible":
                    exportEndIndex = this._firstDisplayingPage * this.pageSize;
                    exportStartIndex = exportEndIndex - this.pageSize;
                
                case "all":
                default:
                    break;
            }
            
            for (var i = exportStartIndex; i < exportEndIndex; i++){
                var item = this.data[i];
                var itemLine = "";
                var includeItem = true;
                
                if (filter)
                    if (!filter(item))
                        includeItem = false;
                
                if (includeItem){
                    itemLine = this._itemToCsv(item, this.fields, options);
                    result.push(itemLine);
                }
                
            }
            
            return result.join("");
            
        },
        
        _itemToCsv: function(item, fields, options){
            var options = options || {};
            var delimiter = options.delimiter || "|";
            var encapsulate = options.hasOwnProperty("encapsulate") ? options.encapsulate : true;
            var newline = options.newline || "\r\n";
            var transforms = options.transforms || {};
            
            var fields = fields || {};
            var getItem = this._getItemFieldValue;
            var result = [];
            
            Object.keys(item).forEach(function(key,index) {
                
                var entry = "";
                
                //Fields.length is greater than 0 when we are matching agaisnt fields
                //Field.length will be 0 when exporting header rows
                if (fields.length > 0){
                    
                    var field = fields[index];
                    
                    //Field may be excluded from data export
                    if ("includeInDataExport" in field){
                        
                        if (field.includeInDataExport){
                            
                            //Field may be a select, which requires additional logic
                            if (field.type === "select"){
                                
                                var selectedItem = getItem(item, field);
                                
                                var resultItem = $.grep(field.items, function(item, index) {
                                    return item[field.valueField] === selectedItem;
                                })[0] || "";
                                
                                entry = resultItem[field.textField];
                            }
                            else{
                                entry = getItem(item, field);
                            }
                        }
                        else{
                            return;
                        }
                            
                    }
                    else{
                        entry = getItem(item, field);
                    }
                    
                    if (transforms.hasOwnProperty(field.name)){
                        entry = transforms[field.name](entry);
                    }
                        
                    
                }
                else{
                    entry = item[key];
                }
                
                if (encapsulate){
                    entry = '"'+entry+'"';
                }
                    
                
                result.push(entry);
            });
            
            return result.join(delimiter) + newline;
        },

        getFilter: function() {
            var result = {};
            this._eachField(function(field) {
                if(field.filtering) {
                    this._setItemFieldValue(result, field, field.filterValue());
                }
            });
            return result;
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

        getSorting: function() {
            var sortingParams = this._sortingParams();
            return {
                field: sortingParams.sortField,
                order: sortingParams.sortOrder
            };
        },

        clearFilter: function() {
            var $filterRow = this._createFilterRow();
            this._filterRow.replaceWith($filterRow);
            this._filterRow = $filterRow;
            return this.search();
        },

        insertItem: function(item) {
            var insertingItem = item || this._getValidatedInsertItem();

            if(!insertingItem)
                return $.Deferred().reject().promise();

            var args = this._callEventHandler(this.onItemInserting, {
                item: insertingItem
            });

            return this._controllerCall("insertItem", insertingItem, args.cancel, function(insertedItem) {
                insertedItem = insertedItem || insertingItem;
                this._loadStrategy.finishInsert(insertedItem, this.insertRowLocation);

                this._callEventHandler(this.onItemInserted, {
                    item: insertedItem
                });
            });
        },

        _getValidatedInsertItem: function() {
            var item = this._getInsertItem();
            return this._validateItem(item, this._insertRow) ? item : null;
        },

        _getInsertItem: function() {
            var result = {};
            this._eachField(function(field) {
                if(field.inserting) {
                    this._setItemFieldValue(result, field, field.insertValue());
                }
            });
            return result;
        },

        _validateItem: function(item, $row) {
            var validationErrors = [];

            var args = {
                item: item,
                itemIndex: this._rowIndex($row),
                row: $row
            };

            this._eachField(function(field) {
                if(!field.validate ||
                   ($row === this._insertRow && !field.inserting) ||
                   ($row === this._getEditRow() && !field.editing))
                    return;

                var fieldValue = this._getItemFieldValue(item, field);

                var errors = this._validation.validate($.extend({
                    value: fieldValue,
                    rules: field.validate
                }, args));

                this._setCellValidity($row.children().eq(this._visibleFieldIndex(field)), errors);

                if(!errors.length)
                    return;

                validationErrors.push.apply(validationErrors,
                    $.map(errors, function(message) {
                        return { field: field, message: message };
                    }));
            });

            if(!validationErrors.length)
                return true;

            var invalidArgs = $.extend({
                errors: validationErrors
            }, args);
            this._callEventHandler(this.onItemInvalid, invalidArgs);
            this.invalidNotify(invalidArgs);

            return false;
        },

        _setCellValidity: function($cell, errors) {
            $cell
                .toggleClass(this.invalidClass, !!errors.length)
                .attr("title", errors.join("\n"));
        },

        clearInsert: function() {
            var insertRow = this._createInsertRow();
            this._insertRow.replaceWith(insertRow);
            this._insertRow = insertRow;
            this.refresh();
        },

        editItem: function(item) {
            var $row = this.rowByItem(item);
            if($row.length) {
                this._editRow($row);
            }
        },

        rowByItem: function(item) {
            if(item.jquery || item.nodeType)
                return $(item);

            return this._content.find("tr").filter(function() {
                return $.data(this, JSGRID_ROW_DATA_KEY) === item;
            });
        },

        editPending: function () { 
            if (this._insertRow) {
                let item = this._getInsertItem();
                if (_.every(_.values(item), (v) => v == null)) return false;
            }
            return (this._insertRow || this._editingRow) ? true : false;
        },

        confirmPending: function () {
            if (this._editingRow) {
                if (this._getValidatedEditedItem())
                    this.updateItem();
                else
                    return false;
            }
            else {
                if (!$(this._container).find('.jsgrid-insert-mode-button')[0].classList.contains('jsgrid-mode-on-button')) return true;
                if (this._getValidatedInsertItem())
                    this.insertItem();
                else
                    return false;
            }
            return true;
        },

        _checkAutocommit() {
            if (this._editingRow) {
                if (!this.autocommit)
                    this.cancelEdit();
                else {
                    var $updatingRow = this._editingRow;
                    var editedItem = this._getValidatedEditedItem();

                    var updatingItem = $updatingRow.data(JSGRID_ROW_DATA_KEY),
                        updatingItemIndex = this._itemIndex(updatingItem),
                        updatedItem = $.extend(true, {}, updatingItem, editedItem);

                    if (updatingItem &&
                        JSON.stringify(updatingItem) !== JSON.stringify(updatedItem) &&
                        (!this.confirmAutocommit || (this.confirmAutocommit && window.confirm(this.autocommitConfirm))))
                        this.updateItem();
                    else
                        this.cancelEdit();
                }
            }
        },

        _editRow: function($row) {
            if(!this.editing)
                return;

            var item = $row.data(JSGRID_ROW_DATA_KEY);

            var args = this._callEventHandler(this.onItemEditing, {
                row: $row,
                item: item,
                itemIndex: this._itemIndex(item)
            });

            if(args.cancel)
                return;

            this._checkAutocommit();

            var $editRow = this._createEditRow(item);

            this._editingRow = $row;
            $row.hide();
            $editRow.insertBefore($row);
            $row.data(JSGRID_EDIT_ROW_DATA_KEY, $editRow);
        },

        _createEditRow: function(item) {
            if($.isFunction(this.editRowRenderer)) {
                return $(this.renderTemplate(this.editRowRenderer, this, { item: item, itemIndex: this._itemIndex(item) }));
            }

            var $result = $("<tr>").addClass(this.editRowClass);

            this._eachField(function(field) {
                var fieldValue = this._getItemFieldValue(item, field);

                this._prepareCell("<td>", field, "editcss")
                    .append(this.renderTemplate(field.editTemplate || "", field, { value: fieldValue, item: item }))
                    .appendTo($result);
            });

            return $result;
        },

        updateItem: function(item, editedItem) {
            if(arguments.length === 1) {
                editedItem = item;
            }

            var $row = item ? this.rowByItem(item) : this._editingRow;
            editedItem = editedItem || this._getValidatedEditedItem();

            if(!editedItem)
                return;

            return this._updateRow($row, editedItem);
        },

        _getValidatedEditedItem: function() {
            var item = this._getEditedItem();
            return this._validateItem(item, this._getEditRow()) ? item : null;
        },

        _updateRow: function($updatingRow, editedItem) {
            var updatingItem = $updatingRow.data(JSGRID_ROW_DATA_KEY),
                updatingItemIndex = this._itemIndex(updatingItem),
                updatedItem = $.extend(true, {}, updatingItem, editedItem);

            var args = this._callEventHandler(this.onItemUpdating, {
                row: $updatingRow,
                item: updatedItem,
                itemIndex: updatingItemIndex,
                previousItem: updatingItem
            });

            return this._controllerCall("updateItem", updatedItem, args.cancel, function(loadedUpdatedItem) {
                var previousItem = $.extend(true, {}, updatingItem);
                updatedItem = loadedUpdatedItem || $.extend(true, updatingItem, editedItem);

                var $updatedRow = this._finishUpdate($updatingRow, updatedItem, updatingItemIndex);

                this._callEventHandler(this.onItemUpdated, {
                    row: $updatedRow,
                    item: updatedItem,
                    itemIndex: updatingItemIndex,
                    previousItem: previousItem
                });
            });
        },

        _rowIndex: function(row) {
            return this._content.children().index($(row));
        },

        _itemIndex: function(item) {
            return $.inArray(item, this.data);
        },

        _finishUpdate: function($updatingRow, updatedItem, updatedItemIndex) {
            this.cancelEdit();
            this.data[updatedItemIndex] = updatedItem;

            var $updatedRow = this._createRow(updatedItem, updatedItemIndex);
            $updatingRow.replaceWith($updatedRow);
            return $updatedRow;
        },

        _getEditedItem: function() {
            var result = {};
            this._eachField(function(field) {
                if(field.editing) {
                    this._setItemFieldValue(result, field, field.editValue());
                }
            });
            return result;
        },

        cancelEdit: function() {
            if(!this._editingRow)
                return;

            var $row = this._editingRow,
                editingItem = $row.data(JSGRID_ROW_DATA_KEY),
                editingItemIndex = this._itemIndex(editingItem);

            this._callEventHandler(this.onItemEditCancelling, {
                row: $row,
                item: editingItem,
                itemIndex: editingItemIndex
            });

            this._getEditRow().remove();
            this._editingRow.show();
            this._editingRow = null;
        },

        cancelInsert: function () {
            this.option("inserting", false);
            let btn = $(this._container).find('.jsgrid-insert-mode-button');
            btn.toggleClass('jsgrid-mode-on-button', false);

            var $row = this._insertRow,
                editingItem = $row.data(JSGRID_ROW_DATA_KEY),
                editingItemIndex = this._itemIndex(editingItem);

            this._callEventHandler(this.onItemEditCancelling, {
                row: $row,
                item: editingItem,
                itemIndex: editingItemIndex
            });
        },

        _getEditRow: function() {
            return this._editingRow && this._editingRow.data(JSGRID_EDIT_ROW_DATA_KEY);
        },

        deleteItem: function(item, noninteractive) {
            var $row = this.rowByItem(item);

            if(!$row.length)
                return;            

            if((noninteractive === undefined || noninteractive == false) &&
            this.confirmDeleting && !window.confirm(getOrApply(this.deleteConfirm, this, $row.data(JSGRID_ROW_DATA_KEY))))
                return;

            return this._deleteRow($row);
        },

        _deleteRow: function($row) {
            var deletingItem = $row.data(JSGRID_ROW_DATA_KEY),
                deletingItemIndex = this._itemIndex(deletingItem);

            var args = this._callEventHandler(this.onItemDeleting, {
                row: $row,
                item: deletingItem,
                itemIndex: deletingItemIndex
            });

            return this._controllerCall("deleteItem", deletingItem, args.cancel, function() {
                this._loadStrategy.finishDelete(deletingItem, deletingItemIndex);

                this._callEventHandler(this.onItemDeleted, {
                    row: $row,
                    item: deletingItem,
                    itemIndex: deletingItemIndex
                });
            });
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
                } else {
                    instance._detachWindowResizeCallback();
                    instance._init(config);
                    instance.render();
                }
            } else {
                new Grid($element, config);
            }
        });

        return result;
    };

    var fields = {};

    var setDefaults = function(config) {
        var componentPrototype;

        if($.isPlainObject(config)) {
            componentPrototype = Grid.prototype;
        } else {
            componentPrototype = fields[config].prototype;
            config = arguments[1] || {};
        }

        $.extend(componentPrototype, config);
    };

    var locales = {};

    var locale = function(lang) {
        var localeConfig = $.isPlainObject(lang) ? lang : locales[lang];

        if(!localeConfig)
            throw Error("unknown locale " + lang);

        setLocale(jsGrid, localeConfig);
    };

    var setLocale = function(obj, localeConfig) {
        $.each(localeConfig, function(field, value) {
            if($.isPlainObject(value)) {
                setLocale(obj[field] || obj[field[0].toUpperCase() + field.slice(1)], value);
                return;
            }

            if(obj.hasOwnProperty(field)) {
                obj[field] = value;
            } else {
                obj.prototype[field] = value;
            }
        });
    };

    window.jsGrid = {
        Grid: Grid,
        fields: fields,
        setDefaults: setDefaults,
        locales: locales,
        locale: locale,
        version: "@VERSION"
    };

}(window, jQuery));
