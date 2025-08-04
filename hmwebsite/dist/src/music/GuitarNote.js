import MIDINote from "./MIDINote.js";
class GuitarNote {
    constructor(openString, string, fret) {
        if (!openString)
            debugger;
        this.midiNote = new MIDINote(openString.midiNote + fret);
        this.string = string;
        this.fret = fret;
    }
    get midiNumber() {
        return this.midiNote.midiNote;
    }
    getNoteName(useSharps = true) {
        return this.midiNote.getNoteName(useSharps);
    }
}
export default GuitarNote;
//# sourceMappingURL=GuitarNote.js.map