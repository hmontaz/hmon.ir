class MIDINote {
	private _midiNote: number;
	private _noteName: string;
	constructor(midiNote: number) {
		this._midiNote = midiNote;
		this._noteName = this.getNoteName();
	}
	get midiNote(): number {
		return this._midiNote;
	}
	get noteName(): string {
		return this._noteName;
	}
	get octave(): number {
		return Math.floor(this._midiNote / 12) - 2
	}

	public getNoteName(useSharps: boolean = true): string {
		const octave = this.octave;
		const noteNames = useSharps ? ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] : ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
		const name = noteNames[this._midiNote % 12];
		return `${name}${octave}`;
	}

	public static parse(note: string): MIDINote {
		const regex = /([A-G][b#]?)(\d*)/;
		const match = note.match(regex);
		if (!match) throw new Error(`Invalid note format: ${note}`);
		const noteName = match[1];
		const octave = match[2] ? parseInt(match[2]) + 2 : 2; // Default octave is 2
		const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
		const midiNote = noteNames.indexOf(noteName) + (octave + 2) * 12;
		return new MIDINote(midiNote);
	}

	get isBlackKey(): boolean {
		return [1, 3, 6, 8, 10].includes(this._midiNote % 12); // C#, D#, F#, G#, A#
	}

}

export default MIDINote;