/// <reference path="guitarnote.js" />

class GuitarNeck {
	constructor(o) {
		const defaults = {
			container: null,//mandatory
			numberOfStrings: 6,
			numberOfFrets: 24,
			neckWidth: 800,
			neckHeight: 120,
			neckMargin: 3,
			fretboardColor: 'hsl(40,65%,55%)',
			fretWidth: 4,
			firstFretWidth: 64.23,
			verticalPadding: 20,
			horizonalPadding: 30,
			fretColor: '#777',
			inlayColor: '#8a8a8a',
			inlayRadius: 6,
			openStrings: ['E', 'B', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'],
			stringGauge: [9, 11, 16, 24, 34, 49, 64, 80, 108],
			stringColor: '#333',
			stringGaugeRatio: 1 / 30,
			bgColor: 'black',
		}
		this.options = { ...defaults, ...o };
		//---------
		//Draw
		//console.log(this.options)
		this.initialize()
	}
	initialize() {
		const o = this.options
		const width = this.getNeckWidth();
		const height = this.getNeckHeight();
		this.container = o.container;// $('#guitar-neck-container')
		this.svg = this.newElement('svg')
			.attr({ viewBox: `0 0 ${width} ${height}` })
			.appendTo(this.container)
		this.background = this.newElement('rect')
			.attr({
				width: width,
				height: height,
				fill: o.bgColor
			}).appendTo(this.svg)
		this.fretboard = this.newElement('rect')
			.attr({
				x: o.horizonalPadding - o.fretWidth / 2,
				y: o.verticalPadding,
				width: width,
				height: o.neckHeight,
				fill: o.fretboardColor
			}).appendTo(this.svg)

		this.initInlays();
		this.initFrets();
		this.initStrings();
		//All Notes
		let frets = [9];
		let string = null;
		this.notes = [];
		/*for (var f = 0; f <= o.numberOfFrets; f++) {
			if (frets && frets.indexOf(f) == -1) continue
			for (var s = 1; s <= o.numberOfStrings; s++) {
				if (string && string.indexOf(s) == -1) continue
				var note = new GuitarNote(this, s, f)
				//if (note.text.length > 1) note.remove()
			}
		}*/
	}
	getNeckWidth() {
		const o = this.options;
		return o.neckWidth + 2 * o.horizonalPadding
	}
	getNeckHeight() {
		const o = this.options;
		return o.neckHeight + 2 * o.verticalPadding
	}
	initFrets() {
		const o = this.options;
		for (var i = 0; i <= o.numberOfFrets; i++) {
			var fret = this.newElement('rect').attr({
				//x: i * o.neckWidth / o.numberOfFrets + o.horizonalPadding - o.fretWidth / 2,
				x: this.getFretCX(i) - o.fretWidth / 2,
				y: o.verticalPadding,
				width: o.fretWidth,
				height: o.neckHeight,
				fill: o.fretColor,
			}).appendTo(this.svg).click(function (e) { $(this).hide() });
		}
	}
	initInlays() {
		const o = this.options;
		for (var i = 0; i < o.numberOfFrets; i++) {
			let offsetX = this.getFretWidth(i) / 2
			let offsetY = 0;
			if ([12].indexOf((i % 12) + 1) != -1) {
				offsetY = 20;
				this.newElement('circle').attr({
					cx: this.getFretCX(i) + offsetX,
					cy: this.getFretCY(i) + offsetY,
					fill: o.inlayColor,
					r: o.inlayRadius,
				}).appendTo(this.svg);

			}
			if ([3, 5, 7, 9, 12].indexOf((i % 12) + 1) != -1)
				this.newElement('circle').attr({
					cx: this.getFretCX(i) + offsetX,
					cy: this.getFretCY(i) - offsetY,
					fill: o.inlayColor,
					r: o.inlayRadius,
				}).appendTo(this.svg);
		}
	}
	initStrings() {
		const o = this.options;
		for (var i = 0; i < o.numberOfStrings; i++) {
			let gauge = o.stringGauge[i] * o.stringGaugeRatio;
			let string_cy = this.getStringCY(i)
			var s = this.newElement('rect').attr({
				x: o.horizonalPadding - o.fretWidth / 2,
				y: string_cy - gauge / 2,
				width: o.neckWidth + o.fretWidth + o.horizonalPadding,
				height: gauge,
				fill: o.stringColor,
			}).appendTo(this.svg);
		}
	}
	getFretWidth(index) {
		const o = this.options;
		return .94 ** index * o.firstFretWidth;// o.neckWidth / o.numberOfFrets;
	}
	getFretCX(index) {
		const o = this.options;
		//const fretWidth = o.neckWidth / o.numberOfFrets;
		//return o.horizonalPadding + (.8 * index + .5) * fretWidth;
		var result = 0;
		for (var i = 0; i < index; i++) {
			result += this.getFretWidth(i)
		}
		return o.horizonalPadding + result;
	}
	getFretCY() {
		const o = this.options;
		return o.neckHeight / 2 + o.verticalPadding;
	}
	getStringCY(index) {
		const o = this.options;
		const stringSpace = this.getStringSpace();
		return index * stringSpace + o.verticalPadding + o.neckMargin;
	}
	getStringSpace() {
		const o = this.options;
		return (o.neckHeight - 2 * o.neckMargin) / (o.numberOfStrings - 1)
	}
	newElement(tagName) {

		return $(document.createElementNS('http://www.w3.org/2000/svg', tagName));

	}
	addSemitones(note, n, useFlats) {
		//♭♯
		let noteName = note[0]
		let index = 'A_BC_D_EF_G_'.indexOf(noteName)
		if (note.endsWith('#')) index++
		index += n
		index = index % 12;
		if (useFlats) return ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'][index];
		return ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'][index];
	}
	clear() {
		for (var i = 0; i < this.notes.length; i++) {
			this.notes[i].remove()
		}
		this.notes.splice(0)
	}
	addNote(stringNumber, fretNumber, text) {
		var note = new GuitarNote(this, stringNumber, fretNumber);
		this.notes.push(note);
		if (text) note.setText(text)
		return note;
	}
}