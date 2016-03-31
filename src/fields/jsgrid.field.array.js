(function (jsGrid, $, undefined) {

    var Field = jsGrid.Field;

    function ArrayField(config) {
        this.controls = [];
        this.insertControls = [];
        this.child = {
            type: "text"
        };
        Field.call(this, config);
    }

    ArrayField.prototype = new Field({

        autosearch: true,
        align: "left",
        css: "array-field",
        sorter: function (obj1, obj2) {
            return 0;
        },
        itemTemplate: function (values, item) {

            if (!$.isArray(values))
                return "This field only supports array type";
            
            var child = this.child || { type: "text" },
                subType = child.type,
                controls = this.controls = [],
                items = [];
            
            childConfig = $.extend({ name: this.name }, child);
            $.each(values, function(idx, val) {
                var control = new jsGrid.fields[subType](childConfig);
                controls.push(control);
                items.push(control.itemTemplate(val, item));
            });

            return this._formatItems(items);
        },
        filterTemplate: function () {
            if (!this.filtering)
                return "";

            //var grid = this._grid,
            //    $result = this.filterControl = this._getFilterControl().insertTemplate();
            //if (this.autosearch) {
            //    $result.on("change", function (e) {
            //        grid.search();
            //    });
            //}
            return "";
        },
        insertTemplate: function () {
            if (!this.inserting)
                return "";
            return this.insertControl = this._createArrayInsertControl();
        },
        editTemplate: function (value) {
            if (!this.editing)
                return this.itemTemplate(value);
            var $result = this.editControl = this._createArrayEditControl(value);
            return $result;
        },
        filterValue: function () {
            return this.filterControl.filterValue();
        },
        insertValue: function () {
            var objVals = [],
                insertControls = this.insertControls,
                child = this.child || { type: "text" },
                subType = child.type,
                childConfig = $.extend({ name: this.name }, child),
                insControl = new jsGrid.fields[subType](childConfig);

            for (var i = 0; i < insertControls.length; i++) {
                var control = insertControls[i];
                objVals.push(control.insertValue());
            }
            insertControls = [];
            insertControls.push(insControl);

            return objVals;
        },
        editValue: function () {    
            var objVals = [],
                editControls = this.controls;
            for (var i = 0; i < editControls.length; i++) {
                var control = editControls[i];
                if (control.isNew === true)
                    objVals.push(control.insertValue());
                else
                    objVals.push(control.editValue());

                control.isNew = false;
            }
            return objVals;
        },
        _formatItems: function (objVals) {
            var ul = $("<ul class='array-item'></ul>");
            $.each(objVals, function (idx, val) {
                ul.append("<li>" + val+ "</li> ");
            });
            return ul.listCollapse();
        },
        _createArrayInsertControl: function () {
            var $that = this,
                ul = $("<ul class='array-insert'></ul>"),
                child = this.child || { type: "text" },
                subType = child.type,
                controls = this.insertControls = [],
                childConfig = $.extend({ name: this.name }, child),
                li = $("<li></li>");

            var insControl = new jsGrid.fields[subType](childConfig);
            controls.push(insControl);
            li.append(insControl.insertTemplate());
            ul.append(li);

            return ul.listManager({
                item: { type: subType, config: childConfig },
                onAdd: $.proxy(function (control) {
                    this.insertControls.push(control);
                }, $that),
                onRemove: $.proxy(function (index) {
                    this.insertControls.splice(index, 1);
                }, $that)
            });
        },
        _createArrayEditControl: function (values) {
            var $that = this,
                ul = $("<ul class='array-edit'></ul>"),
                child = this.child || { type: "text" },
                subType = child.type,
                controls = this.controls = [],
                childConfig = $.extend({ name: this.name }, child);

            $.each(values, function (idx, val) {
                var control = new jsGrid.fields[subType](childConfig);
                controls.push(control);

                var li = $("<li></li>");
                li.append(control.editTemplate(values[idx]));
                ul.append(li);

            });

            return ul.listManager({
                item: { type: subType, config: childConfig },
                onAdd: $.proxy(function (control) {
                    control.isNew = true;
                    this.controls.push(control);
                }, $that),
                onRemove: $.proxy(function (index) {
                    this.self.controls.splice(index, 1);
                    this.data.splice(index, 1);
                }, { self: $that, data: values })
            });
        }
    });

    jsGrid.fields.array = jsGrid.ArrayField = ArrayField;

    $.fn.listCollapse = function (options) {
        var ops = {
            ease: 'swing',
            fadeOut: 100,
            floatIn: 500,
            offsetLeft: '20px',
            offsetRight: '-20px'
        },
	    self = $(this);
        ops = $.extend(ops, options);
        if (self.find(">li").length > 1) {
            self.find(">li:nth-child(n+2)").hide();
            self.find("li").first()
                           .addClass("collapse-header item-collapse")
                           .click(function () {
                               if ($(this).hasClass("item-collapse")) {
                                   $(this).removeClass("item-collapse")
                                          .addClass("item-expand");
                                   $(this).closest("ul").first().find(">li:nth-child(n+2)").show(ops);
                               }
                               else {
                                   $(this).closest("ul").first().find(">li:nth-child(n+2)").hide(ops);
                                   $(this).removeClass("item-expand")
                                          .addClass("item-collapse");
                               }
                           });

        }
        return self;
    };

    $.fn.listManager = function (options) {
        var ops = {
            ease: 'swing',
            fadeOut: 100,
            floatIn: 500,
            offsetLeft: '20px',
            offsetRight: '-20px',
            item: null,
            onAdd: $.noop,
            onRemove: $.noop
        },
	    self = $(this);
        ops = $.extend(ops, options);

        var btnAdd = $("<span class='item-add'></span>"),
            btnRemove = $("<span class='item-remove'></span>");

        btnRemove.click(function () {
            var liParent = $(this).closest("li").first(),
                index = liParent.index() || 0;
            liParent.remove();
            if (typeof ops.onRemove == "function") {
                ops.onRemove(index);
            }
        });

        btnAdd.click(function (e) {
            if (ops.item) {
                var type = ops.item.type || "text",
                    config = ops.item.config || {},
                    control = new jsGrid.fields[type](config),
                    li = $("<li></li>").append(control.insertTemplate())
                                       .append(btnRemove.clone(true));
                self.append(li);
                if (typeof ops.onAdd == "function") {
                    ops.onAdd(control);
                }
            }
        });

        self.find(">li").first().append(btnAdd);
        self.find(">li:nth-child(n+2)").append(btnRemove.clone(true));

        return self;
    };

}(jsGrid, jQuery));
