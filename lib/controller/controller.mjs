/**
 * This is the controller for dyncomponents
 *
 * There exists standard 'loaders' and 'plugins' to get started.
 * Other 'loaders' and 'plugins' can be itself installed as components.
 *
 * @author: blukassen
 */

import Registry         from "./registry.mjs";

export default class Controller {

    constructor() {
        this._plugins = [];
        this._loaders = {};
        this._registry = new Registry();
    }

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

}
