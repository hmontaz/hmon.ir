/// <reference path="jquery_3.2.1_jquery.js" />
/// <reference path="guitarneck.js" />

class RandomGenerator {
	constructor(numberOfStrings, numberOfFrets) {
		this.numberOfStrings = numberOfStrings;
		this.numberOfFrets = numberOfFrets;
	}
	getRange(start, stop, step) {
		step = step || 1;
		return Array.from(
			{ length: (stop - start) / step + 1 },
			(value, index) => start + index * step
		);
	}
	getRandom(max) {
		return Math.floor(Math.random() * max);
	}
	generate(o) {
		//console.log(o);
		var strings = this.getRange(1, this.numberOfStrings);
		var frets = this.getRange(1, this.numberOfFrets);
		//var string_number = strings[this.getRandom(strings.length)];
		//var string_number = 4;
		//var fret_number = frets[this.getRandom(frets.length)];
		//var fret_number = 3;
		//console.clear();
		/*console.log(
			`%c${string_number} @ ${fret_number}`,
			"font-family:sans-serif; font-size: 40px"
		);*/
		//https://www.petercollingridge.co.uk/tutorials/svg/interactive/javascript/
		let result = null;
		while (result == null) {
			result = {
				//stringNumber: strings[this.getRandom(strings.length)],
				//fretNumber: frets[this.getRandom(frets.length)],
				stringNumber: o.stringNumbers[this.getRandom(o.stringNumbers.length)],
				fretNumber: o.fretNumbers[this.getRandom(o.fretNumbers.length)],
			}
			//if (predicate && !predicate(result)) result = null;
		};
		return result;
	}
}
