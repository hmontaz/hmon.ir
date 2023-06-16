/// <reference path="../../../resources/plugins/$.fn.buttonize.js" />

var ui_handler = {
	roots: [],
	accidentals: [],
	modes: [],
	chords: [],
	random: function (min, max) {
		var diff = max - min;
		return Math.round(min + Math.random() * diff);
	},
	getRandom: function (list) {
		var index = this.random(0, list.length - 1);
		return list[index];
	},
	settings: {},
	ui: {},
	init: function () {
		var _this = this;
		var seed_add = function (value) {
			_this.random_seed += value;
			_this.update();
		};
		this.ui.btnSeedDecrease = $('#btnSeedDecrease').click(function () { seed_add(-1); });
		this.ui.btnSeedIncrease = $('#btnSeedIncrease').click(function () { seed_add(+1); });
		this.ui.spanRandomSeed = $('#spanRandomSeed').on('wheel', function (e) {
			var delta = e.originalEvent.deltaY;
			seed_add(-Math.sign(delta));
			//console.log(e, e.deltaY);
			return false;
		});
		this.fill_ddls();
		this.update();
	},
	SHARP_SYMBOL: '♯',
	FLAT_SYMBOL: '♭',
	fill_ddls: function () {
		var _this = this;
		var all_roots = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
		var all_accidentals = ['', '♮', '♯', '♭', '♯♯', '♭♭'];
		var all_modes = ['', 'Ionian', 'Dorian', 'Phrygian', 'Lydin', 'Mixolydian', 'Aolian', 'Locrian'];
		var all_chords = ['', 'M', 'm', 'm7', '△', '7'
			, 'm7♭5', '&#xE870;'//half diminished
			, 'dim', '&#xE871;'// diminished
			, '&#xE872;'
		];
		this.fillDll($('#ddlRoots'), all_roots)
			.change(function () {
				_this.roots = _this.getSelected($(this));
				_this.generate();
			});
		this.fillDll($('#ddlAccidentals'), all_accidentals)
			.change(function () {
				_this.accidentals = _this.getSelected($(this));
				_this.generate();
			});
		this.fillDll($('#ddlModes'), all_modes)
			.change(function () {
				_this.modes = _this.getSelected($(this));
				_this.generate();
			});
		this.fillDll($('#ddlChords'), all_chords)
			.change(function () {
				_this.chords = _this.getSelected($(this));
				_this.generate();
			});
	},
	random_seed: 2001,
	shuffle: function (array) {
		var currentIndex = array.length, randomIndex;
		var rand = this.mulberry32(this.random_seed);
		//var rand = Math.random;
		// While there remain elements to shuffle.
		while (currentIndex != 0) {

			// Pick a remaining element.
			randomIndex = Math.floor(rand() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}

		return array;
	},
	all_from_ui: function () {
		var result = [];
		for (var root_i = 0; root_i < this.roots.length; root_i++) {
			for (var accidental_i = 0; accidental_i < this.accidentals.length; accidental_i++) {
				for (var mode_i = 0; mode_i < this.modes.length; mode_i++) {
					for (var chord_i = 0; chord_i < this.chords.length; chord_i++) {

						var root = this.roots[root_i];
						var accidental = this.accidentals[accidental_i];
						var mode = this.modes[mode_i];
						var chord = this.chords[chord_i];

						if (root + accidental == 'F♭') continue;
						if (root + accidental == 'C♭') continue;
						if (root + accidental == 'E♯') continue;
						if (root + accidental == 'B♯') continue;

						var text = '';
						if (root) text += root;
						if (accidental) text += accidental
						if (mode) text += ' ' + mode
						if (chord) text += ' <sup>' + chord + '</sup>';
						if (result.indexOf(text) != -1) continue;
						result.push(text);

					}
				}
			}
		}
		return result;
	},
	all_keys: function () {
		var result = [];

		// Majors
		result.push('C');
		result.push('G');
		result.push('D');
		result.push('A');
		result.push('E');
		result.push('B');
		result.push('F' + this.SHARP_SYMBOL);
		result.push('C' + this.SHARP_SYMBOL);
		result.push('F');
		result.push('B' + this.FLAT_SYMBOL);
		result.push('E' + this.FLAT_SYMBOL);
		result.push('A' + this.FLAT_SYMBOL);
		result.push('D' + this.FLAT_SYMBOL);
		result.push('G' + this.FLAT_SYMBOL);
		result.push('C' + this.FLAT_SYMBOL);
		// Minor
		/*result.push('Am');
		result.push('Em');
		result.push('Bm');
		result.push('F' + this.SHARP_SYMBOL + 'm');
		result.push('C' + this.SHARP_SYMBOL + 'm');
		result.push('G' + this.SHARP_SYMBOL + 'm');
		result.push('D' + this.SHARP_SYMBOL + 'm');
		result.push('A' + this.SHARP_SYMBOL + 'm');
		result.push('Dm');
		result.push('Gm');
		result.push('Cm');
		result.push('Fm');
		result.push('B' + this.FLAT_SYMBOL + 'm');
		result.push('E' + this.FLAT_SYMBOL + 'm');
		result.push('A' + this.FLAT_SYMBOL + 'm');*/

		return result;
	},
	update: function () {
		$('#spanRandomSeed').html(this.random_seed);
		this.generate();
	},
	generate: function () {
		//var result = this.all_from_ui();
		var result = this.all_keys();
		result = this.shuffle(result);
		var output = $('#divOutput').html('');
		for (var i = 0; i < result.length; i++) {
			var item = result[i];
			$('<div>').addClass('item').appendTo(output).html(item);
			if ((i + 1) % 4 == 0) output.append('<br>');
		}
		//console.log(result.length);
	},
	fillDll: function (ddl, items) {
		var _this = this;
		ddl.html('');
		for (var i = 0; i < items.length; i++) {
			var text = items[i];
			var element = $('<option>')
				.appendTo(ddl)
				//.prop('selected', true)
				.html(text);
		}
		ddl.buttonize({
			class: 'buttonizer',
			option_class: 'option'
		});
		return ddl;
	},
	getSelected: function (ddl) {
		var options = ddl.find('option:checked');
		//console.log(options);
		var result = [];
		for (var i = 0; i < options.length; i++) {
			var option = $(options[i]);
			result.push(option.val());
		}
		return result;
	},
	mulberry32: function (a) {
		//source: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
		return function () {
			var t = a += 0x6D2B79F5;
			t = Math.imul(t ^ t >>> 15, t | 1);
			t ^= t + Math.imul(t ^ t >>> 7, t | 61);
			return ((t ^ t >>> 14) >>> 0) / 4294967296;
		}
	},
	//fillOptions: function (container, items) {
	//	container.html('');
	//	for (var i = 0; i < items.length; i++) {
	//		var text = items[i];
	//		var element = $('<span>')
	//			.addClass('option')
	//			.appendTo(container)
	//			.html(text);
	//	}
	//},



};

$(document).ready(function () {
	ui_handler.init();
});