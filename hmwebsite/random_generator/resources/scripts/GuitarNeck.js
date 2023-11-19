class GuitarNeck {
    constructor(o) {
        const defaults = {
            container: null,
            numberOfStrings: 6,
            numberOfFrets: 24,
            neckWidth: 800,
            neckHeight: 120,
            neckMargin: 3,
            fretboardColor: 'hsl(40,65%,55%)',
            fretWidth: 4,
            firstFretWidth: 61.9,
            verticalPadding: 20,
            horizontalPadding: 30,
            fretColor: '#777',
            inlayColor: '#8a8a8a',
            inlayRadius: 6,
            openStrings: ['E', 'B', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'],
            stringGauge: [9, 11, 16, 24, 34, 49, 64, 80, 108],
            stringColor: '#333',
            stringGaugeRatio: 1 / 30,
            bgColor: 'black',
        };
        this.options = Object.assign(Object.assign({}, defaults), o);
        //---------
        //Draw	
        this.initialize();
    }
    initialize() {
        const o = this.options;
        const width = this.getNeckWidth();
        const height = this.getNeckHeight();
        this.notes = new Array();
        this.ui = {
            container: o.container,
            svg: this.newElement('svg')
                .attr({ viewBox: `0 0 ${width} ${height}` }),
            background: this.newElement('rect')
                .attr({
                width: width,
                height: height,
                fill: o.bgColor
            }),
            fretboard: this.newElement('rect')
                .attr({
                x: o.horizontalPadding - o.fretWidth / 2,
                y: o.verticalPadding,
                width: width,
                height: o.neckHeight,
                fill: o.fretboardColor
            })
        };
        this.ui.svg.appendTo(this.ui.container);
        this.ui.background.appendTo(this.ui.svg);
        this.ui.fretboard.appendTo(this.ui.svg);
        this.initInlays();
        this.initFrets();
        this.initStrings();
        //All Notes
    }
    getNeckWidth() {
        const o = this.options;
        return o.neckWidth + 2 * o.horizontalPadding;
    }
    getNeckHeight() {
        const o = this.options;
        return o.neckHeight + 2 * o.verticalPadding;
    }
    initFrets() {
        const o = this.options;
        for (var i = 0; i <= o.numberOfFrets; i++) {
            var fret = this.newElement('rect').attr({
                x: this.getFretCX(i) - o.fretWidth / 2,
                y: o.verticalPadding,
                width: o.fretWidth,
                height: o.neckHeight,
                fill: o.fretColor,
            }).appendTo(this.ui.svg).click(function (e) { $(this).hide(); });
        }
    }
    initInlays() {
        const o = this.options;
        for (let i = 0; i < o.numberOfFrets; i++) {
            let offsetX = this.getFretWidth(i) / 2;
            let offsetY = 0;
            if ([12].indexOf((i % 12) + 1) != -1) {
                offsetY = 20;
                this.newElement('circle').attr({
                    cx: this.getFretCX(i) + offsetX,
                    cy: this.getFretCY() + offsetY,
                    fill: o.inlayColor,
                    r: o.inlayRadius,
                }).appendTo(this.ui.svg);
            }
            if ([3, 5, 7, 9, 12].indexOf((i % 12) + 1) != -1)
                this.newElement('circle').attr({
                    cx: this.getFretCX(i) + offsetX,
                    cy: this.getFretCY() - offsetY,
                    fill: o.inlayColor,
                    r: o.inlayRadius,
                }).appendTo(this.ui.svg);
        }
    }
    initStrings() {
        const o = this.options;
        for (var i = 0; i < o.numberOfStrings; i++) {
            let gauge = o.stringGauge[i] * o.stringGaugeRatio;
            let string_cy = this.getStringCY(i);
            var s = this.newElement('rect').attr({
                x: o.horizontalPadding - o.fretWidth / 2,
                y: string_cy - gauge / 2,
                width: o.neckWidth + o.fretWidth + o.horizontalPadding,
                height: gauge,
                fill: o.stringColor,
            }).appendTo(this.ui.svg);
        }
    }
    getFretWidth(index) {
        const o = this.options;
        return Math.pow(0.943890218, index) * o.firstFretWidth; // o.neckWidth / o.numberOfFrets;
    }
    getFretCX(index) {
        const o = this.options;
        if (index == -1)
            return -o.horizontalPadding / 2;
        var result = 0;
        for (var i = 0; i < index; i++) {
            result += this.getFretWidth(i);
        }
        return o.horizontalPadding + result;
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
        return (o.neckHeight - 2 * o.neckMargin) / (o.numberOfStrings - 1);
    }
    newElement(tagName) {
        return $(document.createElementNS('http://www.w3.org/2000/svg', tagName));
    }
    clear() {
        for (var i = 0; i < this.notes.length; i++) {
            this.notes[i].remove();
        }
        this.notes.splice(0);
    }
    addNote(stringNumber, fretNumber, text) {
        var note = new GuitarNote(this, stringNumber, fretNumber);
        this.notes.push(note);
        if (text)
            note.setText(text);
        return note;
    }
}
//# sourceMappingURL=GuitarNeck.js.map