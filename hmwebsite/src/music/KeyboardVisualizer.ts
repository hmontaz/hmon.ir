// KeyboardVisualizer.ts (with SVG rendering + TurnOn/TurnOff methods)

import MIDINote from "./MIDINote.js";
import SVGTools from "../SVGTools.js";

interface Key {
	midiNote: MIDINote;
	isBlack: boolean;
	midiNumber: number;
	element: SVGElement;
	colorIndex?: number;
}

interface IAvailableColor {
	name: string;
	blackKey: {
		selectedStyle: Record<string, string>;
	},
	whiteKey: {
		selectedStyle: Record<string, string>;
	}
}
interface ITheme {
	whiteKey: {
		unselectedStyle: Record<string, string>;
		width: number;
		height: number;
	}
	blackKey: {
		unselectedStyle: Record<string, string>;
		width: number;
		height: number;
	}
	availableColors: Array<IAvailableColor>;
}
class KeyboardVisualizer {
	private container: HTMLElement;
	private selectedColor: any;// IAvailableColor;
	private keys: Key[] = Array.from({ length: 128 }, () => ({} as Key));

	private startNote: number = 24; // C0
	private endNote: number = 96;  // C5

	private useSharps: boolean = true
	private zoomFactor: number = .9

	private theme: ITheme = {
		whiteKey: {
			unselectedStyle: {
				fill: 'white',
				stroke: '#555',
				strokeWidth: '1px',
			},
			width: 40 * this.zoomFactor,
			height: 160 * this.zoomFactor,
		},
		blackKey: {
			unselectedStyle: {
				fill: 'black',
				stroke: '#555',
				strokeWidth: '1px',
			},
			width: 24 * this.zoomFactor,
			height: 100 * this.zoomFactor,
		},
		availableColors: [
			{
				name: 'Cyan',
				blackKey: {
					selectedStyle: {
						fill: '#33cccc',
					},
				},
				whiteKey: {
					selectedStyle: {
						fill: '#99ffff',
					},
				},
			},
			{
				name: 'Orange',
				blackKey: {
					selectedStyle: {
						fill: '#cc9933',
					},
				},
				whiteKey: {
					selectedStyle: {
						fill: '#ffcc99',
					},
				},
			},
			{
				name: 'Magenta',
				blackKey: {
					selectedStyle: {
						fill: '#cc33cc',
					},
				},
				whiteKey: {
					selectedStyle: {
						fill: '#ff99ff',
					},
				},
			},
			{
				name: 'Red',
				blackKey: {
					selectedStyle: {
						fill: '#cc3333',
					},
				},
				whiteKey: {
					selectedStyle: {
						fill: '#ff9999',
					},
				},
			},
			{
				name: 'Green',
				blackKey: {
					selectedStyle: {
						fill: '#33cc33',
					},
				},
				whiteKey: {
					selectedStyle: {
						fill: '#99ff99',
					},
				},
			},
			{
				name: 'Blue',
				blackKey: {
					selectedStyle: {
						fill: '#3333cc',
					},
				},
				whiteKey: {
					selectedStyle: {
						fill: '#9999ff',
					},
				},
			},
			{
				name: 'Yellow',
				blackKey: {
					selectedStyle: {
						fill: '#cccc33',
					},
				},
				whiteKey: {
					selectedStyle: {
						fill: '#ffff99',
					},
				},
			},
		],

	}

	constructor(containerId: string) {
		const container = document.getElementById(containerId);
		if (!container) throw new Error(`Container with ID '${containerId}' not found`);
		this.container = container;
		this.selectedColor = this.theme.availableColors[0]
		this.render();
	}

	public render(): void {
		this.container.innerHTML = '';
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		const offset = this.getKeyX(new MIDINote(this.startNote));

		//Render white keys
		for (let midi = this.startNote; midi <= this.endNote; midi++) {
			const midiNote = new MIDINote(midi);
			const noteName = midiNote.noteName;
			const isBlack = midiNote.isBlackKey;
			if (isBlack) continue;
			const x = this.getKeyX(midiNote) - offset;
			const rect = this.createKey(x, 0, this.theme.whiteKey.width, this.theme.whiteKey.height, 'white', noteName);
			this.keys[midi] = { isBlack, midiNumber: midi, midiNote: new MIDINote(midi), element: rect };

			svg.appendChild(rect);
		}
		//Render black keys
		for (let midi = this.startNote; midi <= this.endNote; midi++) {
			const midiNote = new MIDINote(midi);
			const noteName = midiNote.noteName;
			const isBlack = midiNote.isBlackKey;
			if (!isBlack) continue;
			const x = this.getKeyX(midiNote) - offset;
			const rect = this.createKey(x, 0, this.theme.blackKey.width, this.theme.blackKey.height, 'black', noteName);
			this.keys[midi] = { isBlack, midiNumber: midi, midiNote: new MIDINote(midi), element: rect };
			svg.appendChild(rect);
		}

		svg.setAttribute('height', this.theme.whiteKey.height.toString());
		svg.setAttribute('width', this.getKeyX(new MIDINote(this.endNote + 1)).toString());
		this.container.appendChild(svg);
	}

	private getKeyX(midiNote: MIDINote): number {
		const isBlack = midiNote.isBlackKey;
		const noteInOctave = midiNote.midiNote % 12;
		const octave = midiNote.octave

		// Total number of white keys before this midi number
		const totalWhiteKeysBefore = octave * 7 + [0, 2, 4, 5, 7, 9, 11].filter(n => n < noteInOctave).length;


		if (!isBlack) {
			return totalWhiteKeysBefore * this.theme.whiteKey.width;
		}

		// Horizontal offset between adjacent white keys
		return totalWhiteKeysBefore * this.theme.whiteKey.width - this.theme.blackKey.width / 2;
	}

	private createKey(x: number, y: number, width: number, height: number, type: 'white' | 'black', noteName: string): SVGElement {
		const radius = 3; // Corner radius for the rounded rectangle

		const d = `M${x},${y}H${x + width}V${y + height - radius}Q${x + width},${y + height} ${x + width - radius},${y + height}H${x + radius}Q${x},${y + height} ${x},${y + height - radius}V${y}Z`;

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', d);
		path.setAttribute('data-note', noteName);
		path.style.cursor = 'pointer';

		SVGTools.expandStyle(path, type === 'black' ? this.theme.blackKey.unselectedStyle : this.theme.whiteKey.unselectedStyle)

		/*path.addEventListener('click', () => {
			path.classList.toggle('selected');
			const isSelected = path.classList.contains('selected');
			if (isSelected) {
				this.expandStyle(path, type === 'black' ? this.selectedColor.selected.blackKeyStyle : this.selectedColor.selected.whiteKeyStyle)
				this.selectedNotes.add(noteName);
			} else {
				path.setAttribute('fill', type === 'black' ? 'black' : 'white');
				this.selectedNotes.delete(noteName);
			}
		});*/

		return path;
	}

	public turnNoteOn(midiNumber: number): void {
		const key = this.keys[midiNumber];
		if (!key) return;
		key.colorIndex = this.theme.availableColors.findIndex(color => color.name === this.selectedColor.name);
		this.updateKeyboard()
	}

	public turnNoteOff(midiNumber: number): void {
		const key = this.keys[midiNumber];
		if (!key) return;
		key.colorIndex = undefined;
		this.updateKeyboard()
	}

	public clearKeys(): void {
		for (let midiNumber = 0; midiNumber <= 127; midiNumber++) {
			const key = this.keys[midiNumber];
			if (!key?.element) continue;
			key.colorIndex = undefined;
		}
		this.updateKeyboard()
	}

	public setColor(name: string): void {
		this.selectedColor = this.theme.availableColors.find(color => color.name === name);
	}

	private updateKeyboard(): void {
		for (let midiNumber = 0; midiNumber <= 127; midiNumber++) {
			const key = this.keys[midiNumber];
			if (!key?.element) continue;

			if (key.colorIndex !== undefined) {
				const color = this.theme.availableColors[key.colorIndex];
				SVGTools.expandStyle(key.element, key.isBlack ? color.blackKey.selectedStyle : color.whiteKey.selectedStyle)
			} else {
				SVGTools.expandStyle(key.element, key.isBlack ? this.theme.blackKey.unselectedStyle : this.theme.whiteKey.unselectedStyle)
			}
		}
	}
}

export default KeyboardVisualizer;
