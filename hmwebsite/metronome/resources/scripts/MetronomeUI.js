class MetronomeUI {
	metronome = null;
	constructor(o) {
		var _this = this;
		this.metronome = o.metronome;
		$(document).keyup(function (e) {
			_this.handleKey(e);
		});
		//https://codepen.io/emilcarlsson/pen/PPNLPy
		$('#div_volume').slider({
			min: 0,
			max: 100,
			value: metronome.volume * 100,
			//orientation: 'vertical',
			//range: true,
			range: 'min',
			slide: function (e, ui) {
				//console.log(e);
				_this.metronome.setVolume(ui.value / 100);
				_this.update();
			}
		});
		$('#div_volume_container').on('mousewheel', function (e) {
			//console.log(e);
			var value = _this.metronome.volume - Math.sign(e.originalEvent.deltaY) * .01;
			_this.metronome.setVolume(value);
			_this.update();
		});

		this.update();

	}

	update() {
		$('#div_tempo').html(this.metronome.tempo);
		$('#div_volume_container').attr('title', Math.round(this.metronome.volume * 100));
		$("#div_volume").slider('value', this.metronome.volume * 100);
	}
	handleKey(e) {
		//console.log(e);
		if (e.ctrlKey) return;
		if (e.shiftKey) return;
		if (e.altKey) return;
		var key = e.key;
		if (key == '+') this.metronome.setTempo(metronome.tempo + 5);
		if (key == '-') this.metronome.setTempo(metronome.tempo - 5);
		if (key == '0') this.metronome.setTempo(100);
		if (key == ' ') this.metronome.toggle();
		this.update();
	}
}
