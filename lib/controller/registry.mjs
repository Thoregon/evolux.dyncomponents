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

    }

    values() {

    }

    get(key) {

    }

    set(key, entry, path) {
        this.entries[key] = entry;
        if (path) this.pathmapping[path] = key;
    }

    has(key) {

    }

    delete(key) {

    }

    keyForPath(path) {
        return this.pathmapping[path];
    }

    // ****

    getLoaderFor(referrer, parentloader) {
        return parentloader;
    }

}
