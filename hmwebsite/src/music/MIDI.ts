class Midi {
	private midiAccess: MIDIAccess | null = null;
	private onNoteOn: (noteNumber: number) => void = () => { };
	private onNoteOff: (noteNumber: number) => void = () => { };

	constructor() {
		if (navigator.requestMIDIAccess) {
			navigator.requestMIDIAccess().then(
				(access) => {
					this.midiAccess = access;
					this.initInputs();
				},
				() => {
					console.error('Could not access your MIDI devices.');
				}
			);
		} else {
			console.error('Web MIDI API not supported in this browser.');
		}
	}

	private initInputs(): void {
		if (!this.midiAccess) return;
		for (const input of this.midiAccess.inputs.values()) {
			console.log(input.id, input.name)
			//if (input.id != 'input-7') continue;
			//input.onmidimessage = this.handleMIDIMessage.bind(this);			//Build:Type '(event: MIDIMessageEvent) => void' is not assignable to type '(this: MIDIInput, ev: Event) => any'.						 fix this by casting the function to the correct type
			input.onmidimessage = this.handleMIDIMessage.bind(this) as (this: MIDIInput, ev: Event) => any;
		}
		//const input = this.midiAccess.inputs.values()
		//console.log(input)
	}

	private handleMIDIMessage(event: MIDIMessageEvent): void {
		const [status, noteNumber, velocity] = event.data;
		const command = status & 0xf0;

		switch (command) {
			case 0x90: // Note On
				if (velocity > 0) {
					this.onNoteOn(noteNumber);
				} else {
					this.onNoteOff(noteNumber); // Note On with velocity 0 = Note Off
				}
				break;
			case 0x80: // Note Off
				this.onNoteOff(noteNumber);
				break;
		}
	}

	public setNoteOnHandler(callback: (noteNumber: number) => void): void {
		this.onNoteOn = callback;
	}

	public setNoteOffHandler(callback: (noteNumber: number) => void): void {
		this.onNoteOff = callback;
	}

	public getInputs(): MIDIInput[] {
		if (!this.midiAccess) return [];
		return Array.from(this.midiAccess.inputs.values());
	}
}

export default Midi;
