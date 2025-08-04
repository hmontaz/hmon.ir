import GuitarTuning from "./GuitarTuning.js";
import SVGTools from "../SVGTools.js";
/*interface ITheme {
    radius: number;
    stringGauge: number[];
    stringGaugeRatio: number;
    stringSpacing: number;
    labelStyle: Record<string, string>;
    svgStyle: Record<string, string>;
    noteStyle: {
        normal?: {
            circleStyle?: Record<string, string>;
            textStyle?: Record<string, string>;
        };
    };
    availableColors: Array<{
        name: string;
        icon: {
            defaultStyle: Record<string, string>;
            hoverStyle: Record<string, string>;
            selected: Record<string, string>;
        };
        selected: {
            circleStyle: Record<string, string>;
            textStyle: Record<string, string>;
        };
    }>;
}*/
class FretNote {
    constructor(guitarNote, circle, text, colorIndex) {
        this.guitarNote = guitarNote;
        this.circle = circle;
        this.text = text;
        this.colorIndex = colorIndex;
    }
}
class GuitarVisualizer {
    constructor(containerId) {
        this.tuning = new GuitarTuning([64, 59, 55, 50, 45, 40, 35, 30]); //E4 B3 G3 D3 A2 E2 B1 F#1;
        this.fretWidthBase = 95;
        this.selectedColor = null;
        this.numberOfStrings = 7;
        this.numberOfFrets = 24;
        this.fretNotes = [];
        this.fretboardTheme = {
            radius: 18,
            stringGauge: [9, 11, 16, 24, 34, 49, 64, 80, 108],
            stringGaugeRatio: 1 / 30,
            stringSpacing: 36,
            labelStyle: {
                fill: 'rgb(150,150,150)',
                marginRight: '10px',
                textAnchor: 'middle',
                fontSize: '14px',
                fontWeight: 'bold'
            },
            svgStyle: {
                marginTop: '20px',
                border: '1px solid #444',
                backgroundColor: 'rgba(0, 0, 0, 1)',
                fontFamily: 'sans-serif'
            },
            noteStyle: {
                normal: {
                    circleStyle: {
                        fill: 'rgba(51, 51, 51, .5)',
                    },
                    textStyle: {
                        fill: 'rgba(221, 221, 221, .5)'
                    },
                },
            },
            availableColors: [
                {
                    name: 'Red',
                    icon: {
                        defaultStyle: {
                            backgroundColor: 'hsl(0, 100%, 32%)',
                        },
                        hoverStyle: {
                            backgroundColor: 'rgba(255, 0, 0, 1)',
                        },
                    },
                    selected: {
                        circleStyle: {
                            fill: 'rgba(153, 51, 51, .8)',
                        },
                        textStyle: {
                            fill: 'rgba(255, 200, 200, .8)'
                        },
                    },
                },
                {
                    name: 'Yellow',
                    icon: {
                        defaultStyle: {
                            backgroundColor: 'hsl(60, 100%, 32%)',
                        },
                        hoverStyle: {
                            backgroundColor: 'rgba(255, 255, 0, 1)',
                        },
                    },
                    selected: {
                        circleStyle: {
                            fill: 'rgba(255, 255, 51, .8)',
                        },
                        textStyle: {
                            fill: 'hsl(60, 100%, 10%)'
                        },
                    },
                },
                {
                    name: 'Magenta',
                    icon: {
                        defaultStyle: {
                            backgroundColor: 'hsl(300, 100%, 32%)',
                        },
                        hoverStyle: {
                            backgroundColor: 'rgba(255, 0, 255, 1)',
                        },
                    },
                    selected: {
                        circleStyle: {
                            fill: 'rgba(153, 51, 153, .8)',
                        },
                        textStyle: {
                            fill: 'rgba(255, 200, 255, .8)'
                        },
                    },
                },
                {
                    name: 'Green',
                    icon: {
                        defaultStyle: {
                            backgroundColor: 'hsl(120, 100%, 32%)',
                        },
                        hoverStyle: {
                            backgroundColor: 'rgba(0, 255, 0, 1)',
                        },
                    },
                    selected: {
                        circleStyle: {
                            fill: 'rgba(51, 153, 51, .8)',
                        },
                        textStyle: {
                            fill: 'rgba(200, 255, 200, .8)'
                        },
                    },
                },
                {
                    name: 'Orange',
                    icon: {
                        defaultStyle: {
                            backgroundColor: 'hsl(39, 100%, 50%)',
                        },
                        hoverStyle: {
                            backgroundColor: 'rgba(255, 165, 0, 1)',
                        },
                    },
                    selected: {
                        circleStyle: {
                            fill: 'rgba(255, 153, 51, .8)',
                        },
                        textStyle: {
                            fill: 'rgba(255, 200, 200, .8)'
                        },
                    },
                },
                {
                    name: 'Blue',
                    icon: {
                        defaultStyle: {
                            backgroundColor: 'hsl(240, 100%, 32%)',
                        },
                        hoverStyle: {
                            backgroundColor: 'rgba(0, 0, 255, 1)',
                        },
                    },
                    selected: {
                        circleStyle: {
                            fill: 'rgba(51, 153, 255, .8)',
                        },
                        textStyle: {
                            fill: 'rgba(200, 255, 255, .8)'
                        },
                    },
                },
                {
                    name: 'Cyan',
                    icon: {
                        defaultStyle: {
                            backgroundColor: 'hsl(180, 100%, 32%)',
                        },
                        hoverStyle: {
                            backgroundColor: 'rgba(0, 255, 255, 1)',
                        },
                    },
                    selected: {
                        circleStyle: {
                            fill: 'rgba(153, 255, 255, .8)',
                        },
                        textStyle: {
                            fill: 'rgba(0, 0, 0, .8)'
                        },
                    },
                }
            ]
        };
        const container = document.getElementById(containerId);
        if (!container)
            throw new Error(`Container with ID '${containerId}' not found`);
        this.container = container;
        this.selectedColor = this.fretboardTheme.availableColors[0];
        this.render();
    }
    getFretWidth(f) {
        return this.fretWidthBase - f * this.fretWidthBase * (10 / 1000);
    }
    getFretX(f) {
        const fretWidth = this.getFretWidth(f);
        return 10 + f * fretWidth + fretWidth / 2;
    }
    render() {
        const topMargin = 50;
        const height = this.fretboardTheme.stringSpacing * this.numberOfStrings + topMargin;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', (this.getFretX(this.numberOfFrets + 1)).toString());
        svg.setAttribute('height', height.toString());
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        SVGTools.expandStyle(svg, this.fretboardTheme.svgStyle);
        // Strings
        for (let s = 0; s < this.numberOfStrings; s++) {
            const y = s * this.fretboardTheme.stringSpacing + topMargin;
            const stringLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            stringLine.setAttribute('x1', this.getFretX(0).toString());
            stringLine.setAttribute('y1', y.toString());
            stringLine.setAttribute('x2', this.getFretX(24).toString());
            stringLine.setAttribute('y2', y.toString());
            stringLine.setAttribute('stroke', 'silver');
            //stringLine.setAttribute('stroke-width', (.3 * s + .5).toString());
            const stringWidth = this.fretboardTheme.stringGauge[s] * this.fretboardTheme.stringGaugeRatio;
            stringLine.setAttribute('stroke-width', stringWidth.toString());
            svg.appendChild(stringLine);
        }
        // Frets and notes
        for (let f = 0; f <= this.numberOfFrets; f++) {
            const x = this.getFretX(f);
            const nextX = this.getFretX(f + 1);
            const fretTop = topMargin;
            const fretBottom = height - this.fretboardTheme.stringSpacing;
            const fretWidth = (nextX - x) / 2;
            const fretMid = x - (f === 0 ? this.fretboardTheme.radius : fretWidth);
            const labelY = topMargin - 25;
            const showInlay = [3, 5, 7, 9, 12, 15, 17, 19, 22].includes(f);
            if (showInlay) {
                const fretInlay = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                fretInlay.setAttribute('cx', (fretMid - fretWidth * .5).toString());
                //fretInlay.setAttribute('cy', (labelY - 6).toString());
                fretInlay.setAttribute('cy', (fretTop + fretBottom) / 2 - 6 + 'px');
                fretInlay.setAttribute('r', '10'.toString());
                SVGTools.expandStyle(fretInlay, { fill: 'rgba(255, 255, 255, .8)', });
                svg.appendChild(fretInlay);
            }
            if (f > 0) {
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', fretMid.toString());
                label.setAttribute('y', labelY.toString());
                label.textContent = f.toString();
                SVGTools.expandStyle(label, this.fretboardTheme.labelStyle);
                svg.appendChild(label);
            }
            const fretLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            fretLine.setAttribute('x1', x.toString());
            fretLine.setAttribute('y1', fretTop.toString());
            fretLine.setAttribute('x2', x.toString());
            fretLine.setAttribute('y2', fretBottom.toString());
            fretLine.setAttribute('stroke', 'gold');
            fretLine.setAttribute('stroke-width', f === 0 ? '4' : '2');
            svg.appendChild(fretLine);
            for (let s = 0; s < this.numberOfStrings; s++) {
                const y = s * this.fretboardTheme.stringSpacing + topMargin;
                const guitarNote = this.tuning.newGuitarNote(s, f);
                //const midiNumber = this.getMidiNumber(s, f);
                //const noteName = this.getNoteName(midiNumber);
                //const midiNumber = guitarNote.midiNumber;
                const noteName = guitarNote.getNoteName();
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', fretMid.toString());
                text.setAttribute('y', (y + 5).toString());
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-size', '12');
                text.textContent = noteName;
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', fretMid.toString());
                circle.setAttribute('cy', y.toString());
                circle.setAttribute('r', this.fretboardTheme.radius.toString());
                circle.setAttribute('class', 'note');
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.appendChild(circle);
                g.appendChild(text);
                svg.appendChild(g);
                const updateColors = (circle, text, selected) => {
                    const theme = this.selectedColor;
                    const style = selected ? theme.selected : theme.normal || this.fretboardTheme.noteStyle.normal;
                    SVGTools.expandStyle(circle, style.circleStyle);
                    SVGTools.expandStyle(text, style.textStyle);
                };
                circle.addEventListener('click', () => {
                    circle.classList.toggle('selected');
                    text.classList.toggle('selected');
                    const selected = circle.classList.contains('selected');
                    updateColors(circle, text, selected);
                });
                text.addEventListener('click', () => {
                    circle.classList.toggle('selected');
                    text.classList.toggle('selected');
                    const selected = circle.classList.contains('selected');
                    updateColors(circle, text, selected);
                });
                updateColors(circle, text, false); // Set initial color
                const fretNote = new FretNote(guitarNote, circle, text, undefined);
                this.fretNotes.push(fretNote);
            }
        }
        this.container.innerHTML = '';
        this.container.appendChild(svg);
    }
    /*
    private camelToKebab(str: string): string {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    }

    private parseStyle(style: string): Record<string, string> {
        return style.split(';').reduce((acc, part) => {
            const [key, value] = part.split(':').map(s => s.trim())
            if (key && value) acc[this.kebabToCamel(key)] = value
            return acc;
        }, {} as Record<string, string>);
    }

    private styleObjectToString(style: Record<string, string>): string {
        return Object.entries(style).map(([key, value]) => `${this.camelToKebab(key)}: ${value}`).join('; ')
    }

    private kebabToCamel(str: string): string {
        return str.replace(/-([a-z])/g, (_, g) => g.toUpperCase())
    }

    public expandStyle(element: SVGElement, style: Record<string, string>): void {
        const styleObject = {
            ...this.parseStyle(element.getAttribute('style') ?? ''),
            ...style
        };

        element.setAttribute('style', this.styleObjectToString(styleObject))
    }*/
    setColor(name) {
        this.selectedColor = this.fretboardTheme.availableColors.find(color => color.name === name);
    }
    download(format = 'svg') {
        if (format === 'svg')
            return this.downloadSVG();
        if (format === 'png' || format === 'jpeg')
            return this.downloadRaster(format);
        console.error('Unsupported format. Use "svg", "png", or "jpeg".');
    }
    downloadSVG() {
        const svg = this.container.querySelector('svg');
        if (!svg)
            return;
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svg);
        const blob = new Blob([source], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fretboard.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    downloadRaster(format = 'png') {
        const svg = this.container.querySelector('svg');
        if (!svg)
            return;
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = svg.clientWidth;
            canvas.height = svg.clientHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Canvas context not available.');
                return;
            }
            // Draw SVG image onto canvas
            ctx.drawImage(image, 0, 0);
            // Determine MIME type and file extension
            const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
            const extension = format === 'jpeg' ? 'jpeg' : 'png';
            const dataURL = canvas.toDataURL(mimeType);
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = `fretboard.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        };
        image.onerror = (err) => {
            console.error('Failed to load SVG for raster export', err);
        };
        image.src = url;
    }
    getAvailableColors() {
        return this.fretboardTheme.availableColors.map(c => ({ defaultStyle: c.icon.defaultStyle, hoverStyle: c.icon.hoverStyle, name: c.name }));
    }
    clearFrets() {
        this.fretNotes.forEach(note => note.colorIndex = undefined);
        this.updateFretboard();
    }
    turnNoteOn(midiNumber) {
        //const noteName = this.noteNames[midiNumber % 12];
        const colorIndex = this.getAvailableColors().findIndex(c => c.name == this.selectedColor.name);
        this.fretNotes.forEach(fretNote => {
            //if (note.noteName === noteName) { note.colorIndex = 0; }
            if (fretNote.guitarNote.midiNumber === midiNumber) {
                fretNote.colorIndex = colorIndex;
            }
        });
        this.updateFretboard();
    }
    turnNoteOff(midiNumber) {
        //const noteName = this.noteNames[midiNumber % 12];
        this.fretNotes.forEach(note => {
            if (note.guitarNote.midiNumber === midiNumber) {
                note.colorIndex = undefined;
            }
        });
        this.updateFretboard();
    }
    updateFretboard() {
        this.fretNotes.forEach(note => {
            const { circle, text, colorIndex } = note;
            if (colorIndex != null && colorIndex >= 0) {
                const theme = this.fretboardTheme.availableColors[colorIndex];
                SVGTools.expandStyle(circle, theme.selected.circleStyle);
                SVGTools.expandStyle(text, theme.selected.textStyle);
            }
            else {
                SVGTools.expandStyle(circle, this.fretboardTheme.noteStyle.normal.circleStyle);
                SVGTools.expandStyle(text, this.fretboardTheme.noteStyle.normal.textStyle);
            }
        });
    }
}
export default GuitarVisualizer;
//# sourceMappingURL=GuitarVisualizer.js.map