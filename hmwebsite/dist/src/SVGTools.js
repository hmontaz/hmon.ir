class SVGTools {
    static camelToKebab(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
    static parseStyle(style) {
        return style.split(';').reduce((acc, part) => {
            const [key, value] = part.split(':').map(s => s.trim());
            if (key && value)
                acc[this.kebabToCamel(key)] = value;
            return acc;
        }, {});
    }
    static styleObjectToString(style) {
        return Object.entries(style).map(([key, value]) => `${this.camelToKebab(key)}: ${value}`).join('; ');
    }
    static kebabToCamel(str) {
        return str.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
    }
    static expandStyle(element, style) {
        var _a;
        const styleObject = Object.assign(Object.assign({}, this.parseStyle((_a = element.getAttribute('style')) !== null && _a !== void 0 ? _a : '')), style);
        element.setAttribute('style', this.styleObjectToString(styleObject));
    }
}
export default SVGTools;
//# sourceMappingURL=SVGTools.js.map