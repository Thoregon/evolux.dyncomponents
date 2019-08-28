/**
 * Interface for a plugin for the component controller
 *
 * Usage:
 *  just subclass and implement the plugin
 *
 * @author: blukassen
 */

export default class ControllerPlugin {

    controller(controller) {
        this._controller = controller;
    }
}
