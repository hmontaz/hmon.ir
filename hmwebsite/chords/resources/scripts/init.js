var Handler = {
	init: function () {
		var _this = this;
		this.data = data;
		this.fillCategories();
		$('#ddlCategory').change(function () { _this.fillTypes(); });
		$('#ddlType').change(function () { _this.showData(); });
	},
	fillCategories: function () {
		//this.fill_ddl('ddlCategory', function (a) { return a.category; }, null, function (a, b) { return a.text > b.text ? 1 : -1; });
		this.fill_ddl('ddlCategory', {
			getText: function (a) { return a.category; },
			getKey: function (a) { return a.category; }
		});
		this.fillTypes();
	},
	fillTypes: function () {
		var category = $('#ddlCategory').val();

		//this.fill_ddl('ddlType', function (a) { return a.name; }, match, function (a, b) { return a.sortOrder > b.sortOrder ? 1 : -1; });
		this.fill_ddl('ddlType', {
			//getText: function (a) { return a.category + ' - ' + a.name; },
			getText: function (a) { return a.name; },
			match: function (a) { return a.category == category || !category; },
		});
		$('#ddlType').focus();
		this.showData();
	},
	showData: function () {
		var _this = this;
		var category = $('#ddlCategory').val();
		var key = $('#ddlType').val();
		var match = function (a) { return _this.getKey(a) == key; };
		var item = this.data.items.filter(match)[0];
		//console.log(item);
		var img = $('<img>').attr('src', item.path)
			.css('max-width', '100%');
		$('#div_image').html('').append(img);
		$('#page_title').html(item.title);
	},
	fill_ddl(id, o) {
		var _this = this;
		o = o || {};
		getText = o.getText;
		getKey = o.getKey || function (a) { return _this.getKey(a); };
		var match = o.match;

		var items = [];

		var ddl = $('#' + id).html('');//.html('<option value="">ALL</option>');
		var list = this.data.items;
		for (var i = 0; i < list.length; i++) {
			var item = list[i];
			if (match && !match(item)) continue;
			//var item = o.map ? o.map(list[i]) : list[i];
			//if (items.find(function (a) { return a == item; })) continue;
			items.push(item);
			/*var o = getText(list[i]);
			if (!(o instanceof Array)) o = [o];
			for (var j = 0; j < o.length; j++) {
				var item = {
					text: o[j],
					//value: list[i].name,
				};
				if (items.find(function (a) { return a.text == item.text; })) continue;
				if (match && !match(list[i])) continue;
				items.push(item);
			}*/
		}
		/*if (sort)
			items = items.sort(sort)
		else
			items = items.sort(function (a, b) { return a.text > b.text ? 1 : -1; });*/
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var value = getKey(item)
			if (ddl.find('option[value="' + value + '"]').length > 0) continue;
			$('<option>')
				.html(getText(item))
				.val(value)
				.appendTo(ddl);
		}
		/*for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var option = $('<option>');
			option.html(item.text);
			option.attr('value', item.value);
			ddl.append(option);
		}*/
		//console.log(items);
	},
	getKey(item) {
		return item.category + '|' + item.name;
	}
};
$(document).ready(function () {
	Handler.init();
});