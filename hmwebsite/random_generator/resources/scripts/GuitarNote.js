/// <reference path="guitarneck.js" />

class GuitarNote {
	constructor(guitarNeck, stringNumber, fretNumber) {
		this.guitarNeck = guitarNeck;
		this.stringNumber = stringNumber;
		this.fretNumber = fretNumber;
		//--------------
		this.initialize()
	}
	initialize() {
		let neck = this.guitarNeck;
		let o = neck.options;
		let size = (neck.getStringSpace() - o.fretWidth) * .9
		let fretIndex = this.fretNumber - 1;
		let x = neck.getFretCX(fretIndex) + neck.getFretWidth(fretIndex) / 2 - neck.getNeckWidth() / 2;
		let y = neck.getStringCY(this.stringNumber - 1) - neck.getNeckHeight() / 2

		this.group = neck.newElement('g')
			.appendTo(neck.svg)
			.attr({
				transform: `translate(${x},${y})`,
			});
		this.circleElement = neck.newElement('circle')
			.css({
				fill: '#ddd',
				opacity: .5,
				'stroke-width': .8,
				stroke: 'black',
			})
			.attr({
				cx: '50%',
				cy: '50%',
				r: size * .6,
			}).appendTo(this.group);
		this.textElement = neck.newElement('text')
			.attr({
				x: '50%',
				y: '50%',
				'dy': '0.3em',
				'text-anchor': 'middle',
				textLength: size,
			})
			.css({
				'font-size': size * .7
			})
			.appendTo(this.group);

		this.note = neck.addSemitones(o.openStrings[this.stringNumber - 1], this.fretNumber);
		this.setText(this.note);
	}
	setText(text) {
		this.text = text
		this.textElement.html(text.replace('#', '♯').replace('b', '♭'))
	}
	remove() {
		this.circleElement.remove()
		this.textElement.remove()
	}
	hide() {
		this.circleElement.hide()
		this.textElement.hide()
	}
}