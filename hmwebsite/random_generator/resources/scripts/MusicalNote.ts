type Acctidental = '' | '#' | '♯' | '♭' | 'b' | '♮'
type NoteName = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
class MusicalNote {
	noteName: NoteName
	accidental: Acctidental
	constructor(noteName: NoteName = 'C', accidental: Acctidental = '') {
		this.noteName = noteName
		this.accidental = accidental
	}
	static parse(note: string): MusicalNote {
		let noteName = note[0]
		let accidental = note[1]
		switch (accidental) {
			case '#':
			case '♯':
				accidental = '♯'
				break
			case 'b':
			case '♭':
				accidental = '♭'
				break
			case '♮':
				accidental = '♮'
				break
			default: accidental = ''
		}

		return new MusicalNote(noteName as NoteName, accidental as Acctidental)
	}
	addSemitones(n: number, useFlats?: boolean): void {
		//♭♯		
		let index = 'A_BC_D_EF_G_'.indexOf(this.noteName);
		if (this.accidental == '♯') index++;
		if (this.accidental == '♭') index--;
		index += n;
		index = index % 12
		let result = ''
		if (useFlats) result = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'][index]
		else result = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'][index]

		let temp = MusicalNote.parse(result)
		this.noteName = temp.noteName
		this.accidental = temp.accidental
	}
	toString(): string {
		return this.noteName + this.accidental
	}
}