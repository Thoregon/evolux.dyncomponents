/**
 * Interface for a plugin for the component controller
 *
 * Usage:
 *  just subclass and implement the plugin
 *
 * @author: blukassen
 */

import { ErrNotImplemented } from '../errors.mjs';

export default class ControllerPlugin {

    controller(controller) {
        this._controller = controller;
    }

    /*
     * implement by subclasses
     */

    ready() {
        throw ErrNotImplemented('ControllerPlugin.prepare()');
    }

    pause() {
        throw ErrNotImplemented('ControllerPlugin.pause()');
    }

    end() {
        throw ErrNotImplemented('ControllerPlugin.end()');
    }

}
