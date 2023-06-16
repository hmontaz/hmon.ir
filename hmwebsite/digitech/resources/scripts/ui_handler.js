var WhammyHandler = function () {
	this.init();
}

WhammyHandler.prototype.index = 0;
WhammyHandler.prototype.base = 0;
WhammyHandler.prototype.mode = 0;// 0:CLASSIC 1:CHORDS 2:DT
WhammyHandler.prototype.outputCommand = 1;// 0:MUTE 1:ACTIVE 2:BYPASS
WhammyHandler.prototype.outputIndex = 0;
WhammyHandler.prototype.list_0 = ['-OCT,+OCT', '-5TH,-4TH', '-4TH,-3RD', '+5TH,+7TH', '+5TH,+6TH', '+4TH,+5TH', '+3RD,+4TH', '+♭3RD,+3RD', '+2ND,+3RD', null, 'SHALLOW'];
WhammyHandler.prototype.list_1 = ['+2 OCT', '+ OCT', '+ 5TH', '+ 4TH', '- 2ND', '- 4TH', '- 5TH', '- OCT', '- 2OCT', 'DIVE BOMB', 'DEEP'];
WhammyHandler.prototype.list_dt_0 = ['1', '2', '3', '4', '5', '6', '7', '<tiny><br><br><sup>OCT</sup><br></tiny>', '<tiny><sup>OCT</sup><br>&#43;<br><sup>DRY</sup></tiny>'];
WhammyHandler.prototype.list_dt_1 = ['1', '2', '3', '4', '5', '6', '7', '<tiny><sup>OCT</sup><br><br></tiny><br>', '<tiny><sup>OCT</sup><br>&#43;<br><sup>DRY</sup><br><br></tiny>'];

WhammyHandler.prototype.init = function () {
	var _this = this;
	this.load();
	this.fillMidiOutputs();

	this.fillColumn(this.list_0, "itemA", $('#column_h'), function (a) { return 20 - a; });
	this.fillColumn(this.list_1, "itemB", $('#column_c'), function (b) { return b; }, 'b');
	this.fill_dt(this.list_dt_0, "itemC", $('#row_up'), function (a) { return a; });
	this.fill_dt(this.list_dt_1, "itemD", $('#row_down'), function (b) { return b; }, 'b');
	$('#btnBase_0').click(function () { _this.base = 0; _this.update() });
	$('#btnBase_1').click(function () { _this.base = 1; _this.update() });
	$('#btnCLASSIC').click(function () { _this.mode = 0; _this.update() });
	$('#btnCHORDS').click(function () { _this.mode = 1; _this.update() });
	$('#btnDT').click(function () { _this.mode = 2; _this.update() });
	$('#btnMUTE').click(function () { _this.outputCommand = 0; _this.update() });
	$('#btnACTIVE').click(function () { _this.outputCommand = 1; _this.update() });
	$('#btnBYPASS').click(function () { _this.outputCommand = 2; _this.update() });
	this.update();
	$(panel).bind('mousewheel', function (e) {
		_this.index += Math.sign(e.originalEvent.wheelDelta);
		_this.update();
	});
	$(pnlBase).bind('mousewheel', function (e) {
		if (e.originalEvent.wheelDelta > 0)
			_this.base = 0;
		else
			_this.base = 1;
		_this.update();
	});
	$(pnlMode).bind('mousewheel', function (e) {
		_this.mode -= Math.sign(e.originalEvent.wheelDelta);
		_this.mode = Math.min(_this.mode, 2);
		_this.mode = Math.max(_this.mode, 0);
		_this.update();
	});
	$(pnlCommand).bind('mousewheel', function (e) {
		_this.outputCommand -= Math.sign(e.originalEvent.wheelDelta);
		_this.outputCommand = Math.min(_this.outputCommand, 2);
		_this.outputCommand = Math.max(_this.outputCommand, 0);
		_this.update();
	});
	$(pnlOutput).bind('mousewheel', function (e) {
		_this.outputIndex -= Math.sign(e.originalEvent.wheelDelta);
		_this.outputIndex = Math.min(_this.outputIndex, MIDI.getOutputs().length - 1);
		_this.outputIndex = Math.max(_this.outputIndex, 0);
		_this.update();
	});
}
WhammyHandler.prototype.fillMidiOutputs = function () {
	var _this = this;
	var outputs = MIDI.getOutputs().sort(function (a, b) { return a.name.localeCompare(b.name); });
	for (var i = 0; i < outputs.length; i++) {
		var output = outputs[i];
		//console.log(output);
		//var text = output.name + ' [' + output.manufacturer + ']';
		var text = output.name;
		var option = $('<div>')
			.prop('id', 'output_' + i)
			.addClass('output_option')
			.addClass('option')
			.data('output-index', i)
			.html(text)
			.css({ 'text-align': 'left', width: '190px' })
			.click(function () {
				_this.outputIndex = $(this).data('output-index');
				_this.update();
			}).appendTo($('#output_options'));
	}
};
WhammyHandler.prototype.update = function () {
	$('#panel').show();
	if (this.mode == 2) {
		$('#pnlWH').hide();
		$('#pnlDT').show();
	}
	else {
		$('#pnlWH').show();
		$('#pnlDT').hide();
	}
	this.save();
	var n = this.mode == 2 ? 18 : 21;
	//index=Math.max(0,index);
	//index=Math.min(20,index);
	this.index = (n + this.index) % n;
	this.mode = (3 + this.mode) % 3;

	$('img.led').attr('src', 'resources/images/led-off.svg');
	$('img.led[name=' + this.index + ']').attr('src', 'resources/images/led-on.svg');
	var offset = 0;
	offset += this.base;
	offset += (this.mode == 0 ? 0 : 1) * 42;

	var value_on = this.index + offset;
	var value_off = value_on + n;
	//$('#result').html("["+value+"]");
	//console.log(value_on)
	if (MIDI !== undefined) {
		var outputs = MIDI.getOutputs();
		if (outputs.length > 0) {
			this.outputIndex = this.outputIndex % outputs.length;
			var output = outputs[this.outputIndex];
			if (this.outputCommand == 1) output.send([0xc0, value_on]);
			if (this.outputCommand == 2) output.send([0xc0, value_off]);
		}
	}
	digit_a_1.src = '../resources/images/seven-segments/' + Math.floor(value_on / 10) + '.svg';
	digit_a_0.src = '../resources/images/seven-segments/' + value_on % 10 + '.svg';

	digit_b_1.src = '../resources/images/seven-segments/' + Math.floor(value_off / 10) + '.svg';
	digit_b_0.src = '../resources/images/seven-segments/' + value_off % 10 + '.svg';
	$('#btnBase_0').toggleClass('selected', this.base == 0);
	$('#btnBase_1').toggleClass('selected', this.base == 1);
	$('#btnCLASSIC').toggleClass('selected', this.mode == 0);
	$('#btnCHORDS').toggleClass('selected', this.mode == 1);
	$('#btnDT').toggleClass('selected', this.mode == 2);
	$('#btnMUTE').toggleClass('selected', this.outputCommand == 0);
	$('#btnACTIVE').toggleClass('selected', this.outputCommand == 1);
	$('#btnBYPASS').toggleClass('selected', this.outputCommand == 2);

	//var outputs = MIDI.getOutputs();
	//console.log(this.outputIndex);
	$('.output_option').removeClass('selected');
	$('[id=output_' + this.outputIndex + ']').addClass('selected');
	//for (var i = 0; i < outputs.length; i++) {
	//	var output = outputs[i];
	//}
}
WhammyHandler.prototype.load = function () {
	this.index = Number(localStorage.getItem('index') || this.index);
	this.base = Number(localStorage.getItem('base') || this.base);
	this.mode = Number(localStorage.getItem('mode') || this.mode);
	this.outputCommand = Number(localStorage.getItem('outputCommand')) || this.outputCommand;
	this.outputIndex = Number(localStorage.getItem('outputIndex')) || this.outputIndex;
};
WhammyHandler.prototype.save = function () {
	localStorage.setItem('index', this.index);
	localStorage.setItem('base', this.base);
	localStorage.setItem('mode', this.mode);
	localStorage.setItem('outputCommand', this.outputCommand);
	localStorage.setItem('outputIndex', this.outputIndex);
};
WhammyHandler.prototype.fill_dt = function (list, cssClass, target, getName, dir) {
	var _this = this;
	var _tr = $('<tr>').appendTo(target);
	_tr.css('vertical-align', dir == 'b' ? 'top' : 'bottom');
	for (var i = 0; i < list.length; i++) {
		var _index = getName(i);
		if (dir == 'b') _index = 17 - _index;
		var _td = $('<td>').appendTo(_tr);
		var table = $('<table>').appendTo(_td);
		table.attr('index', _index);
		table.addClass(cssClass);
		table.click(function () {
			_this.index = Number($(this).attr('index'));
			//console.log(index);
			_this.update();
		});
		var m = 7;
		var margin = i * m;
		if (i == 8) margin = 7 * m;
		if (dir == 'b')
			table.css('margin-top', margin + 'px');
		else
			table.css('margin-bottom', margin + 'px');
		var tr0 = $('<tr>').appendTo(table);
		var tr1 = $('<tr>').appendTo(table);
		var td0 = $('<td>').appendTo(tr0);
		tr1.css('vertical-align', 'top');
		var td1 = $('<td>').appendTo(tr1);
		var img = this.new_led(_index);
		var label = $('<label>' + list[i] + '</label>');
		if (dir == 'b') {
			td1.html(label);
			td0.append(img);
		}
		else {
			td0.html(label);
			td1.append(img);
		}
	}
}

WhammyHandler.prototype.fillColumn = function (list, cssClass, target, getName, dir) {
	var _this = this;
	var skipped = 0;
	for (var i = 0; i < list.length; i++) {
		var _index = getName(i - skipped);
		var div = $('<div>').appendTo(target);
		var table = $('<table>').appendTo(div);
		var tr = $('<tr>').appendTo(table);
		if (!list[i]) {
			skipped++;
			tr.append($('<td><div style="height:21px;"></div></td>'));
			continue;
		}
		div.addClass(cssClass);
		div.attr('index', _index);
		div.click(function () {
			_this.index = Number($(this).attr('index'));
			//console.log(index);
			_this.update();
		});
		var td0 = $('<td>').appendTo(tr);
		var img = this.new_led(_index);
		//$('<img src="resources/images/led-off.svg"/>')
		img.appendTo(td0);
		//img.addClass('led');
		//img.attr('name', _index);
		var td1 = $('<td>').appendTo(tr);
		var label = $('<label>').appendTo(td1);
		var text = list[i].replace(/\+/g, '▲').replace(/-/g, '▼');
		var split = text.split(',');
		for (var j = 0; j < split.length; j++) {
			var span = $('<span>' + split[j] + '</span>').appendTo(label);
			span.css({
				'display': 'inline-block',
				'min-width': '45px',
			});
			if (j == 0 && split.length == 2)
				span.css({
					'color': '#c01b15'
				});
		}

		if (dir == 'b') td0.appendTo(tr);
	}
}

WhammyHandler.prototype.new_led = function (name) {
	return $('<img>')
		.addClass('led')
		.prop('src', 'resources/images/led-off.svg')
		.attr('name', name);
};


