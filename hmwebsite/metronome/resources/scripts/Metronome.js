var Metronome = function () {
	this.timer = null;
	this.beatCount = 0;
	this.tempo = 100;
	this.volume = 1;
}
Metronome.prototype.__defineGetter__('running', function () {
	return this.timer != null;
});
Metronome.prototype.start = function (skipFirst) {
	var _this = this;
	if (this.running) return;
	var interval = 1000 * 60 / this.tempo;
	//console.log(interval);
	if (!skipFirst) this.play();
	this.timer = setInterval(function () { _this.play(); }, interval);
	this.running = true;
};
Metronome.prototype.stop = function (resetBeatCount) {
	clearInterval(this.timer);
	this.timer = null;
	if (resetBeatCount) this.beatCount = 0;
};
Metronome.prototype.toggle = function () {
	if (this.running)
		this.stop(true);
	else
		this.start();
}

Metronome.prototype.play = function () {
	//var base_path = 'resources/audio/style-woodblock';
	var base_path = 'resources/audio/style-02';

	var path = base_path + '/click-low.wav';
	//if (this.beatCount++ % 4 == 0) path = base_path + '/click-hi.wav';
	var audio = new Audio(path);
	audio.volume = this.volume;
	audio.play();
	if (this.play_callback) this.play_callback();
};
Metronome.prototype.setTempo = function (tempo) {
	var _this = this;
	this.tempo = tempo;
	if (this.running)
		this.play_callback = function () {
			_this.play_callback = null;
			_this.stop();
			_this.start(true);
		}
}

Metronome.prototype.setVolume = function (volume) {
	this.volume = volume;
}