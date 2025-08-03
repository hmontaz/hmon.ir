class SVGTools {
	public static camelToKebab(str: string): string {
		return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
	}

	public static parseStyle(style: string): Record<string, string> {
		return style.split(';').reduce((acc, part) => {
			const [key, value] = part.split(':').map(s => s.trim())
			if (key && value) acc[this.kebabToCamel(key)] = value
			return acc;
		}, {} as Record<string, string>);
	}

	public static styleObjectToString(style: Record<string, string>): string {
		return Object.entries(style).map(([key, value]) => `${this.camelToKebab(key)}: ${value}`).join('; ')
	}

	public static kebabToCamel(str: string): string {
		return str.replace(/-([a-z])/g, (_, g) => g.toUpperCase())
	}

	public static expandStyle(element: SVGElement, style: Record<string, string>): void {
		const styleObject = {
			...this.parseStyle(element.getAttribute('style') ?? ''),
			...style
		};

		element.setAttribute('style', this.styleObjectToString(styleObject))
	}
}

export default SVGTools;