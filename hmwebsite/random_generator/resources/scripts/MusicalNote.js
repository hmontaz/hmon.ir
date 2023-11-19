class MusicalNote {
    constructor(noteName = 'C', accidental = '') {
        this.noteName = noteName;
        this.accidental = accidental;
    }
    static parse(note) {
        let noteName = note[0];
        let accidental = note[1];
        switch (accidental) {
            case '#':
            case '♯':
                accidental = '♯';
                break;
            case 'b':
            case '♭':
                accidental = '♭';
                break;
            case '♮':
                accidental = '♮';
                break;
            default: accidental = '';
        }
        return new MusicalNote(noteName, accidental);
    }
    addSemitones(n, useFlats) {
        //♭♯		
        let index = 'A_BC_D_EF_G_'.indexOf(this.noteName);
        if (this.accidental == '♯')
            index++;
        if (this.accidental == '♭')
            index--;
        index += n;
        index = index % 12;
        let result = '';
        if (useFlats)
            result = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'][index];
        else
            result = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'][index];
        let temp = MusicalNote.parse(result);
        this.noteName = temp.noteName;
        this.accidental = temp.accidental;
    }
    toString() {
        return this.noteName + this.accidental;
    }
}
//# sourceMappingURL=MusicalNote.js.map