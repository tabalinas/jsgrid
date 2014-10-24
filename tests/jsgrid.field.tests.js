$(function() {

    var Grid = jsGrid.Grid;
    
    module("jsGrid.field");

    test("basic", function() {
        var testTd = $("<td />"),
            customSortingFunc = function() {
                return 1;
            },
            field = new jsGrid.Field("testField", {
                title: "testTitle",
                sorter: customSortingFunc
            });

        equal(field.headerTemplate(), "testTitle");
        equal(field.itemTemplate("testValue"), "testValue");
        equal(field.cellTemplate(testTd), testTd);
        equal(field.filterTemplate(), "");
        equal(field.insertTemplate(), "");
        equal(field.editTemplate("testValue"), "testValue");
        strictEqual(field.filterValue(), "");
        strictEqual(field.insertValue(), "");
        strictEqual(field.editValue(), "");
        strictEqual(field.sortingFunc, customSortingFunc);
    });


    module("jsGrid.field.text");

    test("basic", function() {
        var field = new jsGrid.TextField("testField");

        equal(field.itemTemplate("testValue"), "testValue");
        equal(field.filterTemplate()[0].tagName.toLowerCase(), "input");
        equal(field.insertTemplate()[0].tagName.toLowerCase(), "input");
        equal(field.editTemplate("testEditValue")[0].tagName.toLowerCase(), "input");
        field.filterValue("testFilterValue");
        strictEqual(field.filterValue(), "testFilterValue");
        strictEqual(field.insertValue(), "");
        strictEqual(field.editValue(), "testEditValue");
    });
    

    module("jsGrid.field.textArea");

    test("basic", function() {
        var field = new jsGrid.TextAreaField("testField");

        equal(field.itemTemplate("testValue"), "testValue");
        equal(field.filterTemplate()[0].tagName.toLowerCase(), "input");
        equal(field.insertTemplate()[0].tagName.toLowerCase(), "textarea");
        equal(field.editTemplate("testEditValue")[0].tagName.toLowerCase(), "textarea");
        strictEqual(field.insertValue(), "");
        strictEqual(field.editValue(), "testEditValue");
    });


    module("jsGrid.field.checkbox");

    test("basic", function() {
        var field = new jsGrid.CheckboxField("testField"),
            itemTemplate,
            filterTemplate,
            insertTemplate,
            editTemplate;

        itemTemplate = field.itemTemplate("testValue");

        equal(itemTemplate[0].tagName.toLowerCase(), "input");
        equal(itemTemplate.attr("type"), "checkbox");
        equal(itemTemplate.attr("disabled"), "disabled");

        filterTemplate = field.filterTemplate();
        equal(filterTemplate[0].tagName.toLowerCase(), "input");
        equal(filterTemplate.attr("type"), "checkbox");

        insertTemplate = field.insertTemplate();
        equal(insertTemplate[0].tagName.toLowerCase(), "input");
        equal(insertTemplate.attr("type"), "checkbox");

        editTemplate = field.editTemplate(true);
        equal(editTemplate[0].tagName.toLowerCase(), "input");
        equal(editTemplate.attr("type"), "checkbox");
        equal(editTemplate.is(":checked"), true);

        strictEqual(field.filterValue(), false);
        field.filterValue(true);
        strictEqual(field.filterValue(), true);
        strictEqual(field.insertValue(), false);
        strictEqual(field.editValue(), true);
    });


    module("jsGrid.field.select");

    test("basic", function() {
        var field,
            filterTemplate,
            insertTemplate,
            editTemplate;

        field = new jsGrid.SelectField("testField", {
            items: ["test1", "test2", "test3"],
            selectedIndex: 1
        });

        equal(field.itemTemplate(1), "test2");

        filterTemplate = field.filterTemplate();
        equal(filterTemplate[0].tagName.toLowerCase(), "select");
        equal(filterTemplate.children().length, 3);

        insertTemplate = field.insertTemplate();
        equal(insertTemplate[0].tagName.toLowerCase(), "select");
        equal(insertTemplate.children().length, 3);

        editTemplate = field.editTemplate(2);
        equal(editTemplate[0].tagName.toLowerCase(), "select");
        equal(editTemplate.find("option:selected").length, 1);
        ok(editTemplate.children().eq(2).is(":selected"));

        strictEqual(field.filterValue(), "1");
        strictEqual(field.insertValue(), "1");
        strictEqual(field.editValue(), "2");
    });

    test("items as objects array", function() {
        var field = new jsGrid.SelectField("testField", {
            items: [
                {
                    text: "test1",
                    value: "1"
                },
                {
                    text: "test2",
                    value: "2"
                },
                {
                    text: "test3",
                    value: "3"
                }
            ]
        });
        
        strictEqual(field.itemTemplate(1), field.items[1]);

        field.textField = "text";
        strictEqual(field.itemTemplate(1), "test2");

        field.textField = "";
        field.valueField = "value";
        strictEqual(field.itemTemplate("1"), field.items[0]);

        field.textField = "text";
        strictEqual(field.itemTemplate("1"), "test1");
    });

    
    module("jsGrid.field.control");

    test("basic", function() {
        var field,
            itemTemplate,
            headerTemplate,
            filterTemplate,
            insertTemplate,
            editTemplate;

        field = new jsGrid.ControlField("testField");
        field._grid = {};

        itemTemplate = field.itemTemplate("any_value");
        equal(itemTemplate.filter("." + field.editButtonClass).length, 1);
        equal(itemTemplate.filter("." + field.deleteButtonClass).length, 1);

        headerTemplate = field.headerTemplate();
        equal(headerTemplate.filter("." + field.searchModeButtonClass).length, 1);
        equal(headerTemplate.filter("." + field.insertModeButtonClass).length, 1);

        filterTemplate = field.filterTemplate();
        equal(filterTemplate.filter("." + field.searchButtonClass).length, 1);
        equal(filterTemplate.filter("." + field.clearFilterButtonClass).length, 1);

        insertTemplate = field.insertTemplate();
        equal(insertTemplate.filter("." + field.insertButtonClass).length, 1);

        editTemplate = field.editTemplate("any_value");
        equal(editTemplate.filter("." + field.updateButtonClass).length, 1);
        equal(editTemplate.filter("." + field.cancelEditButtonClass).length, 1);

        strictEqual(field.filterValue(), "");
        strictEqual(field.insertValue(), "");
        strictEqual(field.editValue(), "");
    });
});
