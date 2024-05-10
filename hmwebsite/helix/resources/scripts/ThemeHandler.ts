enum Theme {
	Default = 'default',
	Dark = 'dark'
}
type EventHandler = { (): void }
class ThemeHandler {
	settings: Settings
	changeEvents: EventHandler[]
	constructor() {
		this.settings = new Settings()
		this.changeEvents = []
		let prevTheme = this.current
		setInterval(() => {
			const newTheme = this.current
			if (newTheme != prevTheme) {
				prevTheme = newTheme
				this.invokeChanged()
			}
		}, 10)
	}
	get current(): Theme {
		return this.settings.theme as Theme
	}
	set current(theme: Theme) {
		this.settings.theme = theme
	}
	invokeChanged() {
		for (var i = 0; i < this.changeEvents.length; i++) {
			this.changeEvents[i]()
		}
	}
	change(f: EventHandler) {
		this.changeEvents.push(f)
	}
	apply() {
		const elements = document.querySelector(`#theme-${this.current}`)
		elements.removeAttribute('disabled')
		document.head.append(elements)
	}
}