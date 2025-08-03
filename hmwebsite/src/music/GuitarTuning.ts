import MIDINote from "./MIDINote.js";
import GuitarNote from "./GuitarNote.js";

class GuitarTuning {
	private tuning: MIDINote[];
	constructor(tuning: number[]) {
		this.tuning = tuning.map(midiNote => new MIDINote(midiNote));
	}

	public newGuitarNote(string: number, fret: number): GuitarNote {
		return new GuitarNote(this.tuning[string], string, fret);
	}
}

export default GuitarTuning;