class Midi {
    constructor() {
        this.midiAccess = null;
        this.onNoteOn = () => { };
        this.onNoteOff = () => { };
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then((access) => {
                this.midiAccess = access;
                this.initInputs();
            }, () => {
                console.error('Could not access your MIDI devices.');
            });
        }
        else {
            console.error('Web MIDI API not supported in this browser.');
        }
    }
    initInputs() {
        if (!this.midiAccess)
            return;
        for (const input of this.midiAccess.inputs.values()) {
            console.log(input.id, input.name);
            //if (input.id != 'input-7') continue;
            //input.onmidimessage = this.handleMIDIMessage.bind(this);			//Build:Type '(event: MIDIMessageEvent) => void' is not assignable to type '(this: MIDIInput, ev: Event) => any'.						 fix this by casting the function to the correct type
            input.onmidimessage = this.handleMIDIMessage.bind(this);
        }
        //const input = this.midiAccess.inputs.values()
        //console.log(input)
    }
    handleMIDIMessage(event) {
        const [status, noteNumber, velocity] = event.data;
        const command = status & 0xf0;
        switch (command) {
            case 0x90: // Note On
                if (velocity > 0) {
                    this.onNoteOn(noteNumber);
                }
                else {
                    this.onNoteOff(noteNumber); // Note On with velocity 0 = Note Off
                }
                break;
            case 0x80: // Note Off
                this.onNoteOff(noteNumber);
                break;
        }
    }
    setNoteOnHandler(callback) {
        this.onNoteOn = callback;
    }
    setNoteOffHandler(callback) {
        this.onNoteOff = callback;
    }
    getInputs() {
        if (!this.midiAccess)
            return [];
        return Array.from(this.midiAccess.inputs.values());
    }
}
export default Midi;
//# sourceMappingURL=MIDI.js.map