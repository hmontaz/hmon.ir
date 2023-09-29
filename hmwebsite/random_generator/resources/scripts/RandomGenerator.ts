/* <reference path="GuitarNeck.js" />*/
class RandomGenerator {
	numberOfStrings: number;
	numberOfFrets: number;
	constructor(numberOfStrings, numberOfFrets) {
		this.numberOfStrings = numberOfStrings;
		this.numberOfFrets = numberOfFrets;
	}
	getRange(start: number, stop: number, step?: number): number[] {
		step = step || 1;
		let result = new Array<number>((stop - start) / step + 1);
		for (let i = 0; i < result.length; i++) {
			result[i] = start + i * step;
		}
		return result;
		/*return Array.from(
			{ length: (stop - start) / step + 1 },
			(value, index) => start + index * step
		);*/
	}
	getRandom(max: number): number {
		return Math.floor(Math.random() * max);
	}
	generate(o: { stringNumbers: number[]; fretNumbers: number[]; }) {
		if (o.stringNumbers.length == 0) o.stringNumbers = this.getRange(1, this.numberOfStrings);
		if (o.fretNumbers.length == 0) o.fretNumbers = this.getRange(1, this.numberOfFrets);

		let result = null;
		while (result == null) {
			result = {
				stringNumber: o.stringNumbers[this.getRandom(o.stringNumbers.length)],
				fretNumber: o.fretNumbers[this.getRandom(o.fretNumbers.length)],
			};
			//if (predicate && !predicate(result)) result = null;
		};
		return result;
	}
}
