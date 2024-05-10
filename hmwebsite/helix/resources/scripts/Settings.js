var DeviceType;
(function (DeviceType) {
    DeviceType["HelixFloor"] = "helix_floor";
    //HelixStomp = 'hx_stomp',
    DeviceType["HXEffects"] = "hx_effects";
})(DeviceType || (DeviceType = {}));
class Settings {
    constructor() {
    }
    read() {
        const defaultSetting = {
            device: DeviceType.HelixFloor,
            theme: Theme.Dark
        };
        const value = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        return Object.assign(Object.assign({}, defaultSetting), value);
    }
    get(key) {
        const settings = this.read();
        return settings[key];
    }
    set(key, value) {
        const settings = this.read();
        settings[key] = value;
        localStorage.setItem(this.storageKey, JSON.stringify(settings));
    }
    get device() {
        return this.get('device');
    }
    set device(value) {
        this.set('device', value);
    }
    get theme() {
        return this.get('theme');
    }
    set theme(value) {
        this.set('theme', value);
    }
}
//# sourceMappingURL=Settings.js.map