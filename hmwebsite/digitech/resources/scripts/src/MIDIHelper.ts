//type MidiAPI = {
//	AllChannels: number[];
//	getOutputs: () => MidiOutput[];
//};
//declare const MIDI: MidiAPI;

type MIDIAccessCallback = () => void;

class MIDI {
	midiAccess: MIDIAccess | null = null;
	output: MIDIOutput | null = null;

	static readonly Channel_0 = 0xC0;
	static readonly Channel_1 = 0xC1;
	static readonly Channel_2 = 0xC2;
	static readonly Channel_3 = 0xC3;
	static readonly Channel_4 = 0xC4;
	static readonly Channel_5 = 0xC5;
	static readonly Channel_6 = 0xC6;
	static readonly Channel_7 = 0xC7;
	static readonly Channel_8 = 0xC8;
	static readonly Channel_9 = 0xC9;
	static readonly Channel_10 = 0xCA;
	static readonly Channel_11 = 0xCB;
	static readonly Channel_12 = 0xCC;
	static readonly Channel_13 = 0xCD;
	static readonly Channel_14 = 0xCE;
	static readonly Channel_15 = 0xCF;
	static readonly AllChannels = Array.from({ length: 0xCF - 0xC0 + 1 }, (_, i) => 0xC0 + i);

	constructor() {
		//this.init();
	}

	init(callback?: MIDIAccessCallback): void {
		if (navigator.requestMIDIAccess) {
			console.log('This browser supports WebMIDI!');
			navigator.requestMIDIAccess().then(
				(midiAccess) => {
					this.midiAccess = midiAccess;
					const outputs = Array.from(midiAccess.outputs.values());
					this.output = outputs.length > 0 ? outputs[0] : null;
					//console.log(outputs);
					//console.log(this.output);
					if (callback) callback();
				},
				() => {
					this.midiAccess = null;
					console.log('Could not access your MIDI devices.');
					if (callback) callback();
				}
			);
		} else {
			console.log('WebMIDI is not supported in this browser.');
			if (callback) callback();
		}
	}

	/*send(data: number[]): void {
	  if (!this.output) return;
	  //this.output.send([0xC1, 49]);
	  this.output.send(data);
	}*/

	getOutputs(): MIDIOutput[] {
		if (!this.midiAccess) return [];
		return Array.from(this.midiAccess.outputs.values());
	}
}

//export default MIDI;

