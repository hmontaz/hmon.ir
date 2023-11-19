/// <reference path="mustache.js" />

//import mustache from "./mustache";
//var Mustache = require('mustache');
var FxFinder = {
	data: [],
	search_busy: false,
	keep_preview_open: false,
	init: function () {
		var _this = this;
		this.applyTheme();
		$(document.body).show().click(function () { _this.hidePreview(); });
		setTimeout(function () { _this.readData('Line 6 Helix'); }, 30);
		this.divTitle = $('#divTitle');
		$(window).resize(function () { _this.resize(); });
		$(document).scroll(function () { _this.hidePreview(); });
		this.resize();

		this.divPreview = $('#divPreview');
		this.imgPreview = $('#imgPreview');
		/*if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			this.applyTheme('theme-dark');
		}
		else {
			this.applyTheme('theme-default');
		}
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
			const theme = event.matches ? "theme-dark" : "theme-default";
			//console.log(theme);
			_this.applyTheme(theme);
		});*/
	},
	resize: function () {
		let ww = window.innerWidth;
		let min = 426;
		let n = Math.round(ww / min);
		let offset=([0,6,5,4,3][n-1])||3;
		let w = Math.floor(ww / n)-offset;
		if (n == 1) w = ww;
		//console.log(n,w,ww);
		$('#dynamic_style').html('.item{max-width:' + w + 'px;}');
	},
	applyTheme: function (id) {
		var list = ['theme-default', 'theme-dark'];
		var index = localStorage.getItem('theme-index') || 1;
		localStorage.setItem('theme-index', index);
		id = id || list[index];
		$('#' + id).removeAttr('disabled').appendTo(document.head);
	},
	nextTheme: function () {
		var index = localStorage.getItem('theme-index') || 0;
		index++;
		index = index % 2;
		//console.log(index);
		localStorage.setItem('theme-index', index);
		this.applyTheme();
	},
	readData: function (name) {
		var _this = this;
		//console.log(data);
		this.read(data_line6[name]);
		this.fillVersions();
		this.fillTypes();
		$('#ddlVersion').change(function () { _this.fillTypes(); });
		$('#ddlType').change(function () { _this.fillBrands(); });
		$('#ddlBrand').change(function () { _this.fillModels(); });
		$('#ddlModel').change(function () { _this.fillInfo(); });
		$('#txtSearch').on('input', function () {
			if (_this.search_busy) return;
			_this.search_busy = true;
			setTimeout(function () { _this.fillInfo(); }, 200);
		});
	},
	showPreview: function (d) {
		//console.log(d.src);
		var _this = this;
		this.imgPreview.attr('src', d.src)
			.css({
				'min-width': '256px',
				'max-width': '90%',
				'max-height': '800px',
			});
		this.divPreview.css({
			'border': 'solid 1px gray',
			'border-radius': '5px',
			'position': 'fixed',
			'top': '50%',
			'left': '50%',
			'-webkit-transform': 'translate(-50%, -50%)',
			'transform': 'translate(-50%, -50%)',
		}).fadeIn();
		this.keep_preview_open = true;
		setTimeout(function () {
			_this.keep_preview_open = false;
		}, 50);

	},
	hidePreview: function () {
		if (this.keep_preview_open) return;
		this.divPreview.fadeOut();
	},
	read: function (source) {
		var new_d = function (item) {
			var d = {
				name: item.Name,
				icon: item.Icon,
				types: (item.Type || item.Category).split(','),
				category: item.Category,
				subcategory: item.Subcategory,
				brand: item['Original Brand'],
				//name:item.Name,
				imageUrl: item.Image ? ('resources/actual_models/' + item.Image + '.png') : null,
				title: item['Original Brand'] + ' - ' + (item['Original Model'] || item.Name),
				model: item['Original Model'] || item.Name,
				version: item.Version,
				path: item.Category + ' ► ' + item.Subcategory + ' ► ' + item.Name,
				description: item.Description || '',
				isLegacy: item.IsLegacy == "true",
				getImageUrl: function (preview) {
					//var src=(categories_[this.subcategory]||categories_[this.category]).imageUrl;
					if (this.icon) return 'resources/icon_models/' + this.icon + '.png';
					var cat = "";
					var name = '_' + this.name.replace(/ /g, '_')
						.replace(/×/g, 'x')
						.replace(/\//g, '_')
						.replace(/'/g, '');
					if (preview && this.imageUrl) return this.imageUrl;
					switch (this.category) {
						case 'Preamp':
							//cat = 'PRE_HX'; break;
							if (/*this.subcategory == 'Mic' ||*/
								['Divided Duo', 'Soup Pro', 'Stone Age 185', 'US Deluxe Nrm', 'US Deluxe Vib', 'US Double Nrm', 'US Double Vib', 'US Small Tweed', 'WhoWatt 100', 'Studio Tube Pre', 'US Princess'].indexOf(this.name) != -1) {
								cat = 'PRE_HX';
								break;
							}
						case 'Amp':
							if (this.subcategory == 'Guitar') cat = 'AMP_HX_GTR';
							if (this.subcategory == 'Bass') cat = 'AMP_HX_BASS';
							break;
						//case 'Preamp':
						//	if (this.subcategory == 'Mic') cat = 'PRE_HX';
						//	break;
						case 'Cab':
							cat = 'CAB_HX';
							if (this.subcategory == 'Microphone') cat = 'CAB_MIC'; break;
							break;
						case 'Modulation':
							cat = 'FX_HX_MOD';
							if (this.subcategory == 'Legacy') { cat = 'FX_M_Modulation'; name = ''; }
							break;
						case 'Distortion':
							cat = 'FX_HX_DIST';
							if (this.subcategory == 'Legacy') { cat = 'FX_M_Distortion'; name = ''; }
							break;
						case 'EQ':
							cat = 'FX_HX_EQ';
							break;
						case 'Looper':
							cat = 'LOOPER_HX';
							break;
						case 'Send/Return':
							cat = 'SENDRETURN_HX';
							break;
						case 'Delay':
							cat = 'FX_HX_DELAY';
							if (this.subcategory == 'Legacy') { cat = 'FX_M_Delay'; name = ''; }
							break;
						case 'Reverb':
							cat = 'FX_HX_REVERB';
							if (this.subcategory == 'Legacy') cat = 'FX_M_REVERB';
							break;
						case 'Filter':
							cat = 'FX_HX_FILTER';
							if (this.subcategory == 'Legacy') { cat = 'FX_M_Filter'; name = ''; }
							break;
						case 'Dynamics':
							cat = 'FX_HX_DYN';
							if (this.subcategory == 'Legacy') { cat = 'FX_M_Dynamics'; name = ''; }
							break;
						case 'Pitch/Synth':
							cat = 'FX_HX_PITCH';
							if (this.subcategory == 'Legacy') { cat = 'FX_M_PitchSynth'; name = ''; }
							break;
						case 'Volume/Pan': cat = 'VOL_HX'; break;
						case 'Wah': cat = 'FX_HX_WAH'; break;
						case 'IR': cat = 'FX_HX'; break;
						case 'Split': cat = 'FX_HX'; break;
						case 'Merge': cat = 'FX_HX'; break;
					}
					//if(!cat)return src;
					//console.log(cat);
					return './resources/icon_models/' + cat + name + '.png';
					//if (this.subcategory=='LEGACY')
					//var src=(categories_[this.subcategory]||categories_[this.category]).imageUrl;
					//var src=(categories_[item.subcategory]||categories_[item.category]).imageUrl;
					//var src='resources/icon_models/'+(item.category+"_HX_"+item.name).replace(/ /g,'')+'.png';
					//if(item.icon) src='resources/icon_models/'+item.icon+'.png';
					//console.log(src);
					//return src;
				}
			};
			if (d.types.indexOf(item.Category) == -1) d.types.push(item.Category);
			d.title = d.title.replace(/®/g, '<sup>®</sup>')
				.replace(/©/g, '<sup>©</sup>');
			d.description = d.description.replace(/®/g, '<sup>®</sup>')
				.replace(/©/g, '<sup>©</sup>')
				.replace(/”/g, '″')
				.replace('by* ', 'by ');
			return d;
		};
		var version = 0;
		for (var i = 0; i < source.length; i++) {
			var item = source[i];
			if (item.Version > version) version = item.Version;
			this.data.push(new_d(item));
			if (item.Category == 'Amp') {
				item.Category = 'Preamp';
				item.Type = item.Type.replaceAll('Amp', 'Preamp');
				this.data.push(new_d(item));
			}
		}
		var get_key = function (a) {
			return a.version.padStart(5, '0') + a.category.padEnd(50, ' ') + a.subcategory.padEnd(50, ' ') + a.name.padEnd(50, ' ');
		};
		this.data.sort(function (a, b) {
			return get_key(a).localeCompare(get_key(b));
		});
		var title = 'Helix Effect Finder v' + version;
		document.title = title;
		this.divTitle.html(window.document.title);
	},
	fill_ddl(id, getText, match, sort) {
		//console.log('here');
		var items = [];
		var ddl = $('#' + id).html('<option value="">ALL</option>');
		for (var i = 0; i < this.data.length; i++) {
			var o = getText(this.data[i]);
			if (!(o instanceof Array)) o = [o];
			for (var j = 0; j < o.length; j++) {
				var item = {
					text: o[j],
				};
				if (items.find(function (a) { return a.text == item.text; })) continue;
				if (match && !match(this.data[i])) continue;
				//console.log(data[i]);
				items.push(item);
			}
		}
		if (sort)
			items = items.sort(sort)
		else
			items = items.sort(function (a, b) { return a.text > b.text ? 1 : -1; })
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var option = $('<option>');
			option.html(item.text);
			ddl.append(option);
		}
	},
	fillVersions: function () {
		this.fill_ddl('ddlVersion', function (a) { return a.version; }, null, function (a, b) { return a.text > b.text ? -1 : 1; });
		//$('#ddlVersion').val('3.70');
		this.fillTypes();
	},
	fillTypes: function () {
		var version = $('#ddlVersion').val();
		var match = function (a) { return a.version == version || !version; };
		this.fill_ddl('ddlType', function (a) { return a.types; }, match);
		this.fillBrands();
	},
	fillBrands: function () {
		var version = $('#ddlVersion').val();
		var type = $('#ddlType').val();
		var match = function (a) {
			return (a.version == version || !version)
				&& (a.types.indexOf(type) != -1 || !type);
		};
		this.fill_ddl('ddlBrand', function (a) { return a.brand; }, match);
		this.fillModels();
	},
	fillModels: function () {
		var version = $('#ddlVersion').val();
		var type = $('#ddlType').val();
		var brand = $('#ddlBrand').val();
		var match = function (a) {
			return (a.version == version || !version)
				&& (a.types.indexOf(type) != -1 || !type)
				&& (a.brand == brand || !brand);
		};
		this.fill_ddl('ddlModel', function (a) { return a.model; }, match);
		//$('#txtSearch').val('');
		this.fillInfo();
	},
	fillInfo: function () {
		var _this = this;
		this.hidePreview();
		var version = $('#ddlVersion').val();
		var type = $('#ddlType').val();
		var brand = $('#ddlBrand').val();
		var model = $('#ddlModel').val();
		var text_split = $('#txtSearch').val()
			.toLowerCase()
			.replace(/"/g, '″')
			.replace(/;/g, ' ')
			.replace(/,/g, ' ')
			.split(' ');
		var info = $('#info').html('');
		for (var i = 0; i < this.data.length; i++) {
			var item = this.data[i];
			if (version && item.version != version) continue;
			if (type && item.types.indexOf(type) == -1) continue;
			if (brand && item.brand != brand) continue;
			if (model && item.model != model) continue;
			var s = (item.title + item.path + item.description).toLowerCase();
			var found = true;
			for (var j = 0; j < text_split.length; j++) {
				var text = text_split[j];
				if (text && s.indexOf(text) == -1) { found = false; break; }
			}
			if (!found) continue;
			var element = this.getItem_element(item);
			element.appendTo(info);
		}
		this.search_busy = false;
	},
	getItem_element: function (item) {
		var _this = this;
		on_image_click = function (element) {

			var d = {
				src: $(element).attr('preview_src')
			};
			//console.log(element);
			_this.showPreview(d);
		};
		var template = `
<div class='item'>
	<table>
		<tr valign=top>
			<td class="image-box">
				<img src="{{src}}" preview_src="{{preview_src}}" loading="lazy" style="max-height:96px;max-width:96px;cursor:pointer;" class="icon" onClick="on_image_click(this)"/>
			</td>
			<td style="width:1500px;" class="box">
				<div class="title">{{title}}</div>
				<div class="description">{{description}}</div>
				<div class="version">Since v{{version}}</div>
			</td>
		</tr>
		<tr>
			<td class="box" colspan='2'>
				<table class="noborder" style="width:100%;">
					<tr>
						<td class="path" style="color:{{color}};">
							{{path}}
						</td>
						<td style="width:20px;">
							<img src='{{addish_icon}}' class="small-icon" />
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
	
</div>
`;
		var categ = categories_[item.category];
		//console.log(item);
		var o = {
			title: item.title,
			src: item.getImageUrl(false),
			preview_src: item.getImageUrl(true),
			description: item.description,
			version: item.version,
			path: item.path,
			color: (categ && categ.color) ? categ.color : 'default',
			addish_icon: item.isLegacy ? './resources/images/legacy.svg' : './resources/images/blank.svg',
		};
		return $(Mustache.render(template, o));
	},
	/*getItem_element_: function (item) {
		var item_div = $('<div>').addClass('item');
		var table = $('<table style="">').appendTo(item_div);
		var tr = $('<tr valign=top>').appendTo(table);
		var td0 = $('<td class="image-box"></td>').appendTo(tr);
		var img = $('<img loading="lazy" style="width:96px;cursor:pointer;" class="icon"/>').appendTo(td0)
			.attr('src', item.getImageUrl(false))
			.attr('preview_src', item.getImageUrl(true));
		img.click(function () {
			var d = {
				src: $(this).attr('preview_src')
			};
			_this.showPreview(d);
		});
		//$(document).click(function(){hidePreview();});
		var td = $('<td style="width:1500px;" class="box">').appendTo(tr);
		td.append('<div class="item-title">' + item.title + '</div>');
		//item_div.append('<div style="color:black;">'+item.model+'</div>');
		td.append('<div class="item-description">' + item.description + '</div>');
		td.append('<div class="item-version">Since v' + item.version + '</div>');
		var categ = categories_[item.category];
		var color = 'default';
		if (categ && categ.color) color = categ.color;
		var legacy = '<img src="./resources/images/legacy.svg" class="small-icon" />';

		item_div.append('<div class="item-path box" style="margin:0 2 0 2;color:' + color + ';">'
			+ item.path + legacy + '</div>');
		return item_div;
	},*/
}
