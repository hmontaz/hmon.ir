import MIDINote from "./MIDINote.js";

class GuitarNote {
	private midiNote: MIDINote;
	private string: number;
	private fret: number;
	constructor(openString: MIDINote, string: number, fret: number) {
		if (!openString) debugger
		this.midiNote = new MIDINote(openString.midiNote + fret);
		this.string = string;
		this.fret = fret;
	}

	public get midiNumber(): number {
		return this.midiNote.midiNote;
	}

	public getNoteName(useSharps: boolean = true): string {
		return this.midiNote.getNoteName(useSharps);
	}
}

export default GuitarNote;