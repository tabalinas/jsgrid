# jsGrid Lightweight Grid jQuery Plugin

**jsGrid** is a lightweight client-side data grid control based on jQuery.
It supports basic grid operations like inserting, filtering, editing, deleting, paging and sorting.
Although jsGrid is tunable and allows to customize appearance and components.

![jsGrid lightweight client-side data grid](http://content.screencast.com/users/tabalinas/folders/Jing/media/beada891-57fc-41f3-ad77-fbacecd01d15/00000002.png)


## Requirement

jQuery (1.8.3 or later)


## Demo

[Demos](http://www.googledrive.com/host/0BwcJihi374AsdnhNeFk5bm1NaDA/demos/index.html)
temporary hosted on GoogleDrive (demos using external rest api don't work)


## Compatibility

**Desktop**

* Chrome
* Safari
* Firefox
* Opera 15+
* IE 8+

**Mobile**

* Safari for iOS
* Chrome for Android
* IE10 for WP8


## Basic Usage

Ensure that jQuery library of version 1.8.3 or later is included.

Include `jsgrid.min.js` and `jsgrid.min.css` files into the web page.

Create grid applying jQuery plugin `jsGrid` with grid config as follows:

````javascript

$("#jsGrid").jsGrid({
    width: "100%",
    height: "400px",

    filtering: true,
    editing: true,
    sorting: true,
    paging: true,

    data: db.clients,

    fields: [
        { name: "Name", type: "text", width: 150 },
        { name: "Age", type: "number", width: 50 },
        { name: "Address", type: "text", width: 200 },
        { name: "Country", type: "select", items: db.countries, valueField: "Id", textField: "Name" },
        { name: "Married", type: "checkbox", title: "Is Married", sorting: false },
        { type: "control" }
    ]
});

````


## Configuration

The config object may contain following options (default values are specified below):

````javascript

{
    fields: [],
    data: [],

    autoload: false,
    controller: {
        loadData: $.noop,
        insertItem: $.noop,
        updateItem: $.noop,
        deleteItem: $.noop
    },

    width: "auto",
    height: "auto",

    heading: true,
    filtering: false,
    inserting: false,
    editing: false,
    selecting: true,
    sorting: false,
    paging: false,
    pageLoading: false,

    rowClass: function(item, itemIndex) { ... },
    rowClick: function(args) { ... },

    noDataText: "Not found",

    confirmDeleting: true,
    deleteConfirm: "Are you sure?",

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

    loadIndication: true,
    loadIndicationDelay: 500,
    loadMessage: "Please, wait...",
    loadShading: true,

    updateOnResize: true,

    rowRenderer: null,
    headerRowRenderer: null,
    filterRowRenderer: null,
    insertRowRenderer: null,
    editRowRenderer: null,
    noDataRenderer: null
}

````

### fields
An array of fields (columns) of the grid.

Each field has general options and specific options depending on field type.

General options peculiar to all field types:

````javascript

{
    type: "",
    name: "",
    title: "",
    css: "",
    align: "",
    width: 100,

    filtering: true,
    inserting: true,
    editing: true,
    sorting: true,
    sorter: "string",

    headerTemplate: function() { ... },
    itemTemplate: function(value, item) { ... },
    filterTemplate: function() { ... },
    insertTemplate: function() { ... },
    editTemplate: function(value, item) { ... },

    filterValue: function() { ... },
    insertValue: function() { ... },
    editValue: function() { ... }
}

````

- **type** is a string key of field (`"text"|"number"|"checkbox"|"select"|"textarea"|"control"`) in fields registry `jsGrid.fields` (the registry can be easily extended with custom field types).
- **name** is a property of data item associated with the column.
- **title** is a text to be displayed in the header of the column. If `title` is not specified, the `name` will be used instead.
- **css** is a string representing css classes to be attached to the table cell.
- **align** is alignment of text in the cell. Accepts following values `"left"|"center"|"right"`.
- **width** is a width of the column.
- **filtering** is a boolean specifying whether or not column has filtering (`filterTemplate()` is rendered and `filterValue()` is included in load filter object).
- **inserting** is a boolean specifying whether or not column has inserting (`insertTemplate()` is rendered and `insertValue()` is included in inserting item).
- **editing** is a boolean specifying whether or not column has editing (`editTemplate()` is rendered and `editValue()` is included in editing item).
- **sorting** is a boolean specifying whether or not column has sorting ability.
- **sorter** is a string or a function specifying how to sort item by the field. The string is a key of sorting strategy in the registry `jsGrid.sortStrategies` (the registry can be easily extended with custom sorting functions). Sorting function has the signature `function(value1, value2) { return -1|0|1; }`.
- **headerTemplate** is a function to create column header content. It should return markup as string, DomNode or jQueryElement.
- **itemTemplate** is a function to create cell content. It should return markup as string, DomNode or jQueryElement. The function signature is `function(value, item)`, where `value` is a value of column property of data item, and `item` is a row data item.
- **filterTemplate** is a function to create filter row cell content. It should return markup as string, DomNode or jQueryElement.
- **insertTemplate** is a function to create insert row cell content. It should return markup as string, DomNode or jQueryElement.
- **editTemplate** is a function to create cell content of editing row. It should return markup as string, DomNode or jQueryElement. The function signature is `function(value, item)`, where `value` is a value of column property of data item, and `item` is a row data item.
- **filterValue** is a function returning the value of filter property associated with the column.
- **insertValue** is a function returning the value of inserting item property associated with the column.
- **editValue** is a function returning the value of editing item property associated with the column.

Specific field options depends on concrete field type.
Read about build-in fields in **Fields** section.

### data
An array of items to be displayed in the grid. The option should be used to provide static data. Use the `controller` option to provide non static data.

### autoload (default `false`)
A boolean value specifying whether `controller.loadData` will be called when grid is rendered.

### controller
An object or function returning an object with the following structure:

````javascript

{
    loadData: $.noop,
    insertItem: $.noop,
    updateItem: $.noop,
    deleteItem: $.noop
}

````

- **loadData** is a function returning an array of data or jQuery promise that will be resolved with an array of data (when `pageLoading` is `true` instead of object the structure `{ data: [items], itemsCount: [total items count] }` should be returned). Accepts filter parameter including current filter options and paging parameters when `pageLoading` is `true`.
- **insertItem** is a function returning inserted item or jQuery promise that will be resolved with inserted item. Accepts inserting item object.
- **updateItem** is a function returning updated item or jQuery promise that will be resolved with updated item. Accepts updating item object.
- **deleteItem** is a function deleting item. Returns jQuery promise that will be resolved when deletion is completed. Accepts deleting item object.

Read more about controller interface in **Controller** section.

### width (default: `"auto"`)
Specifies the overall width of the grid.
Accepts all value types accepting by `jQuery.width`.

### height (default: `"auto"`)
Specifies the overall height of the grid including the pager.
Accepts all value types accepting by `jQuery.height`.

### heading (default: `true`)
A boolean value specifies whether to show grid header or not.

### filtering (default: `false`)
A boolean value specifies whether to show filter row or not.

### inserting (default: `false`)
A boolean value specifies whether to show inserting row or not.

### editing (default: `false`)
A boolean value specifies whether editing is allowed.

### selecting (default: `true`)
A boolean value specifies whether to highlight grid rows on hover.

### sorting (default: `false`)
A boolean value specifies whether sorting is allowed.

### paging (default: `false`)
A boolean value specifies whether data is displayed by pages.

### pageLoading (default: `false`)
A boolean value specifies whether to load data by page.
When `pageLoading` is `true` the `loadData` method of controller accepts `filter` parameter with two additional properties `pageSize` and `pageIndex`.

### rowClass
A string or a function specifying row css classes.
A string contains classes separated with spaces.
A function has signature `function(item, itemIndex)`. It accepts the data item and index of the item. It should returns a string containing classes separated with spaces.

### rowClick
A function handling row click. Accepts single argument with following structure:

````javascript

{
     item       // data item
     itemIndex  // data item index
     event      // jQuery event
}

````

By default `rowClick` performs row editing when `editing` is `true`.

### noDataText (default `"Not found"`)
A string specifying the text to be displayed when no data specified.

### confirmDeleting (default `true`)
A boolean value specifying whether to ask user to confirm item deletion.

### deleteConfirm (default `"Are you sure?"`)
A string or a function returning string specifying delete confirmation message to be displayed to the user.
A function has the signature `function(item)` and accepts item to be deleted.

### pagerContainer (default `null`)
A jQueryElement or DomNode to specify where to render a pager. Used for external pager rendering. When it is equal to `null`, the pager is rendered at the bottom of the grid.

### pageIndex (default `1`)
An integer value specifying current page index. Applied only when `paging` is `true`.

### pageSize (default `20`)
An integer value specifying the amount of items on the page. Applied only when `paging` is `true`.

### pageButtonCount (default `15`)
An integer value specifying the maximum amount of page buttons to be displayed in the pager.

### pagerFormat
A string specifying pager format.
The default value is  `"Pages: {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} of {pageCount}"`

There are placeholders that can be used in the format:

````javascript

{first}     // link to first page
{prev}      // link to previous page
{pages}     // page links
{next}      // link to next page
{last}      // link to last page
{pageIndex} // current page index
{pageCount} // total amount of pages

````

### pageNextText (default `"Next"`)
A string specifying the text of the link to the next page.

### pagePrevText (default `"Prev"`)
A string specifying the text of the link to the previous page.

### pageFirstText (default `"First"`)
A string specifying the text of the link to the first page.

### pageLastText (default `"Last"`)
A string specifying the text of the link to the last page.

### pageNavigatorNextText (default `"..."`)
A string specifying the text of the link to move to next set of page links, when total amount of pages more than `pageButtonCount`.

### pageNavigatorPrevText (default `"..."`)
A string specifying the text of the link to move to previous set of page links, when total amount of pages more than `pageButtonCount`.

### loadIndication (default `true`)
A boolean value specifying whether to show loading indication during controller operations execution.

### loadIndicationDelay (default `500`)
An integer value specifying the delay in ms before showing load indication. Applied only when `loadIndication` is `true`.

### loadMessage (default `"Please, wait..."`)
A string specifying the text of loading indication panel. Applied only when `loadIndication` is `true`.

### loadShading (default `true`)
A boolean value specifying whether to show overlay (shader) over grid content during loading indication. Applied only when `loadIndication` is `true`.

### updateOnResize (default `true`)
A boolean value specifying whether to refresh grid on window resize event.



## Fields




## Methods




## Callbacks




## Controller




## Sorting Strategies






