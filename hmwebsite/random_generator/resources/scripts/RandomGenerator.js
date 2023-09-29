/* <reference path="GuitarNeck.js" />*/
class RandomGenerator {
    constructor(numberOfStrings, numberOfFrets) {
        this.numberOfStrings = numberOfStrings;
        this.numberOfFrets = numberOfFrets;
    }
    getRange(start, stop, step) {
        step = step || 1;
        let result = new Array((stop - start) / step + 1);
        for (let i = 0; i < result.length; i++) {
            result[i] = start + i * step;
        }
        return result;
        /*return Array.from(
            { length: (stop - start) / step + 1 },
            (value, index) => start + index * step
        );*/
    }
    getRandom(max) {
        return Math.floor(Math.random() * max);
    }
    generate(o) {
        if (o.stringNumbers.length == 0)
            o.stringNumbers = this.getRange(1, this.numberOfStrings);
        if (o.fretNumbers.length == 0)
            o.fretNumbers = this.getRange(1, this.numberOfFrets);
        let result = null;
        while (result == null) {
            result = {
                stringNumber: o.stringNumbers[this.getRandom(o.stringNumbers.length)],
                fretNumber: o.fretNumbers[this.getRandom(o.fretNumbers.length)],
            };
            //if (predicate && !predicate(result)) result = null;
        }
        ;
        return result;
    }
}
//# sourceMappingURL=RandomGenerator.js.map