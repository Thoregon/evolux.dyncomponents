/**
 * This is the controller for dyncomponents
 *
 * There exists standard 'loaders' and 'plugins' to get started.
 * Other 'loaders' and 'plugins' can be itself installed as components.
 *
 * @author: blukassen
 */

import Registry         from "./registry.mjs";
import Cache            from "../loader/cache.mjs";
import ComponentLoader  from "../loader/componentloader.mjs";

export default class Controller {

    constructor() {
        this._plugins   = [];
        this._registry  = new Registry();
        this._cache     = new Cache();
        this._loader    = new ComponentLoader();
    }

    /*
     * management API
     */

    install() {

    }

    uninstall() {

    }

    update() {

    }

    resolve() {

    }

    start() {

    }

    stop() {

    }

    /*
     * behavior API
     */

    addCache(cache) {

    }

    removeCache(id) {

    }

    addLoader(loader) {

    }

    removeLoader(id) {

    }
}
