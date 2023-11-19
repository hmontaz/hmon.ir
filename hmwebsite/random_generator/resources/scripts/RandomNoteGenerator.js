class RandomNoteGenerator {
    constructor() {
        //this.notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'
        //	, 'A#'/*,'B#'*/, 'C#', 'D#' /*'E#'*/, 'F#', 'G#'
        //	, 'Ab', 'Bb'/*, 'Cb'*/, 'Db', 'Eb'/*, 'Fb'*/, 'Gb']
    }
    getRange(start, stop, step) {
        step = step || 1;
        let result = new Array((stop - start) / step + 1);
        for (let i = 0; i < result.length; i++) {
            result[i] = start + i * step;
        }
        return result;
    }
    getRandom(max) {
        return Math.floor(Math.random() * max);
    }
    generate() {
        let index = this.getRandom(11);
        let note = new MusicalNote();
        note.addSemitones(index, this.getRandom(10) > 5);
        return note.toString();
    }
}
//# sourceMappingURL=RandomNoteGenerator.js.map