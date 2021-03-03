/**
 *
 *
 * @author: blukassen
 */

import StateMachine     from '../ext/javascript-state-machine.mjs';

export default class ComponentStatus {

    constructor() {
        this._fsm();
    }

    forceuninstall() {
        // first stop if it is active or starting
        this.forcestop();

        // now uninstall
        if (this.state === 'resolved') this.uninstall();
        if (this.state === 'installing' || this.state === 'resolving') this.uninstall();
        if (this.state === 'uninstalling') this.uninstalled();
    }

    forcestop() {
        if (this.state === 'active') this.stop();
        if (this.state === 'stopping' || this.state === 'starting') this.stopped();
        // from other states there is no need to stop anyways
    }

    // todo: analyse history
    get isInstalled() {
        return this.is('resolved') || this.is('active');
    }

    get isUninstalled() {
        return this.is('uninstalled');
    }

    get isStarted() {
        return this.is('active');
    }

    get isStopped() {
        return this.is('resolved');
    }
}

const ComponentState    = StateMachine.factory(ComponentStatus, {
    init: 'uninstalled',
    transitions: [
        // uninstalled component can be resolved, if error will be uninstalled
        { name: 'install',          from: 'uninstalled',    to: 'installing' },
        { name: 'installed',        from: 'installing',     to: 'installed' },
        { name: 'uninstall',        from: 'installing',     to: 'uninstalling' },

        // installed component can be resolved, if error will be uninstalled
        { name: 'resolve',          from: 'installed',      to: 'resolving' },
        { name: 'resolved',         from: 'resolving',      to: 'resolved' },
        { name: 'uninstall',        from: 'resolving',      to: 'uninstalling' },

        // resolved component can be uninstalled, errors will be logged but does not prevent uninstall
        { name: 'uninstall',        from: 'resolved',       to: 'uninstalling' },
        { name: 'uninstalled',      from: 'uninstalling',   to: 'uninstalled' },

        // resolved component can be updated (must be stopped if it was active before)
        { name: 'update',           from: 'resolved',       to: 'updateing' },
        { name: 'updated',          from: 'updateing',      to: 'installed' },

        // resolved component can be started when it is a service, if error it will be stopped
        { name: 'start',            from: 'resolved',       to: 'starting' },
        { name: 'started',          from: 'starting',       to: 'active' },
        { name: 'stop',             from: 'starting',       to: 'resolved' },

        // active service can be stopped, errors will be logged but does not prevent stopping
        { name: 'stop',             from: 'active',         to: 'stopping' },
        { name: 'stopped',          from: 'stopping',       to: 'resolved' },
    ]
});
