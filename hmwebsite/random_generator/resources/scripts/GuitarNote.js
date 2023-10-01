class GuitarNote {
    constructor(guitarNeck, stringNumber, fretNumber) {
        this.guitarNeck = guitarNeck;
        this.stringNumber = stringNumber;
        this.fretNumber = fretNumber;
        //--------------
        this.initialize();
    }
    initialize() {
        let neck = this.guitarNeck;
        let o = neck.options;
        let size = (neck.getStringSpace() - o.fretWidth) * .9;
        let fretIndex = this.fretNumber - 1;
        let x = neck.getFretCX(fretIndex) + neck.getFretWidth(fretIndex) / 2 - neck.getNeckWidth() / 2;
        let y = neck.getStringCY(this.stringNumber - 1) - neck.getNeckHeight() / 2;
        this.ui = {
            group: neck.newElement('g').attr({
                transform: `translate(${x},${y})`,
            }),
            circleElement: neck.newElement('circle')
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
            }),
            textElement: neck.newElement('text')
                .attr({
                x: '50%',
                y: '50%',
                'dy': '0.32em',
                'text-anchor': 'middle',
                textLength: size,
            })
                .css({
                'font-size': size * .7
            })
        };
        this.ui.group.appendTo(neck.ui.svg);
        this.ui.circleElement.appendTo(this.ui.group);
        this.ui.textElement.appendTo(this.ui.group);
        this.musicalNote = MusicalNote.parse(o.openStrings[this.stringNumber - 1]);
        this.musicalNote.addSemitones(this.fretNumber);
        this.setText(this.musicalNote.toString());
    }
    setText(text) {
        this.text = text;
        this.ui.textElement.html(text);
        //this.textElement.html(text.replace('#', '♯').replace('b', '♭'))
    }
    remove() {
        this.ui.circleElement.remove();
        this.ui.textElement.remove();
    }
    hide() {
        this.ui.circleElement.hide();
        this.ui.textElement.hide();
    }
}
//# sourceMappingURL=GuitarNote.js.map