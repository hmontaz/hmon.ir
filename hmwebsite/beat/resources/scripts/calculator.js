var BeatCalculator = {
	base: 4,//4=quarter,8=eighth,16=sixteenth
	factor: 1,//1, 1.5 (dotted), 2/3 (triplet)
	bpm: 60,
	min_bpm: 10,
	max_bpm: 800,
	init: function () {
		var _this = this;
		$('img.digit').bind('mousewheel', function (e) {
			var v = Number($(e.target).attr('value'));
			var value = Math.sign(e.originalEvent.wheelDelta) * v;
			var t = e.target.id[0];
			if (t === 'a') _this.add_bpm(value);
			if (t === 'b') _this.add_ms(value);
			//index+=Math.sign(e.originalEvent.wheelDelta);
			//update();
		});
		$('#btn_base_1').click(function () { _this.setBase(1); });
		$('#btn_base_2').click(function () { _this.setBase(2); });
		$('#btn_base_4').click(function () { _this.setBase(4); });
		$('#btn_base_8').click(function () { _this.setBase(8); });
		$('#btn_base_16').click(function () { _this.setBase(16); });
		$('#btn_base_32').click(function () { _this.setBase(32); });

		$('#btn_factor_1').click(function () { _this.setFactor(1); });
		$('#btn_factor_d').click(function () { _this.setFactor(1.5); });
		$('#btn_factor_t').click(function () { _this.setFactor(2 / 3); });

		this.led_base_1 = $('#led_base_1');
		this.led_base_2 = $('#led_base_2');
		this.led_base_4 = $('#led_base_4');
		this.led_base_8 = $('#led_base_8');
		this.led_base_16 = $('#led_base_16');
		this.led_base_32 = $('#led_base_32');

		this.led_factor_1 = $('#led_factor_1');
		this.led_factor_d = $('#led_factor_d');
		this.led_factor_t = $('#led_factor_t');
		this.setBase();
		this.setFactor();
		this.show_values();
	},
	led_base_url: '../resources/images/leds',
	seven_segment_path: '../resources/images/seven-segments/',
	setBase: function (value) {
		this.base = value || this.base;
		this.led_base_1.attr('src', `${this.led_base_url}/rect-red-${this.base === 1 ? 'on' : 'off'}.svg`);
		this.led_base_2.attr('src', `${this.led_base_url}/rect-red-${this.base === 2 ? 'on' : 'off'}.svg`);
		this.led_base_4.attr('src', `${this.led_base_url}/rect-red-${this.base === 4 ? 'on' : 'off'}.svg`);
		this.led_base_8.attr('src', `${this.led_base_url}/rect-red-${this.base === 8 ? 'on' : 'off'}.svg`);
		this.led_base_16.attr('src', `${this.led_base_url}/rect-red-${this.base === 16 ? 'on' : 'off'}.svg`);
		this.led_base_32.attr('src', `${this.led_base_url}/rect-red-${this.base === 32 ? 'on' : 'off'}.svg`);
		this.show_values();
	},
	setFactor: function (factor) {
		this.factor = factor || this.factor;
		this.led_factor_1.attr('src', `${this.led_base_url}/rect-green-${this.factor === 1 ? 'on' : 'off'}.svg`);
		this.led_factor_d.attr('src', `${this.led_base_url}/rect-green-${this.factor === 1.5 ? 'on' : 'off'}.svg`);
		this.led_factor_t.attr('src', `${this.led_base_url}/rect-green-${this.factor === 2 / 3 ? 'on' : 'off'}.svg`);

		this.show_values();
	},
	error_blink: function (n) {
		var _this = this;
		if (n === undefined) n = 1;
		if (n == 0) return;
		$('img[id^=a_]').attr('src', this.seven_segment_path + 'off.svg');
		$('img[id^=b_]').attr('src', this.seven_segment_path + 'off.svg');
		var ms = 125;
		setTimeout(function () {
			_this.show_values();
			setTimeout(function () { _this.error_blink(n - 1); }, ms);
		}, ms);
	},
	get_ms: function (bpm) {
		bpm = bpm || this.bpm;
		var ms = 1000 * 60 * this.factor * 4 / (bpm * this.base);
		return ms;
	},
	get_bpm: function (ms) {
		return (10 * 60 * 1000 / ms) * 4 * this.factor / (10 * this.base);
	},
	set_ms: function (ms) {
		var _this = this;
		//if (ms >= 61 && ms <= 8751) {
		//	this.bpm = this.get_bpm(ms);
		//	this.show_values();
		//} else {
		//	this.error_blink(2);
		//}
		var bpm = this.get_bpm(ms)
		this.set_bpm(bpm);
	},
	set_bpm: function (bpm) {
		var _this = this;
		//if (bpm >= 7 && bpm <= 983.6) {
		if (bpm < this.min_bpm || bpm > this.max_bpm + .0001) {
			this.error_blink(2);
			return;
		}
		this.bpm = bpm;
		this.show_values();
	},
	add_ms: function (value) {
		var ms = this.get_ms();
		this.set_ms(ms + value);
	},
	add_bpm: function (value) {
		this.set_bpm(this.bpm + value);
	},
	get_digits: function (num, len, fractionDigits) {
		var _this = this;
		fractionDigits = fractionDigits || 0
		let factor = 10 ** fractionDigits
		num = Math.round(num * factor) / factor;
		var s = num.toFixed(fractionDigits).toString().padStart(len, '0');
		if (s.indexOf('.') !== -1)
			s = s.padStart(len + 1, '0');
		var list = [];
		var found_non_zero = false;
		for (var i = 0; i < s.length; i++) {
			var c = s[i];
			if (c !== '0') found_non_zero = true;
			if ('0123456789'.indexOf(c) !== -1) {
				if (c !== '0' || found_non_zero)
					list.push(c);
				else
					list.push('off');
			}
			if (list.length > 0 && c === '.')
				list[list.length - 1] += 'd';
		}
		return list.map(function (a) {
			return _this.seven_segment_path + a + '.svg';
		});
	},
	show_values: function () {
		var digits_bpm = this.get_digits(this.bpm, 4, 1);
		$('#a_0').attr('src', digits_bpm[0]);
		$('#a_1').attr('src', digits_bpm[1]);
		$('#a_2').attr('src', digits_bpm[2]);
		$('#a_3').attr('src', digits_bpm[3]);

		var ms = this.get_ms();
		var digits_ms = this.get_digits(ms, 5);
		$('#b_0').attr('src', digits_ms[0]);
		$('#b_1').attr('src', digits_ms[1]);
		$('#b_2').attr('src', digits_ms[2]);
		$('#b_3').attr('src', digits_ms[3]);
		$('#b_4').attr('src', digits_ms[4]);
	},
};