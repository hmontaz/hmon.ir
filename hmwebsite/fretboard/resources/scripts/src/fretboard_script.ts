class Fretboard {
	private noteNames: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	private tuning: string[] = ['E', 'B', 'G', 'D', 'A', 'E', 'B', 'F#'];
	private fretWidthBase: number = 95;
	private radius: number = 18;
	private container: HTMLElement;
	private selectedColor: any = null; // Initialize selectedColor to null
	private fretboardTheme: any = {
		labelStyle: {
			fill: 'rgb(150,150,150)',
			marginRight: '10px',
			textAnchor: 'middle',
			fontSize: '12px',
		},
		svgStyle: {
			marginTop: '20px',
			border: '1px solid #444',
			backgroundColor: 'rgba(0, 0, 0, 1)',
			fontFamily: 'sans-serif',
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
				normal: {
					circleStyle: {
						fill: 'rgba(51, 51, 51, .5)',
					},
					textStyle: {
						fill: 'rgba(221, 221, 221, .5)'
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
				normal: {
					circleStyle: {
						fill: 'rgba(51, 51, 51, .5)',
					},
					textStyle: {
						fill: 'hsla(60, 100%, 50%, .5)'
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
				normal: {
					circleStyle: {
						fill: 'rgba(51, 51, 51, .5)',
					},
					textStyle: {
						fill: 'rgba(221, 221, 221, .5)'
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
				normal: {
					circleStyle: {
						fill: 'rgba(51, 51, 51, .5)',
					},
					textStyle: {
						fill: 'rgba(221, 221, 221, .5)'
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
				normal: {
					circleStyle: {
						fill: 'rgba(51, 51, 51, .5)',
					},
					textStyle: {
						fill: 'rgba(221, 221, 221, .5)'
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
				normal: {
					circleStyle: {
						fill: 'rgba(51, 51, 51, .5)',
					},
					textStyle: {
						fill: 'rgba(221, 221, 221, .5)'
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
				normal: {
					circleStyle: {
						fill: 'rgba(51, 51, 51, .5)',
					},
					textStyle: {
						fill: 'rgba(221, 221, 221, .5)'
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
	}

	constructor(containerId: string) {
		const container = document.getElementById(containerId);
		if (!container) throw new Error(`Container with ID '${containerId}' not found`);
		this.container = container;
		this.selectedColor = this.fretboardTheme.availableColors[0]; // Set default color
		this.render(); // Initial render
	}

	private getNoteName(baseNote: string, fret: number): string {
		const index = (this.noteNames.indexOf(baseNote) + fret) % 12;
		return this.noteNames[index];
	}

	private getFretWidth(f: number): number {
		return this.fretWidthBase - f * this.fretWidthBase * (10 / 1000);
	}

	private getFretX(f: number): number {
		const fretWidth = this.getFretWidth(f);
		return 10 + f * fretWidth + fretWidth / 2;
	}

	public render(): void {
		const numStrings = parseInt((document.getElementById('strings') as HTMLInputElement).value, 10);
		const numFrets = parseInt((document.getElementById('frets') as HTMLInputElement).value, 10);
		const height = 40 * numStrings + 40;

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width', (this.getFretX(numFrets + 1)).toString());
		svg.setAttribute('height', height.toString());
		svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		//svg.setAttribute('style', `margin-top: ${fretboardTheme.marginTop}; border: ${fretboardTheme.border}; background-color: ${fretboardTheme.backgroundColor};`);
		/*const styleObject = {
			...this.parseStyle(svg.getAttribute('style') ?? ''),
			...fretboardTheme
		};

		svg.setAttribute('style', this.styleObjectToString(styleObject));*/
		this.expandStyle(svg, this.fretboardTheme.svgStyle);
		// Strings
		for (let s = 0; s < numStrings; s++) {
			const y = s * 40 + 40;
			const stringLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			stringLine.setAttribute('x1', this.getFretX(0).toString());
			stringLine.setAttribute('y1', y.toString());
			stringLine.setAttribute('x2', this.getFretX(24).toString());
			stringLine.setAttribute('y2', y.toString());
			stringLine.setAttribute('stroke', 'silver');
			stringLine.setAttribute('stroke-width', '2');
			svg.appendChild(stringLine);
		}

		// Frets and notes
		for (let f = 0; f <= numFrets; f++) {
			const x = this.getFretX(f);
			const nextX = this.getFretX(f + 1);
			const w = (nextX - x) / 2;
			const fretWidth = this.getFretWidth(f);
			const fretMid = x - (f === 0 ? this.radius : w);

			const fretLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			fretLine.setAttribute('x1', x.toString());
			fretLine.setAttribute('y1', '40');
			fretLine.setAttribute('x2', x.toString());
			fretLine.setAttribute('y2', (height - 40).toString());
			fretLine.setAttribute('stroke', 'gold');
			fretLine.setAttribute('stroke-width', f === 0 ? '4' : '2');
			svg.appendChild(fretLine);

			if (f > 0) {
				const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
				label.setAttribute('x', fretMid.toString());
				label.setAttribute('y', '15');
				label.textContent = f.toString();

				this.expandStyle(label, this.fretboardTheme.labelStyle);
				svg.appendChild(label);
			}

			for (let s = 0; s < numStrings; s++) {
				const y = s * 40 + 40;
				const openNote = this.tuning[s % this.tuning.length];
				const noteName = this.getNoteName(openNote, f);

				const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
				text.setAttribute('x', fretMid.toString());
				text.setAttribute('y', (y + 5).toString());
				text.setAttribute('text-anchor', 'middle');
				text.setAttribute('font-size', '12');
				text.textContent = noteName;

				const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
				circle.setAttribute('cx', fretMid.toString());
				circle.setAttribute('cy', y.toString());
				circle.setAttribute('r', this.radius.toString());
				circle.setAttribute('class', 'note');

				const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
				g.appendChild(circle);
				g.appendChild(text);

				svg.appendChild(g);

				const updateColors = (circle: SVGCircleElement, text: SVGTextElement, selected: boolean) => {
					const theme = this.selectedColor
					const style = selected ? theme.selected : theme.normal
					this.expandStyle(circle, style.circleStyle)
					this.expandStyle(text, style.textStyle)
				}

				circle.addEventListener('click', () => {
					circle.classList.toggle('selected')
					text.classList.toggle('selected')
					const selected = circle.classList.contains('selected')
					updateColors(circle, text, selected)

				});
				text.addEventListener('click', () => {
					circle.classList.toggle('selected')
					text.classList.toggle('selected')
					const selected = circle.classList.contains('selected')
					updateColors(circle, text, selected)
				});
				updateColors(circle, text, false); // Set initial color
			}
		}

		this.container.innerHTML = ''
		this.container.appendChild(svg)
	}

	private camelToKebab(str: string): string {
		return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
	}

	private parseStyle(style: string): Record<string, string> {
		return style.split(';').reduce((acc, part) => {
			const [key, value] = part.split(':').map(s => s.trim());
			if (key && value) {
				acc[this.kebabToCamel(key)] = value;
			}
			return acc;
		}, {} as Record<string, string>);
	}

	// Convert object to inline style string
	private styleObjectToString(style: Record<string, string>): string {
		return Object.entries(style)
			.map(([key, value]) => `${this.camelToKebab(key)}: ${value}`)
			.join('; ');
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
	}

	public setColor(name: string): void {
		this.selectedColor = this.fretboardTheme.availableColors.find(color => color.name === name)
	}

	public download(format: 'svg' | 'png' | 'jpeg' = 'svg'): void {
		if (format === 'svg') {
			this.downloadSVG();
			return
		}
		if (format === 'png' || format === 'jpeg') {
			this.downloadRaster(format);
			return
		}
		console.error('Unsupported format. Use "svg", "png", or "jpeg".');
	}
	private downloadSVG(): void {
		const svg = this.container.querySelector('svg');
		if (!svg) return;

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

	private downloadRaster(format: 'png' | 'jpeg' = 'png'): void {
		const svg = this.container.querySelector('svg');
		if (!svg) return;

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

	public getAvailableColors(): any[] {

		return this.fretboardTheme.availableColors.map((color) => ({ defaultStyle: color.icon.defaultStyle, hoverStyle: color.icon.hoverStyle, name: color.name }))

	}
}
