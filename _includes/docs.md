## Configuration

The config object may contain following options (default values are specified below):

<div class="code">
    <pre class="prettyprint linenums lang-js">{
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

    noDataContent: "Not found",

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
    editRowRenderer: null
}</pre>
</div>

### fields
An array of fields (columns) of the grid.

Each field has general options and specific options depending on field type.

General options peculiar to all field types:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
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
    editValue: function() { ... },

    cellRenderer: null
}</pre>
</div>

- **type** is a string key of field (`"text"|"number"|"checkbox"|"select"|"textarea"|"control"`) in fields registry `jsGrid.fields` (the registry can be easily extended with custom field types).
- **name** is a property of data item associated with the column.
- **title** is a text to be displayed in the header of the column. If `title` is not specified, the `name` will be used instead.
- **css** is a string representing css classes to be attached to the table cell.
- **headercss** is a string representing css classes to be attached to the table header cell. If not specified, then **css** is attached instead.
- **filtercss** is a string representing css classes to be attached to the table filter row cell. If not specified, then **css** is attached instead.
- **insertcss** is a string representing css classes to be attached to the table insert row cell. If not specified, then **css** is attached instead.
- **editcss** is a string representing css classes to be attached to the table edit row cell. If not specified, then **css** is attached instead.
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
- **cellRenderer** is a function to customize cell rendering. The function signature is `function(value, item)`, where `value` is a value of column property of data item, and `item` is a row data item. The function should return markup as a string, jQueryElement or DomNode representing table cell `td`.

Specific field options depends on concrete field type.
Read about build-in fields in [Grid Fields](#grid-fields) section.

### data
An array of items to be displayed in the grid. The option should be used to provide static data. Use the `controller` option to provide non static data.

### autoload (default `false`)
A boolean value specifying whether `controller.loadData` will be called when grid is rendered.

### controller
An object or function returning an object with the following structure:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    loadData: $.noop,
    insertItem: $.noop,
    updateItem: $.noop,
    deleteItem: $.noop
}</pre>
</div>

- **loadData** is a function returning an array of data or jQuery promise that will be resolved with an array of data (when `pageLoading` is `true` instead of object the structure `{ data: [items], itemsCount: [total items count] }` should be returned). Accepts filter parameter including current filter options and paging parameters when `pageLoading` is `true`.
- **insertItem** is a function returning inserted item or jQuery promise that will be resolved with inserted item. Accepts inserting item object.
- **updateItem** is a function returning updated item or jQuery promise that will be resolved with updated item. Accepts updating item object.
- **deleteItem** is a function deleting item. Returns jQuery promise that will be resolved when deletion is completed. Accepts deleting item object.

Read more about controller interface in [Grid Controller](#grid-controller) section.

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

<div class="code">
    <pre class="prettyprint linenums lang-js">{
     item       // data item
     itemIndex  // data item index
     event      // jQuery event
}</pre>
</div>

By default `rowClick` performs row editing when `editing` is `true`.

### noDataContent (default `"Not found"`)
A string or a function returning a markup, jQueryElement or DomNode specifying the content to be displayed when `data` is an empty array.

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

<div class="code">
    <pre class="prettyprint linenums lang-js">{first}     // link to first page
{prev}      // link to previous page
{pages}     // page links
{next}      // link to next page
{last}      // link to last page
{pageIndex} // current page index
{pageCount} // total amount of pages</pre>
</div>

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

### rowRenderer (default `null`)
A function to customize row rendering. The function signature is `function(item, itemIndex)`, where `item` is row data item, and `itemIndex` is the item index.
The function should return markup as a string, jQueryElement or DomNode representing table row `tr`.

### headerRowRenderer (default `null`)
A function to customize grid header row.
The function should return markup as a string, jQueryElement or DomNode representing table row `tr`.

### filterRowRenderer (default `null`)
A function to customize grid filter row.
The function should return markup as a string, jQueryElement or DomNode representing table row `tr`.

### insertRowRenderer (default `null`)
A function to customize grid inserting row.
The function should return markup as a string, jQueryElement or DomNode representing table row `tr`.

### editRowRenderer (default `null`)
A function to customize editing row rendering. The function signature is `function(item, itemIndex)`, where `item` is row data item, and `itemIndex` is the item index.
The function should return markup as a string, jQueryElement or DomNode representing table row `tr`.


## Grid Fields

All fields supporting by grid are stored in `jsGrid.fields` object, where key is a type of the field and the value is the field class.

`jsGrid.fields` contains following build-in fields:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    text: { ... },      // simple text input
    number: { ... },    // number input
    select: { ... },    // select control
    checkbox: { ... },  // checkbox input
    textarea: { ... },  // textarea control (renders textarea for inserting and editing and text input for filtering)
    control: { ... }    // control field with delete and editing buttons for data rows, search and add buttons for filter and inserting row
}</pre>
</div>

Each build-in field can be easily customized with general configuration properties described in [fields](#fields) section and custom field-specific properties described below.

### text
Text field renders `<input type="text">` in filter, inserting and editing rows.

Custom properties:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    autosearch: true    // triggers searching when the user presses `enter` key in the filter input
}</pre>
</div>

### number
Number field renders `<input type="number">` in filter, inserting and editing rows.

Custom properties:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    sorter: "number",   // uses sorter for numbers
    align: "right"      // right text alignment
}</pre>
</div>

### select
Select field renders `<select>` control in filter, inserting and editing rows.

Custom properties:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    align: "center",        // center text alignment
    autosearch: true,       // triggers searching when the user changes the selected item in the filter
    items: [],              // an array of items for select
    valueField: "",         // name of property of item to be used as value
    textField: "",         // name of property of item to be used as displaying value
    selectedIndex: -1       // index of selected item by default
}</pre>
</div>

If valueField is not defined, then the item index is used instead.
If textField is not defined, then item itself is used to display value.

For instance the simple select field config may look like:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    name: "Country",
    type: "select",
    items: [ "", "United States", "Canada", "United Kingdom" ]
}</pre>
</div>

or more complex with items as objects:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    name: "Country",
    type: "select"
    items: [
         { Name: "", Id: 0 },
         { Name: "United States", Id: 1 },
         { Name: "Canada", Id: 2 },
         { Name: "United Kingdom", Id: 3 }
    ],
    valueField: "Id",
    textField: "Name"
}</pre>
</div>

### checkbox
Checkbox field renders `<input type="checkbox">` in filter, inserting and editing rows.
Filter checkbox supports intermediate state for, so click switches between 3 states (checked|intermediate|unchecked).

Custom properties:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    sorter: "number",   // uses sorter for numbers
    align: "center"     // center text alignment
    autosearch: true    // triggers searching when the user clicks checkbox in filter
}</pre>
</div>

### textarea
Textarea field renders '<textarea>` in inserting and editing rows and `<input type="text">` in filter row.

Custom properties:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    autosearch: true    // triggers searching when the user presses `enter` key in the filter input
}</pre>
</div>

### control
Control field renders delete and editing buttons in data row, search and add buttons in filter and inserting row accordingly.
It also renders button switching between filtering and searching in header row.

Custom properties:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    editButton: true,                               // show edit button
    deleteButton: true,                             // show delete button
    clearFilterButton: true,                        // show clear filter button
    modeSwitchButton: true,                         // show switching filtering/inserting button

    align: "center",                                // center content alignment
    width: 50,                                      // default column width is 50px
    filtering: false,                               // disable filtering for column
    inserting: false,                               // disable inserting for column
    editing: false,                                 // disable editing for column
    sorting: false,                                 // disable sorting for column

    searchModeButtonTooltip: "Switch to searching", // tooltip of switching filtering/inserting button in inserting mode
    insertModeButtonTooltip: "Switch to inserting", // tooltip of switching filtering/inserting button in filtering mode
    editButtonTooltip: "Edit",                      // tooltip of edit item button
    deleteButtonTooltip: "Delete",                  // tooltip of delete item button
    searchButtonTooltip: "Search",                  // tooltip of search button
    clearFilterButtonTooltip: "Clear filter",       // tooltip of clear filter button
    insertButtonTooltip: "Insert",                  // tooltip of insert button
    updateButtonTooltip: "Update",                  // tooltip of update item button
    cancelEditButtonTooltip: "Cancel edit",         // tooltip of cancel editing button
}</pre>
</div>

### Custom Field

If you need a completely custom field, the object `jsGrid.fields` can be easily extended.

In this example we define new grid field `date`:

<div class="code">
    <pre class="prettyprint linenums lang-js">var MyDateField = function(config) {
    jsGrid.Field.call(this, config);
};

MyDateField.prototype = new jsGrid.Field({

    css: "date-field",            // redefine general property 'css'
    align: "center",              // redefine general property 'align'

    myCustomProperty: "foo",      // custom property

    sorter: function(date1, date2) {
        return new Date(date1) - new Date(date2);
    },

    itemTemplate: function(value) {
        return new Date(value).toDateString();
    },

    insertTemplate: function(value) {
        return this._insertPicker = $("&lt;input&gt;").datepicker({ defaultDate: new Date() });
    },

    editTemplate: function(value) {
        return this._editPicker = $("&lt;input&gt;").datepicker().datepicker("setDate", new Date(value));
    },

    insertValue: function() {
        return this._insertPicker.datepicker("getDate").toISOString();
    },

    editValue: function() {
        return this._editPicker.datepicker("getDate").toISOString();
    }
});

jsGrid.fields.date = MyDateField;</pre>
</div>

To have all general grid field properties custom field class should inherit `jsGrid.Field` class or any other field class.
Here `itemTemplate` just returns the string representation of a date.
`insertTemplate` and `editTemplate` create jQuery UI datePicker for inserting and editing row.
Of course jquery ui library should be included to make it work.
`insertValue` and `editValue` return date to insert and update items accordingly.
We also defined date specific sorter.

Now, our new field `date` can be used in the grid config as follows:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    fields: [
      ...
      { type: "date", myCustomProperty: "bar" },
      ...
    ]
}</pre>
</div>


## Methods

jsGrid methods could be called with `jsGrid` jQuery plugin or directly.

To use jsGrid plugin to call a method, just call `jsGrid` with method name and required parameters as next arguments:

<div class="code">
    <pre class="prettyprint linenums lang-js">// calling method with jQuery plugin
$("#grid").jsGrid("methodName", param1, param2);</pre>
</div>

To call method directly you need to retrieve grid instance or just create grid with the constructor:

<div class="code">
    <pre class="prettyprint linenums lang-js">// retrieve grid instance from element data
var grid = $("#grid").data("JSGrid");

// create grid with the constructor
var grid = new jsGrid.Grid($("#grid"), { ... });

// call method directly
grid.methodName(param1, param2); </pre>
</div>

### cancelEdit()
Cancels row editing. 

<div class="code">
    <pre class="prettyprint linenums lang-js">$("#grid").jsGrid("cancelEdit");</pre>
</div>

### clearFilter(): `Promise`
Clears current filter and performs search with empty filter.
Returns jQuery promise resolved when data filtering is completed. 

<div class="code">
    <pre class="prettyprint linenums lang-js">$("#grid").jsGrid("clearFilter").done(function() {
    console.log("filtering completed");
});</pre>
</div>

### clearInsert()
Clears current inserting row. 

<div class="code">
    <pre class="prettyprint linenums lang-js">$("#grid").jsGrid("clearInsert");</pre>
</div>

### deleteItem(item|$row|rowNode): `Promise`
Removes specified row from the grid.
Returns jQuery promise resolved when deletion is completed.

**item&#124;$row&#124;rowNode** is the reference to the item or the row jQueryElement or the row DomNode.

<div class="code">
    <pre class="prettyprint linenums lang-js">// delete row by item reference
$("#grid").jsGrid("deleteItem", item);

// delete row by jQueryElement
$("#grid").jsGrid("deleteItem", $(".specific-row"));

// delete row by DomNode
$("#grid").jsGrid("deleteItem", rowNode);</pre>
</div>

### destroy()
Destroys the grid and brings the Node to its original state.

<div class="code">
    <pre class="prettyprint linenums lang-js">$("#grid").jsGrid("destroy");</pre>
</div>

### editItem(item|$row|rowNode)
Sets grid editing row.

**item&#124;$row&#124;rowNode** is the reference to the item or the row jQueryElement or the row DomNode.

<div class="code">
    <pre class="prettyprint linenums lang-js">// edit row by item reference
$("#grid").jsGrid("editItem", item);

// edit row by jQueryElement
$("#grid").jsGrid("editItem", $(".specific-row"));

// edit row by DomNode
$("#grid").jsGrid("editItem", rowNode);</pre>
</div>

### insertItem([item]): `Promise`
Inserts row into the grid based on item.
Returns jQuery promise resolved when insertion is completed. 
 
**item** is the item to pass to `controller.insertItem`. 

If `item` is not specified the data from inserting row will be inserted.

<div class="code">
    <pre class="prettyprint linenums lang-js">// insert item from inserting row
$("#grid").jsGrid("insertItem");

// insert item
$("#grid").jsGrid("insertItem", { Name: "John", Age: 25, Country: 2 }).done(function() {
    console.log("insertion completed");
});</pre>
</div>

### openPage(pageIndex)
Opens the page of specified index.

**pageIndex** is one-based index of the page to open. The value should be in range from 1 to [total amount of pages].


### option(key, [value])
Gets or sets the value of an option.
 
**key** is the name of the option.

**value** is the new option value to set. 

If `value` is not specified, then the value of the option `key` will be returned.

<div class="code">
    <pre class="prettyprint linenums lang-js">// turn off paging
$("#grid").jsGrid("option", "paging", false);

// get current page index
var pageIndex = $("#grid").jsGrid("option", "pageIndex");</pre>
</div>

### refresh()
Refreshes the grid. Renders the grid body and pager content, recalculates sizes.

<div class="code">
    <pre class="prettyprint linenums lang-js">$("#grid").jsGrid("refresh");</pre>
</div>

### render(): `Promise`
Performs complete grid rendering. If option `autoload` is `true` calls `controller.loadData`. The state of the grid like current page and sorting is retained. 
Returns jQuery promise resolved when data loading is completed. If auto-loading is disabled the promise is instantly resolved.   

<div class="code">
    <pre class="prettyprint linenums lang-js">$("#grid").jsGrid("render").done(function() {
    console.log("rendering completed and data loaded");
});</pre>
</div>

### reset()
Resets the state of the grid. Goes to the first data page, resets sorting, and then calls `refresh`.  

<div class="code">
    <pre class="prettyprint linenums lang-js">$("#grid").jsGrid("reset");</pre>
</div>

### search([filter]): `Promise`
Performs filtering of the grid.
Returns jQuery promise resolved when data loading is completed. 
 
**filter** is a filter to pass to `controller.loadData`. 

If `filter` is not specified the current filter (filtering row values) will be applied.

<div class="code">
    <pre class="prettyprint linenums lang-js">// search with current grid filter
$("#grid").jsGrid("search");

// search with custom filter
$("#grid").jsGrid("search", { Name: "John" }).done(function() {
    console.log("filtering completed");
});</pre>
</div>

### showPrevPages()
Shows previous set of pages, when total amount of pages more than `pageButtonCount`.

<div class="code">
    <pre class="prettyprint linenums lang-js">$("#grid").jsGrid("showPrevPages");</pre>
</div>

### showNextPages()
Shows next set of pages, when total amount of pages more than `pageButtonCount`.

<div class="code">
    <pre class="prettyprint linenums lang-js">$("#grid").jsGrid("showNextPages");</pre>
</div>

### sort(sortConfig|field, [order]): `Promise`
Sorts grid by specified field.
Returns jQuery promise resolved when sorting is completed.

**sortConfig** is the plain object of the following structure `{ field: (fieldIndex|fieldName|field), order: ("asc"|"desc") }`

**field** is the field to sort by. It could be zero-based field index or field name or field reference

**order** is the sorting order. Accepts the following values: "asc"|"desc"

If `order` is not specified, then data is sorted in the reversed to current order, when grid is already sorted by the same field. Or `"asc"` for sorting by another field.

When grid data is loaded by pages (`pageLoading` is `true`) sorting calls `controller.loadData` with sorting parameters. Read more in [Grid Controller](#grid-controller) section.

<div class="code">
    <pre class="prettyprint linenums lang-js">// sorting grid by first field
$("#grid").jsGrid("sort", 0);

// sorting grid by field "Name" in descending order
$("#grid").jsGrid("sort", { field: "Name", order: "desc" });

// sorting grid by myField in ascending order 
$("#grid").jsGrid("sort", myField, "asc").done(function() {
    console.log("sorting completed");
});</pre>
</div>

### updateItem([item|$row|rowNode], [editedItem]): `Promise`
Updates item and row of the grid.
Returns jQuery promise resolved when update is completed.
 
**item&#124;$row&#124;rowNode** is the reference to the item or the row jQueryElement or the row DomNode.

**editedItem** is the changed item to pass to `controller.updateItem`.

If `item|$row|rowNode` is not specified then editing row will be updated.

If `editedItem` is not specified the data from editing row will be taken.

<div class="code">
    <pre class="prettyprint linenums lang-js">// update currently editing row
$("#grid").jsGrid("updateItem");

// update currently editing row with specified data
$("#grid").jsGrid("updateItem", { ID: 1, Name: "John", Age: 25, Country: 2 });

// update specified item with particular data (row DomNode or row jQueryElement can be used instead of item reference)
$("#grid").jsGrid("updateItem", item, { ID: 1, Name: "John", Age: 25, Country: 2 }).done(function() {
    console.log("update completed");
});</pre>
</div>


## Callbacks

### onDataLoading
Fires before data loading.

Has following arguments:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    grid                // grid instance
    filter              // loading filter object
}</pre>
</div>

### onDataLoaded
Fires after data loading.

Has following arguments:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    grid                // grid instance
    data                // load result (array of items or data structure for loading by page scenario) 
}</pre>
</div>

### onError
Fires when controller handler promise failed.

Has following arguments:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    grid                // grid instance
    args                // an array of arguments provided to fail promise handler 
}</pre>
</div>

### onItemDeleting
Fires before item deletion.

Has following arguments:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    grid                // grid instance
    row                 // deleting row jQuery element
    item                // deleting item
    itemIndex           // deleting item index
}</pre>
</div>

### onItemDeleted
Fires after item deletion.

Has following arguments:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    grid                // grid instance
    row                 // deleted row jQuery element
    item                // deleted item
    itemIndex           // deleted item index
}</pre>
</div>

### onItemInserting
Fires before item insertion.

Has following arguments:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    grid                // grid instance
    item                // inserting item
}</pre>
</div>

### onItemInserted
Fires after item insertion.

Has following arguments:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    grid                // grid instance
    item                // inserted item
}</pre>
</div>

### onItemUpdating
Fires before item update.

Has following arguments:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    grid                // grid instance
    row                 // updating row jQuery element
    item                // updating item
    itemIndex           // updating item index
}</pre>
</div>

### onItemUpdated
Fires after item update.

Has following arguments:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    grid                // grid instance
    row                 // updated row jQuery element
    item                // updated item
    itemIndex           // updated item index
}</pre>
</div>

### onOptionChanging
Fires before grid option value change.

Has following arguments:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    grid                // grid instance
    option              // name of option to be changed
    oldValue            // old value of option
    newValue            // new value of option
}</pre>
</div>

### onOptionChanged
Fires after grid option value change.

Has following arguments:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    grid                // grid instance
    option              // name of changed option
    value               // changed option value
}</pre>
</div>

### onRefreshing
Fires before grid refresh.

Has following arguments:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    grid                // grid instance
}</pre>
</div>

### onRefreshed
Fires after grid refresh.

Has following arguments:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    grid                // grid instance
}</pre>
</div>


## Grid Controller

The controller is a gateway between grid and data storage. All data manipulations call accordant controller methods.
By default grid has an empty controller and can work with static array of items stored in option `data`.
 
A controller should implement following interface:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    loadData: function(filter) { ... },
    insertItem: function(item) { ... },
    updateItem: function(item) { ... },
    deleteItem: function(item) { ... }
}</pre>
</div>

For instance the controller for typical REST service might look like:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    loadData: function(filter) {
        return $.ajax({
            type: "GET",
            url: "/items",
            data: filter,
            dataType: "json"
        });
    },
    
    insertItem: function(item) {
        return $.ajax({
            type: "POST",
            url: "/items",
            data: item,
            dataType: "json"
        });
    },
    
    updateItem: function(item) {
        return $.ajax({
            type: "PUT",
            url: "/items",
            data: item,
            dataType: "json"
        });
    },
    
    deleteItem: function(item) {
        return $.ajax({
            type: "DELETE",
            url: "/items",
            data: item,
            dataType: "json"
        });
    },
}</pre>
</div>

### loadData(filter): `Promise|dataResult`
Called on data loading.

**filter** contains all filter parameters of fields with enabled filtering

When `pageLoading` is `true` and data is loaded by page, `filter` includes two more parameters:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    pageIndex     // current page index
    pageSize      // the size of page
}</pre>
</div>

When grid sorting is enabled, `filter` includes two more parameters:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    sortField     // the name of sorting field
    sortOrder     // the order of sorting as string "asc"|"desc"
}</pre>
</div>

Method should return `dataResult` or jQuery promise that will be resolved with `dataResult`.
  
**dataResult** depends on `pageLoading`. When `pageLoading` is `false` (by default), then data result is a plain javascript array of objects.
If `pageLoading` is `true` data result should have following structure 

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    data          // array of items
    itemsCount    // total items amount in storage
}</pre>
</div>

### insertItem(item): `Promise|insertedItem`
Called on item insertion.

Method should return `insertedItem` or jQuery promise that will be resolved with `insertedItem`. 
If no item is returned, inserting item will be used as inserted item. 

**item** is the item to be inserted.

### updateItem(item): `Promise|updatedItem`
Called on item update.

Method should return `updatedItem` or jQuery promise that will be resolved with `updatedItem`.
If no item is returned, updating item will be used as updated item.

**item** is the item to be updated.

### deleteItem(item): `Promise`
Called on item deletion.

If deletion is asynchronous, method should return jQuery promise that will be resolved when deletion is completed.

**item** is the item to be deleted.


## Sorting Strategies

All supported sorting strategies are stored in `jsGrid.sortStrategies` object, where key is a name of the strategy and the value is a `sortingFunction`.

`jsGrid.sortStrategies` contains following build-in sorting strategies:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    string: { ... },          // string sorter
    number: { ... },          // number sorter
    date: { ... },            // date sorter
    numberAsString: { ... }   // numbers are parsed before comparison
}</pre>
</div>

**sortingFunction** is a sorting function with the following format:

<div class="code">
    <pre class="prettyprint linenums lang-js">function(value1, value2) {
    if(value1 < value2) return -1; // return negative value when first is less than second
    if(value1 === value2) return 0; // return zero if values are equal
    if(value1 > value2) return 1; // return positive value when first is greater than second
}</pre>
</div>

### Custom Sorting Strategy

If you need a custom sorting strategy, the object `jsGrid.sortStrategies` can be easily extended.

In this example we define new sorting strategy for our client objects:

<div class="code">
    <pre class="prettyprint linenums lang-js">// client object format
var clients = [{
    Name: "John",
    Age: 25
}, ...];

// sort clients by name and then by age
jsGrid.sortStrategies.client = function(client1, client2) {
    return client1.Name.localeCompare(client2.Name) 
        || client1.Age - client2.Age;
};</pre>
</div>

Now, our new sorting strategy `client` can be used in the grid config as follows:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    fields: [
      ...
      { type: "text", name: "Name", sorter: "client" },
      ...
    ]
}</pre>
</div>

Worth to mention, that if you need particular sorting only once, you can just inline sorting function in `sorter` not registering the new strategy:

<div class="code">
    <pre class="prettyprint linenums lang-js">{
    fields: [
      ...
      { 
          type: "text", 
          name: "Name", 
          sorter: function(client1, client2) {
              return client1.Name.localeCompare(client2.Name) 
                  || client1.Age - client2.Age;
          } 
      },
      ...
    ]
}</pre>
</div>


## Requirement

jQuery version 1.8.3 or later.


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