var MIDI = {
	Channel_0: 0xC0,
	Channel_1: 0xC1,
	Channel_2: 0xC2,
	Channel_3: 0xC3,
	Channel_4: 0xC4,
	Channel_5: 0xC5,
	Channel_6: 0xC6,
	Channel_7: 0xC7,
	Channel_8: 0xC8,
	Channel_9: 0xC9,
	Channel_10: 0xCa,
	Channel_11: 0xCb,
	Channel_12: 0xCc,
	Channel_13: 0xCd,
	Channel_14: 0xCe,
	Channel_15: 0xCf,
	init: function (callback) {
		var _this = this;
		if (navigator.requestMIDIAccess) {
			console.log('This browser supports WebMIDI!');
			navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

			function onMIDISuccess(midiAccess) {
				//console.log(midiAccess);
				_this.midiAccess = midiAccess;
				var inputs = midiAccess.inputs;
				var outputs = midiAccess.outputs;

				var array = Array.from(outputs.values());
				_this.output = array[0];
				//console.log(array);
				//console.log(_this.output);
				if (callback) callback.call(_this);
			}

			function onMIDIFailure() {
				_this.midiAccess = null;
				console.log('Could not access your MIDI devices.');
				if (callback) callback.call(_this);
			}


		} else {
			console.log('WebMIDI is not supported in this browser.');
			if (callback) callback.call(_this);
		}
	},
	/*send: function (data) {
		if (!this.output) return;
		//this.output.send([0xC1, 49]);
		this.output.send(data);
	},*/
	getOutputs: function () {
		if (!this.midiAccess) return [];
		var array = Array.from(this.midiAccess.outputs.values());
		return array;
	},

};