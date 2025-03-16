//type MidiAPI = {
//	AllChannels: number[];
//	getOutputs: () => MidiOutput[];
//};
//declare const MIDI: MidiAPI;
class MIDI {
    constructor() {
        this.midiAccess = null;
        this.output = null;
        //this.init();
    }
    init(callback) {
        if (navigator.requestMIDIAccess) {
            console.log('This browser supports WebMIDI!');
            navigator.requestMIDIAccess().then((midiAccess) => {
                this.midiAccess = midiAccess;
                const outputs = Array.from(midiAccess.outputs.values());
                this.output = outputs.length > 0 ? outputs[0] : null;
                //console.log(outputs);
                //console.log(this.output);
                if (callback)
                    callback();
            }, () => {
                this.midiAccess = null;
                console.log('Could not access your MIDI devices.');
                if (callback)
                    callback();
            });
        }
        else {
            console.log('WebMIDI is not supported in this browser.');
            if (callback)
                callback();
        }
    }
    /*send(data: number[]): void {
      if (!this.output) return;
      //this.output.send([0xC1, 49]);
      this.output.send(data);
    }*/
    getOutputs() {
        if (!this.midiAccess)
            return [];
        return Array.from(this.midiAccess.outputs.values());
    }
}
MIDI.Channel_0 = 0xC0;
MIDI.Channel_1 = 0xC1;
MIDI.Channel_2 = 0xC2;
MIDI.Channel_3 = 0xC3;
MIDI.Channel_4 = 0xC4;
MIDI.Channel_5 = 0xC5;
MIDI.Channel_6 = 0xC6;
MIDI.Channel_7 = 0xC7;
MIDI.Channel_8 = 0xC8;
MIDI.Channel_9 = 0xC9;
MIDI.Channel_10 = 0xCA;
MIDI.Channel_11 = 0xCB;
MIDI.Channel_12 = 0xCC;
MIDI.Channel_13 = 0xCD;
MIDI.Channel_14 = 0xCE;
MIDI.Channel_15 = 0xCF;
MIDI.AllChannels = Array.from({ length: 0xCF - 0xC0 + 1 }, (_, i) => 0xC0 + i);
//export default MIDI;
//# sourceMappingURL=MIDIHelper.js.map