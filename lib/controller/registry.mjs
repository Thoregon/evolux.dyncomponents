/**
 *
 *
 * @author: blukassen
 */

export default class Registry {

    constructor() {
        Object.assign(this, { entries: {}, pathmapping: {} });
    }

    // ****

    keys() {
        return Object.keys(this.entries);
    }

    components() {
        return Object.values(this.entries);
    }

    get(key) {
        return this.entries[key];
    }

    set(key, entry, path) {
        this.entries[key] = entry;
        if (path) this.pathmapping[path] = key;
    }

    has(key) {
        return !!this.entries[key];
    }

    delete(key) {
        delete this.entries[key];
    }

    keyForPath(path) {
        return this.pathmapping[path];
    }

    // ****

    getLoaderFor(referrer, parentloader) {
        return parentloader;
    }

}
