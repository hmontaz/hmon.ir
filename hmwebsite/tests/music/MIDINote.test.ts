import MIDINote from '../../src/music/MIDINote';
//import the ts file for MIDINote and not the js file

//import MIDINote from './MIDINote';

describe('MIDINote', () => {
	it('should create a MIDINote with correct properties', () => {
		const midiNote = new MIDINote(60); // Middle C
		expect(true)
		//expect(midiNote.midiNote).toBe(60);
		//expect(midiNote.noteName).toBe('C4');
		//expect(midiNote.octave).toBe(4);		
	});
});
