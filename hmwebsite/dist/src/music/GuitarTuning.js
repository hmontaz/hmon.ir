import MIDINote from "./MIDINote.js";
import GuitarNote from "./GuitarNote.js";
class GuitarTuning {
    constructor(tuning) {
        this.tuning = tuning.map(midiNote => new MIDINote(midiNote));
    }
    newGuitarNote(string, fret) {
        return new GuitarNote(this.tuning[string], string, fret);
    }
}
export default GuitarTuning;
//# sourceMappingURL=GuitarTuning.js.map