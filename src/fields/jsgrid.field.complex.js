(function (jsGrid, $, undefined) {

	var Field = jsGrid.Field;

	function ComplexField(config) {
		this.binder = {};
		this.controls = {};
		this.displayLayout = "";
		this.filterValue = "";
		this.editLayout = "";

		for (var prop in config.binder) {
			var childConfig = config.binder[prop];
			if (!childConfig)
				return;
			childConfig = $.extend(childConfig, { name: prop });
			var propType = childConfig.type || "text";
			this.controls[prop] = new jsGrid.fields[propType](childConfig);
		}

		Field.call(this, config);
	}

	ComplexField.prototype = new Field({

		autosearch: true,
		align: "left",
		css: "complex-field",
		sorter: function (obj1, obj2) {
			var defaultProp = this._getDedaultField();
			if (obj1[defaultProp] > obj2[defaultProp]) return -1;
			if (obj1[defaultProp] === obj2[defaultProp]) return 0;
			if (obj1[defaultProp] < obj2[defaultProp]) return 1;
		},
		itemTemplate: function (value, item) {
			var binder = this.binder,
				controls = this.controls,
				template = this.displayLayout,
				objRet = {};
			for (var prop in binder) {
				var control = controls[prop] || null;
				if (control) {
					objRet[prop] = control.itemTemplate(value[prop], value);
				}
			}
			return this._formatTemplate(objRet, template);
		},
		filterTemplate: function () {
			if (!this.filtering)
				return "";

			var grid = this._grid,
                $result = this.filterControl = this._getFilterControl().insertTemplate();
			if (this.autosearch) {
				$result.on("change", function (e) {
					grid.search();
				});
			}
			return $result;
		},
		insertTemplate: function () {
			if (!this.inserting)
				return "";
			return this.insertControl = this._createComplexInsertControl();
		},
		editTemplate: function (value) {
			if (!this.editing)
				return this.itemTemplate(value);
			var $result = this.editControl = this._createComplexEditControl(value);
			return $result;
		},
		filterValue: function () {
			return this.filterControl.filterValue();
		},
		insertValue: function () {
			var binder = this.binder,
				objVal = {};
			for (var prop in binder) {
				if (childControl = this._getControl(prop)) {
					objVal[prop] = childControl.insertValue();
				}
			}
			return objVal;
		},
		editValue: function () {
			var binder = this.binder,
				objVal = {};
			for (var prop in binder) {
				if (childControl = this._getControl(prop)) {
					objVal[prop] = childControl.editValue();
				}
			}
			return objVal;
		},
		_formatTemplate: function (objVal, template) {
			if (template.length == 0) {
				var arrs = [];
				for (var prop in objVal) {
					arrs.push(objVal[prop]);
				}
				return arrs.join("<br />");
			}
			var templateBody = $("#" + template).html();
			return $.tmpl(templateBody, objVal).prop("outerHTML");
		},
		_getDedaultField: function () {
			var filterProp = this.filterValue || ""
			binder = this.binder;
			if (filterProp.length == 0) {
				for (var prop in binder) {
					filterProp = prop;
					break;
				}
			}
			return filterProp;
		},
		_getFilterControl: function () {
			return this._getControl(this._getDedaultField());
		},
		_getControl: function (prop) {
			var controls = this.controls || {};
			return controls[prop];
		},
		_wrapEditTemplate: function (templateName) {
			var binder = this.binder;
			if (templateName.length == 0) {
				var template = $("<ul></ul>");
				for (var prop in binder) {
					var li = $("<li></li>");
					li.attr("jg", prop);
					template.append(li);
				}
				return template;
			}

			var templateBody = $("#" + templateName).html();
				model = {};
			for (var prop in binder) {
				model[prop] = prop;
			}
			return $.tmpl(templateBody, model);
		},
		_createComplexInsertControl: function () {
			var itemControl =  this._wrapEditTemplate(this.editLayout);
			var binder = this.binder,
				template = this.editLayout;
			for (var prop in binder) {
				if (childControl = this._getControl(prop)) {
					var placeholder = $("*[jg=" + prop + "]", itemControl).first();
					if (placeholder.length > 0) {
						placeholder.append(childControl.insertTemplate());
					}
				}
			}
			return itemControl;
		},
		_createComplexEditControl: function (value) {
			var itemControl = this._wrapEditTemplate(this.editLayout);
			var binder = this.binder,
				template = this.editLayout;
			for (var prop in binder) {
				if (childControl = this._getControl(prop)) {
					var placeholder = $("*[jg=" + prop + "]",itemControl).first();
					if (placeholder.length > 0) {
						placeholder.append(childControl.editTemplate(value[prop]));
					}
				}
			}
			return itemControl;
		}
	});

	jsGrid.fields.complex = jsGrid.ComplexField = ComplexField;

}(jsGrid, jQuery));
