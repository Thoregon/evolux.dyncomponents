/**
 * Implement to provide an installable component.
 * Inspired by OSGi
 *
 *  Lifecycle (OSGi)        {@see comapi/states}
 *      - install --> installed
 *      - uninstall --> uninstalled
 *      - resolve --> resolved
 *          - update --> installed
 *          - start --> stating, active
 *              - stop --> stopping, resolved
 *
 * Lifecycle methods will be called by the compoent manager
 *
 * @author: blukassen
 */

const EventEmitter      = require('events');

const errors = require('../errors');

class Installable extends EventEmitter {

    //         this.emit('', this.id);

    /**
     * return an ID for the messenger interface which
     * @implement
     * @returns {string}
     */
    get id() {
        throw errors.errCompIdMissing;
    }

    // **** Lifecycle hooks; do not need to be implemented

    /**
     * prepare to install or throw error
     * state will be set to 'installed' by the component manager if successful
     * @param {Object}              options - passed from the manage
     * @throws {ComServiceError}    installation will stop when thrown
     */
    install(options) {}

    /**
     * prepare to uninstall, thrown error will just be recorded but doesn't prevent uninstalling
     * state will be set to 'uninstalled' by the component manager if successful
     * @throws {ComServiceError}    will be logged but ignored
     */
    uninstall() {}

    /**
     *  prepare to resolve or throw error
     * state will be set to 'resolved' by the component manager if successful
     * @throws {ComServiceError}    resolve will stop when thrown
     */
    resolve() {}

    /**
     *  prepare to start or throw error
     * state will be set to 'started' by the component manager if successful
     * @event ComSPI#ready         when messenger is ready to send and receive
     *  @type   {string}            id - of messenger
     * @throws {ComServiceError}    start will be interrupted when thrown
     */
    start() {
    }

    /**
     * prepare to stop, thrown error will just be recorded but doesn't prevent stopping
     * state will be set to 'resolved' by the component manager if successful
     * @event ComSPI#stop          when messenger has stopped
     *  @type   {string}            id - of messenger
     * @throws {ComServiceError}    will be logged but ignored
     */
    stop() {
    }

    /**
     *  prepare to update or throw error
     * state will be set to 'installed' by the component manager if successful
     * @throws {ComServiceError}    will be logged but ignored
     */
    update() {}

}

module.exports = Installable;
