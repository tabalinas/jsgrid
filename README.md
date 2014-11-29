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

Include `jsgrid.min.js` and `jsgrid.min.css` files to the page.

Create grid applying jQuery plugin jsGrid with grid config as following

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



