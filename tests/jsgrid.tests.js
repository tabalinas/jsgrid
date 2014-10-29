$(function() {

    var Grid = jsGrid.Grid,

        JSGRID = "JSGrid",
        JSGRID_DATA_KEY = JSGRID;

    Grid.prototype.updateOnResize = false;

    module("basic");

    test("default creation", function() {
        var gridOptions = {
            simpleOption: "test",
            complexOption: {
                a: "subtest",
                b: 1,
                c: {}
            }
        },

        grid = new Grid("#jsGrid", gridOptions);

        equal(grid._container[0], $("#jsGrid")[0], "container saved");
        equal(grid.simpleOption, "test", "primitive option extended");
        notEqual(grid.complexOption, gridOptions.complexOption, "object option copied");
        deepEqual(grid.complexOption, gridOptions.complexOption, "object option copied right");
    });

    test("jquery adapter creation", function() {
        var gridOptions = {
            option: "test"
        },
            $element = $("#jsGrid"),
            result = $element.jsGrid(gridOptions),
            grid = $element.data(JSGRID_DATA_KEY);

        equal(result, $element, "jQuery fn returned source jQueryElement");
        ok(grid instanceof Grid, "jsGrid saved to jQuery data");
        equal(grid.option, "test", "options transfered");
    });

    test("destroy", function() {
        var $element = $("#jsGrid"),
            grid;

        $element.jsGrid({});
        grid = $element.data(JSGRID_DATA_KEY);
        
        grid.destroy();

        strictEqual($element.html(), "");
        strictEqual($element.data(JSGRID_DATA_KEY), undefined);
    });

    test("jquery adapter repeated call changes options", function() {
        var $element = $("#jsGrid"),
            gridOptions = {
                option: "test"
            },
            grid;

        $element.jsGrid(gridOptions);
        grid = $element.data(JSGRID_DATA_KEY);

        gridOptions.option = "new test";
        $element.jsGrid(gridOptions);

        equal(grid, $element.data(JSGRID_DATA_KEY), "instance was not changed");
        equal(grid.option, "new test", "option changed");
    });

    test("jquery adapter invoke method", function() {
        var methodResult = "",
            $element = $("#jsGrid"),
            gridOptions = {
                method: function(str) {
                    methodResult = "test_" + str;
                }
            };

        $element.jsGrid(gridOptions);
        $element.jsGrid("method", "invoke");

        equal(methodResult, "test_invoke", "method invoked");
    });

    test("option method", function() {
        var $element = $("#jsGrid"),
            gridOptions = {
                test: "value"
            },
            testOption;

        $element.jsGrid(gridOptions);

        testOption = $element.jsGrid("option", "test");
        equal(testOption, "value");

        $element.jsGrid("option", "test", "new_value");
        testOption = $element.jsGrid("option", "test");
        equal(testOption, "new_value");
    });

    test("option changing event handlers", function() {
        var $element = $("#jsGrid"),
            optionChangingEventArgs,
            optionChangedEventArgs,

            gridOptions = {
                test: "testValue",
                another: "anotherValue",
                onOptionChanging: function(e) {
                    optionChangingEventArgs = $.extend({}, e);

                    e.option = "another";
                    e.newValue = e.newValue + "_" + this.another;
                },
                onOptionChanged: function(e) {
                    optionChangedEventArgs = $.extend({}, e);
                }
            },
            anotherOption;

        $element.jsGrid(gridOptions);

        $element.jsGrid("option", "test", "newTestValue");
        equal(optionChangingEventArgs.option, "test");
        equal(optionChangingEventArgs.oldValue, "testValue");
        equal(optionChangingEventArgs.newValue, "newTestValue");

        anotherOption = $element.jsGrid("option", "another");
        equal(anotherOption, "newTestValue_anotherValue");

        equal(optionChangedEventArgs.option, "another");
        equal(optionChangedEventArgs.value, "newTestValue_anotherValue");
    });

    test("common layout rendering", function() {
        var $element = $("#jsGrid"),
            grid = new Grid($element, {}).render(),
            headerGrid,
            headerGridTable,
            bodyGrid,
            bodyGridTable;

        ok($element.hasClass(grid.containerClass));
        equal($element.children().length, 3);
        ok($element.children().eq(0).hasClass(grid.gridHeaderClass));
        ok($element.children().eq(1).hasClass(grid.gridBodyClass));
        ok($element.children().eq(2).hasClass(grid.pagerContainerClass));

        headerGrid = $element.children().eq(0);
        headerGridTable = headerGrid.children().first();
        ok(headerGridTable.hasClass(grid.tableClass));
        ok(headerGrid.find("." + grid.headerRowClass).length);
        ok(headerGrid.find("." + grid.filterRowClass).length);
        ok(headerGrid.find("." + grid.insertRowClass).length);
        ok(grid._headerRow.hasClass(grid.headerRowClass));
        ok(grid._filterRow.hasClass(grid.filterRowClass));
        ok(grid._insertRow.hasClass(grid.insertRowClass));

        bodyGrid = $element.children().eq(1);
        bodyGridTable = bodyGrid.children().first();
        ok(bodyGridTable.hasClass(grid.tableClass));
        equal(grid._content.parent()[0], bodyGridTable[0]);
        ok(bodyGridTable.find("." + grid.noDataRowClass).length);
        equal(bodyGridTable.text(), grid.noDataText);
    });


    module("loadingg");

    test("loading with controller", function() {
        var $element = $("#jsGrid"),
            data = [
                { test: "test1" },
                { test: "test2" }
            ],

            gridOptions = {
                controller: {
                    loadData: function() {
                        return data;
                    }
                }
            },

            grid = new Grid($element, gridOptions).render();

        grid.loadData();

        equal(grid.data, data);
    });

    test("autoload", function() {
        var $element = $("#jsGrid"),
            data = [
                { test: "test1" },
                { test: "test2" }
            ],
            gridOptions = {
                autoload: true,
                controller: {
                    loadData: function() {
                        return data;
                    }
                }
            },

            grid = new Grid($element, gridOptions).render();

        equal(grid.data, data);
    });

    test("loading filtered data", function() {
        var filteredData,
            loadingArgs,
            loadedArgs,
            $element = $("#jsGrid"),
            data = [
                { field: "test" },
                { field: "test_another" },
                { field: "test_another" },
                { field: "test" }
            ],

            gridOptions = {
                filtering: true,
                fields: [
                    {
                        name: "field",
                        filterValue: function(value) {
                            return "test";
                        }
                    }
                ],
                onDataLoading: function(e) {
                    loadingArgs = $.extend(true, {}, e);
                },
                onDataLoaded: function(e) {
                    loadedArgs = $.extend(true, {}, e);
                },
                controller: {
                    loadData: function(filter) {
                        filteredData = $.grep(data, function(item) {
                            return item.field === filter.field;
                        });
                        return filteredData;
                    }
                }
            },

            grid = new Grid($element, gridOptions).render();

        grid.loadData();

        equal(loadingArgs.filter.field, "test");
        equal(grid.data.length, 2, "data loaded with filter");
        deepEqual(loadedArgs.data, filteredData);
    });

    test("search", function() {
        var filteredData,
            $element = $("#jsGrid"),
            data = [
                { field: "test" },
                { field: "test_another" },
                { field: "test_another" },
                { field: "test" }
            ],

            gridOptions = {
                pageIndex: 2,
                _sortField: "field",
                _sortOrder: "desc",
                filtering: true,
                fields: [
                    {
                        name: "field",
                        filterValue: function(value) {
                            return "test";
                        }
                    }
                ],
                controller: {
                    loadData: function(filter) {
                        filteredData = $.grep(data, function(item) {
                            return item.field === filter.field;
                        });
                        return filteredData;
                    }
                }
            },

            grid = new Grid($element, gridOptions).render();

        grid.search();
        equal(grid.data.length, 2, "data filtered");
        strictEqual(grid.pageIndex, 1, "pageIndex reseted");
        strictEqual(grid._sortField, null, "sortField reseted");
        strictEqual(grid._sortOrder, "asc", "sortOrder reseted");
    });


    module("filtering");

    test("filter rendering", function() {
        var $element = $("#jsGrid"),
            gridOptions = {
                filtering: true,
                fields: [
                    {
                        name: "test",
                        filterTemplate: function() {
                            var result = this.filterControl = $("<input />").attr("type", "text").addClass("filter-input");
                            return result;
                        }
                    }
                ]
            },
            grid = new Grid($element, gridOptions).render();

        equal(grid._filterRow.find(".filter-input").length, 1, "filter control rendered");
        ok(grid.fields[0].filterControl.is("input[type=text]"), "filter control saved in field");
    });

    test("filter get/set/clear", function() {
        var $element = $("#jsGrid"),
            gridOptions = {
                filtering: true,
                fields: [
                    {
                        name: "field",
                        filterTemplate: function() {
                            var result = this.filterControl = $("<input />").attr("type", "text");
                            return result;
                        },
                        filterValue: function(value) {
                            if(!arguments.length) {
                                return this.filterControl.val();
                            }
                            this.filterControl.val(value);
                        }
                    }
                ]
            },
            grid = new Grid($element, gridOptions).render();

        grid.fields[0].filterControl.val("test");
        deepEqual(grid.getFilter(), { field: "test" }, "get filter");

        grid.setFilter({
            field: "new test",
            fieldAdditional: "additional test"
        });
        equal(grid.fields[0].filterControl.val(), "new test", "set filter");

        grid.clearFilter();
        deepEqual(grid.getFilter(), { field: "" }, "filter cleared");
        equal(grid.fields[0].filterControl.val(), "", "grid field filterControl cleared");
    });

    test("field without filtering", function() {
        var $element = $("#jsGrid"),
            jsGridFieldConfig = {
                filterTemplate: function() {
                    var result = this.filterControl = $("<input />").attr("type", "text");
                    return result;
                },
                filterValue: function(value) {
                    if(!arguments.length) {
                        return this.filterControl.val();
                    }
                    this.filterControl.val(value);
                }
            },

            gridOptions = {
                filtering: true,
                fields: [
                    $.extend({}, jsGridFieldConfig, {
                        name: "field1",
                        filtering: false
                    }),
                    $.extend({}, jsGridFieldConfig, {
                        name: "field2"
                    })
                ]
            },

            grid = new Grid($element, gridOptions).render();

        grid.fields[0].filterControl.val("test1");
        grid.fields[1].filterControl.val("test2");
        deepEqual(grid.getFilter(), { field2: "test2" });
    });


    module("nodatarow");

    test("nodatarow after bind on empty array", function() {
        var $element = $("#jsGrid"),
            gridOptions = {},
            grid = new Grid($element, gridOptions).render()
                .option("data", []);

        equal(grid._content.find("." + grid.noDataRowClass).length, 1);
        equal(grid._content.text(), grid.noDataText);
    });

    test("nodatarow customize content", function() {
        var noDataMessage = "NoData Custom Content",
            $element = $("#jsGrid"),
            gridOptions = {
                noDataContent: function() {
                    return noDataMessage;
                }
            },
            grid = new Grid($element, gridOptions).render()
                .option("data", []);

        equal(grid._content.text(), noDataMessage);
    });


    module("row rendering", {
        setup: function() {
            this.testData = [
                { id: 1, text: "test1" },
                { id: 2, text: "test2" },
                { id: 3, text: "test3" }
            ];
        }
    });

    test("rows rendered correctly", function() {
        var $element = $("#jsGrid"),
            gridOptions = {
                data: this.testData
            },
            grid = new Grid($element, gridOptions).render();

        equal(grid._content.children().length, 3);
        equal(grid._content.find("." + grid.oddRowClass).length, 2);
        equal(grid._content.find("." + grid.evenRowClass).length, 1);
    });

    test("custom rowClass callback", function() {
        var $element = $("#jsGrid"),
            gridOptions = {
                data: this.testData,
                rowClass: function(item, index) {
                    return item.text;
                }
            },
            grid = new Grid($element, gridOptions).render();

        equal(grid._content.find("." + grid.oddRowClass).length, 2);
        equal(grid._content.find("." + grid.evenRowClass).length, 1);
        equal(grid._content.find(".test1").length, 1);
        equal(grid._content.find(".test2").length, 1);
        equal(grid._content.find(".test3").length, 1);
    });

    test("rowClick standard handler", function() {
        var $element = $("#jsGrid"),
            $secondRow,
            grid = new Grid($element, { editing: true }).render()
                .option("data", this.testData);

        $secondRow = grid._content.find("." + grid.evenRowClass);
        $secondRow.trigger("click." + JSGRID, $.Event($secondRow));

        equal(grid._editingRow.get(0), $secondRow.get(0), "clicked row is editingRow");
    });

    test("rowClick handler", function() {
        var rowClickArgs,
            $element = $("#jsGrid"),
            $secondRow,
            gridOptions = {
                rowClick: function() {
                    rowClickArgs = arguments;
                }
            },
            grid = new Grid($element, gridOptions).render()
                .option("data", this.testData);

        $secondRow = grid._content.find("." + grid.evenRowClass);
        $secondRow.trigger("click." + JSGRID, $.Event($secondRow));

        ok(rowClickArgs[0] instanceof jQuery.Event, "jQuery event arg");
        equal(rowClickArgs[1], this.testData[1], "item arg");
        equal(rowClickArgs[2], 1, "itemIndex arg");
    });

    test("row selecting with selectedRowClass", function() {
        var $element = $("#jsGrid"),
            $secondRow,
            gridOptions = {
                selecting: true
            },
            grid = new Grid($element, gridOptions).render()
                .option("data", this.testData);

        $secondRow = grid._content.find("." + grid.evenRowClass);

        $secondRow.trigger("mouseover." + JSGRID, $.Event($secondRow));
        ok($secondRow.hasClass(grid.selectedRowClass), "mouseover adds selectedRowClass");

        $secondRow.trigger("mouseout." + JSGRID, $.Event($secondRow));
        ok(!$secondRow.hasClass(grid.selectedRowClass), "mouseout removes selectedRowClass");
    });

    test("no row selecting while selection is disabled", function() {
        var $element = $("#jsGrid"),
            $secondRow,
            gridOptions = {
                selecting: false
            },
            grid = new Grid($element, gridOptions).render()
                .option("data", this.testData);

        $secondRow = grid._content.find("." + grid.evenRowClass);
        $secondRow.trigger("mouseover." + JSGRID, $.Event($secondRow));
        ok(!$secondRow.hasClass(grid.selectedRowClass), "mouseover doesn't add selectedRowClass");
    });

    test("refreshing and refreshed callbacks", function() {
        var refreshingEventArgs,
            refreshedEventArgs,
            $element = $("#jsGrid"),
            grid = new Grid($element, {}).render();

        grid.onRefreshing = function(e) {
            refreshingEventArgs = e;
            equal(grid._content.find("." + grid.oddRowClass).length, 0);
        };

        grid.onRefreshed = function(e) {
            refreshedEventArgs = e;
            equal(grid._content.find("." + grid.oddRowClass).length, 2);
        };

        grid.option("data", this.testData);

        equal(refreshingEventArgs.grid, grid);
        equal(refreshedEventArgs.grid, grid);
        equal(grid._content.find("." + grid.oddRowClass).length, 2);
    });

    test("grid fields normalization", function() {
        var $element = $("#jsGrid"),
            field1,
            field2,
            gridOptions = {
                fields: [
                    new jsGrid.Field("text1", {
                        title: "title1"
                    }),
                    {
                        name: "text2",
                        title: "title2"
                    }
                ]
            },
            grid = new Grid($element, gridOptions).render();

        field1 = grid.fields[0];
        ok(field1 instanceof jsGrid.Field);
        equal(field1.name, "text1");
        equal(field1.title, "title1");

        field2 = grid.fields[1];
        ok(field2 instanceof jsGrid.Field);
        equal(field2.name, "text2");
        equal(field2.title, "title2");
    });

    test("grid fields header and item rendering", function() {
        var $element = $("#jsGrid"),
            $secondRow,
            gridOptions = {
                fields: [
                    new jsGrid.Field("text", {
                        title: "title",
                        css: "cell-class",
                        align: "center"
                    })
                ]
            },
            grid = new Grid($element, gridOptions).render()
                .option("data", this.testData);

        equal(grid._headerRow.text(), "title", "header rendered");
        $secondRow = grid._content.find("." + grid.evenRowClass);
        equal($secondRow.text(), "test2", "item rendered");
        equal($secondRow.find(".cell-class").length, 1, "css class added to cell");
        ok($secondRow.find(".cell-class").hasClass("jsgrid-align-center"), "align class added to cell");
    });


    module("inserting");

    test("inserting rendering", function() {
        var $element = $("#jsGrid"),
            gridOptions = {
                inserting: true,
                fields: [
                    {
                        name: "test",
                        insertTemplate: function() {
                            var result = this.insertControl = $("<input />").attr("type", "text").addClass("insert-input");
                            return result;
                        }
                    }
                ]
            },
            grid = new Grid($element, gridOptions).render();

        equal(grid._insertRow.find(".insert-input").length, 1, "insert control rendered");
        ok(grid.fields[0].insertControl.is("input[type=text]"), "insert control saved in field");
    });

    test("field without inserting", function() {
        var $element = $("#jsGrid"),
            jsGridFieldConfig = {
                insertTemplate: function() {
                    var result = this.insertControl = $("<input />").attr("type", "text");
                    return result;
                },
                insertValue: function() {
                    return this.insertControl.val();
                }
            },

            gridOptions = {
                inserting: true,
                fields: [
                    $.extend({}, jsGridFieldConfig, {
                        name: "field1",
                        inserting: false
                    }),
                    $.extend({}, jsGridFieldConfig, {
                        name: "field2"
                    })
                ]
            },

            grid = new Grid($element, gridOptions).render();

        grid.fields[0].insertControl.val("test1");
        grid.fields[1].insertControl.val("test2");
        deepEqual(grid._getInsertItem(), { field2: "test2" });
    });

    test("insert data", function() {
        var $element = $("#jsGrid"),

            inserted = false,
            insertingArgs,
            insertedArgs,

            gridOptions = {
                inserting: true,
                data: [],
                fields: [
                    {
                        name: "field",
                        insertTemplate: function() {
                            var result = this.insertControl = $("<input />").attr("type", "text");
                            return result;
                        },
                        insertValue: function() {
                            return this.insertControl.val();
                        }
                    }
                ],
                onItemInserting: function(e) {
                    insertingArgs = $.extend(true, {}, e);
                },
                onItemInserted: function(e) {
                    insertedArgs = $.extend(true, {}, e);
                },
                controller: {
                    insertItem: function() {
                        inserted = true;
                    }
                }
            },

            grid = new Grid($element, gridOptions).render();

        grid.fields[0].insertControl.val("test");
        grid.insertItem();

        equal(insertingArgs.item.field, "test");
        equal(grid.data.length, 1, "data inserted");
        ok(inserted, "controller insertItem called");
        deepEqual(grid.data[0], { field: "test" }, "right data inserted");
        equal(insertedArgs.item.field, "test");
    });


    module("editing");

    test("editing rendering", function() {
        var $element = $("#jsGrid"),
            $editRow,
            data = [{
                test: "value"
            }],

            gridOptions = {
                editing: true,
                fields: [
                    {
                        name: "test",
                        editTemplate: function(value) {
                            var result = this.editControl = $("<input />").attr("type", "text").val(value).addClass("edit-input");
                            return result;
                        }
                    }
                ]
            },

            grid = new Grid($element, gridOptions).render()
                .option("data", data);

        equal(grid._content.find("." + grid.editRowClass).length, 0, "no edit row after initial rendering");

        grid.editItem(data[0]);

        $editRow = grid._content.find("." + grid.editRowClass);
        equal($editRow.length, 1, "edit row rendered");
        equal($editRow.find(".edit-input").length, 1, "edit control rendered");

        ok(grid.fields[0].editControl.is("input[type=text]"), "edit control saved in field");
        equal(grid.fields[0].editControl.val(), "value", "edit control value");
    });

    test("edit item", function() {
        var $element = $("#jsGrid"),
            updated = false,
            updatingArgs,
            updatedArgs,
            data = [{
                field: "value"
            }],

            gridOptions = {
                editing: true,
                fields: [
                    {
                        name: "field",
                        editTemplate: function(value) {
                            var result = this.editControl = $("<input />").attr("type", "text").val(value);
                            return result;
                        },
                        editValue: function() {
                            return this.editControl.val();
                        }
                    }
                ],
                controller: {
                    updateItem: function(updatingItem) {
                        updated = true;
                    }
                },
                onItemUpdating: function(e) {
                    updatingArgs = $.extend(true, {}, e);
                },
                onItemUpdated: function(e) {
                    updatedArgs = $.extend(true, {}, e);
                }
            },

            grid = new Grid($element, gridOptions).render()
                .option("data", data);

        grid.editItem(data[0]);
        grid.fields[0].editControl.val("new value");
        grid.updateItem();

        deepEqual(updatingArgs.item, { field: "new value" });
        equal(updatingArgs.itemIndex, 0);
        equal(updatingArgs.row.length, 1);
        ok(updated, "controller updateItem called");
        deepEqual(grid.data[0], { field: "new value" }, "right data updated");
        equal(grid._content.find("." + grid.editRowClass).length, 0, "edit row removed");
        equal(grid._content.find("." + grid.oddRowClass).length, 1, "data row rendered");
        deepEqual(updatedArgs.item, { field: "new value" });
        equal(updatedArgs.itemIndex, 0);
        equal(updatedArgs.row.length, 1);
    });

    test("cancel edit", function() {
        var $element = $("#jsGrid"),
            updated = false,
            data = [{
                field: "value"
            }],

            gridOptions = {
                editing: true,
                fields: [
                    {
                        name: "field",
                        editTemplate: function(value) {
                            var result = this.editControl = $("<input />").attr("type", "text").val(value);
                            return result;
                        },
                        editValue: function() {
                            return this.editControl.val();
                        }
                    }
                ],
                controller: {
                    updateData: function(updatingItem) {
                        updated = true;
                    }
                }
            },

            grid = new Grid($element, gridOptions).render()
                .option("data", data);

        grid.editItem(data[0]);
        grid.fields[0].editControl.val("new value");
        grid.cancelEdit();

        ok(!updated, "controller updateItem was not called");
        deepEqual(grid.data[0], { field: "value" }, "data were not updated");
        equal(grid._content.find("." + grid.editRowClass).length, 0, "edit row removed");
        equal(grid._content.find("." + grid.oddRowClass).length, 1, "data row restored");
    });


    module("deleting");

    test("delete item", function() {
        var $element = $("#jsGrid"),
            deleted = false,
            deletingArgs,
            deletedArgs,
            data = [{
                field: "value"
            }],

            gridOptions = {
                confirmDeleting: false,
                fields: [
                    { name: "field" }
                ],
                controller: {
                    deleteItem: function(deletingItem) {
                        deleted = true;
                    }
                },
                onItemDeleting: function(e) {
                    deletingArgs = $.extend(true, {}, e);
                },
                onItemDeleted: function(e) {
                    deletedArgs = $.extend(true, {}, e);
                }
            },

            grid = new Grid($element, gridOptions).render()
                .option("data", data);

        grid.deleteItem(data[0]);

        deepEqual(deletingArgs.item, { field: "value" });
        equal(deletingArgs.itemIndex, 0);
        equal(deletingArgs.row.length, 1);
        ok(deleted, "controller deleteItem called");
        equal(grid.data.length, 0, "data row deleted");
        deepEqual(deletedArgs.item, { field: "value" });
        equal(deletedArgs.itemIndex, 0);
        equal(deletedArgs.row.length, 1);
    });


    module("paging");

    test("pager is rendered if necessary", function() {
        var $element = $("#jsGrid"),

            grid = new Grid($element, {
                data: [{}, {}, {}],
                paging: false,
                pageSize: 2
            }).render();

        ok(!grid._pagerContainer.is(":visible"));
        ok(!grid._pagerContainer.html());

        grid.paging = true;
        grid.refresh();
        ok(grid._pagerContainer.is(":visible"));
        ok(grid._pagerContainer.html());

        grid.option("data", [{}, {}]);
        ok(!grid._pagerContainer.is(":visible"));
        ok(!grid._pagerContainer.html());
    });

    test("external pagerContainer", function() {
        var $pagerContainer = $("<div />").appendTo("#qunit-fixture").hide(),
            $element = $("#jsGrid");

        new Grid($element, {
            data: [{}, {}, {}],
            pagerContainer: $pagerContainer,
            paging: true,
            pageSize: 2
        }).render();

        ok($pagerContainer.is(":visible"));
        ok($pagerContainer.html());
    });

    test("pager rendered and works correctly", function() {
        var $element = $("#jsGrid"),
            pager,
            grid = new Grid($element, {
                data: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
                paging: true,
                pageSize: 2,
                pageButtonCount: 3
            }).render();

        equal(grid._pagesCount(), 5, "right page count");
        equal(grid.pageIndex, 1, "pageIndex initialized");
        equal(grid._firstDisplayingPage, 1, "_firstDisplayingPage initialized");

        pager = grid._pagerContainer;
        equal(pager.find("." + grid.currentPageClass).length, 1, "there is one current page");
        ok(pager.find("." + grid.pageClass).eq(0).hasClass(grid.currentPageClass), "first page is current");
        equal(pager.find("." + grid.pageClass).length, 3, "three pages displayed");
        equal(pager.find("." + grid.pagerNavButtonClass).length, 3, "three nav buttons displayed: Next Last and ...");

        grid.openPage(2);
        equal(pager.find("." + grid.currentPageClass).length, 1, "there is one current page");
        ok(pager.find("." + grid.pageClass).eq(1).hasClass(grid.currentPageClass), "second page is current");
        equal(pager.find("." + grid.pageClass).length, 3, "three pages displayed");
        equal(pager.find("." + grid.pagerNavButtonClass).length, 5, "five nav buttons displayed: First Prev Next Last and ...");

        grid.showNextPages();
        equal(grid._firstDisplayingPage, 3, "navigative by pages forward");

        grid.showPrevPages();
        equal(grid._firstDisplayingPage, 1, "navigative by pages backward");

        grid.openPage(5);
        equal(grid._firstDisplayingPage, 3, "opening not visible next page moves first displaying page forward");

        grid.openPage(2);
        equal(grid._firstDisplayingPage, 2, "opening not visible prev page moves first displaying page backward");
    });

    test("loading by page", function() {
        var $element = $("#jsGrid"),
            data = [],
            itemCount = 20,
            gridOptions,
            grid,
            pager,
            i;

        for(i = 1; i <= itemCount; i += 1) {
            data.push({
                value: i
            });
        }

        gridOptions = {
            pageLoading: true,
            paging: true,
            pageSize: 7,
            fields: [
                { name: "value" }
            ],
            controller: {
                loadData: function(filter) {
                    var startIndex = (filter.pageIndex - 1) * filter.pageSize,
                        result = data.slice(startIndex, startIndex + filter.pageSize);
                    return {
                        data: result,
                        itemsCount: data.length
                    };
                }
            }
        };

        grid = new Grid($element, gridOptions).render();

        grid.loadData();

        pager = grid._pagerContainer;

        equal(grid.data.length, 7, "loaded one page of data");
        equal(grid.data[0].value, 1, "loaded right data start value");
        equal(grid.data[grid.data.length - 1].value, 7, "loaded right data end value");
        ok(pager.find("." + grid.pageClass).eq(0).hasClass(grid.currentPageClass), "first page is current");
        equal(pager.find("." + grid.pageClass).length, 3, "three pages displayed");

        grid.openPage(3);
        equal(grid.data.length, 6, "loaded last page of data");
        equal(grid.data[0].value, 15, "loaded right data start value");
        equal(grid.data[grid.data.length - 1].value, 20, "loaded right data end value");
        ok(pager.find("." + grid.pageClass).eq(2).hasClass(grid.currentPageClass), "third page is current");
        equal(pager.find("." + grid.pageClass).length, 3, "three pages displayed");
    });


    module("sorting");

    test("sorting", function() {
        var $element = $("#jsGrid"),
            th,

            gridOptions = {
                sorting: true,
                data: [
                    { value: 3 },
                    { value: 2 },
                    { value: 1 }
                ],
                fields: [
                    { name: "value", sorter: "Number" }
                ]
            },
            grid = new Grid($element, gridOptions).render();

        th = grid._headerRow.find("th").eq(0);
        th.trigger("click");
        
        equal(grid._sortOrder, "asc");
        equal(grid._sortField, grid.fields[0]);
        equal(grid.data[0].value, 1);
        equal(grid.data[1].value, 2);
        equal(grid.data[2].value, 3);
        ok(th.hasClass(grid.sortableClass));
        ok(th.hasClass(grid.sortAscClass));

        th.trigger("click");

        equal(grid._sortOrder, "desc");
        equal(grid._sortField, grid.fields[0]);
        equal(grid.data[0].value, 3);
        equal(grid.data[1].value, 2);
        equal(grid.data[2].value, 1);

        ok(!th.hasClass(grid.sortAscClass));
        ok(th.hasClass(grid.sortDescClass));
    });

    test("sorting with pageLoading", function() {
        var $element = $("#jsGrid"),
            loadFilter,
            th,

            gridOptions = {
                sorting: true,
                pageLoading: true,
                data: [
                    { value: 3 },
                    { value: 2 },
                    { value: 1 }
                ],
                controller: {
                    loadData: function(filter) {
                        loadFilter = filter;
                        return {
                            itemsCount: 0,
                            data: []
                        };
                    }
                },
                fields: [
                    { name: "value", sorter: "Number" }
                ]
            },

            grid = new Grid($element, gridOptions).render();

        th = grid._headerRow.find("th").eq(0);
        th.trigger("click");

        equal(grid._sortOrder, "asc");
        equal(grid._sortField, grid.fields[0]);
        equal(loadFilter.sortOrder, "asc");
        equal(loadFilter.sortField, "value");

        th.trigger("click");

        equal(grid._sortOrder, "desc");
        equal(grid._sortField, grid.fields[0]);
        equal(loadFilter.sortOrder, "desc");
        equal(loadFilter.sortField, "value");
    });

    test("no sorting for column with sorting = false", function() {
        var $element = $("#jsGrid"),
            th,

            gridOptions = {
                sorting: true,
                data: [
                    { value: 3 },
                    { value: 2 },
                    { value: 1 }
                ],
                fields: [
                    { name: "value", sorting: false }
                ]
            },

            grid = new Grid($element, gridOptions).render();

        th = grid._headerRow.find("th").eq(0);
        th.trigger("click");

        equal(grid._sortField, null);
        equal(grid.data[0].value, 3);
        equal(grid.data[1].value, 2);
        equal(grid.data[2].value, 1);
        ok(!th.hasClass(grid.sortAscClass));
    });
});
