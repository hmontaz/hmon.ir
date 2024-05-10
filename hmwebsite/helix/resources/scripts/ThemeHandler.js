var Theme;
(function (Theme) {
    Theme["Default"] = "default";
    Theme["Dark"] = "dark";
})(Theme || (Theme = {}));
class ThemeHandler {
    constructor() {
        this.settings = new Settings();
        this.changeEvents = [];
        let prevTheme = this.current;
        setInterval(() => {
            const newTheme = this.current;
            if (newTheme != prevTheme) {
                prevTheme = newTheme;
                this.invokeChanged();
            }
        }, 10);
    }
    get current() {
        return this.settings.theme;
    }
    set current(theme) {
        this.settings.theme = theme;
    }
    invokeChanged() {
        for (var i = 0; i < this.changeEvents.length; i++) {
            this.changeEvents[i]();
        }
    }
    change(f) {
        this.changeEvents.push(f);
    }
    apply() {
        const elements = document.querySelector(`#theme-${this.current}`);
        elements.removeAttribute('disabled');
        document.head.append(elements);
    }
}
//# sourceMappingURL=ThemeHandler.js.map