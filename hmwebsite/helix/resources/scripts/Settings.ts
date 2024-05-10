enum DeviceType {
	HelixFloor = 'helix_floor',
	//HelixStomp = 'hx_stomp',
	HXEffects = 'hx_effects'
}

class Settings {
	storageKey: 'FXFinderPreferences'
	constructor() {
	}
	read() {
		const defaultSetting = {
			device: DeviceType.HelixFloor,
			theme: Theme.Dark
		}
		const value = JSON.parse(localStorage.getItem(this.storageKey) || '{}')
		return { ...defaultSetting, ...value }
	}
	get(key) {
		const settings = this.read()
		return settings[key]
	}
	set(key, value) {
		const settings = this.read()
		settings[key] = value
		localStorage.setItem(this.storageKey, JSON.stringify(settings))
	}

	get device() {
		return this.get('device')
	}
	set device(value: DeviceType) {
		this.set('device', value)
	}
	get theme() {
		return this.get('theme')
	}
	set theme(value: string) {
		this.set('theme', value)
	}
}