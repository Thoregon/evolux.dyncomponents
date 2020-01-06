/**
 * This is the controller for dyncomponents. the controller acts as an API facade,
 * providing information about installed components and the lifecycle methods to
 * install, uninstall, start and stop components.
 *
 * It is responsible for dispatching
 *
 * There exists standard 'loaders' and 'plugins' to get started.
 * Other 'loaders' and 'plugins' can be itself installed as components.
 *
 * todo: install components used for boot with 'import' as components;
 * todo: make the dyncomponents itself updatable; enable rollback
 * todo: enable testing: blue/green system, canary
 * todo: persistent logging. use components which  will be installed
 * todo: subcontexts for namespaces e.g. 'system.component'
 *
 * @author: blukassen
 */

import { myuniverse }               from "/evolux.universe";
import { isFunction, forEach }      from "/evolux.util";
import { EventEmitter}              from "/evolux.pubsub";
import { Reporter }                 from "/evolux.supervise";

import Registry                     from "./registry.mjs";
import Cache                        from "../loader/cache.mjs";
import ComponentLoader              from "../loader/componentloader.mjs";
import ComponentStatus              from "./componentstatus.mjs";

import ComponentDescriptor, { ComponentContext }    from "../component/componentcontext.mjs";

import { ErrComponentNotFound, ErrIrregularComponent, ErrComponentIdMissing, ErrComponentStatus, ErrNoServiceComponent }  from '../errors.mjs';

export default class BaseController extends Reporter(EventEmitter) {

    constructor(id, base) {
        super();
        this._id = id;
        this._plugins = [];
        this._registry = new Registry();
        this._cache = new Cache();
        // caution: This resolver resolves the location, not the component.
        // resolving the component means resolving its dependencies
        this._resolver = null;
        this._loader = new ComponentLoader();
        this._log = [];
        this._base = base;
        this.ComponentDescriptor = ComponentDescriptor;

        this.observers = [];

        this._ready();
    }

    static baseCwd(id) {
        let base = new URL(process.cwd() + '/', 'file:///');
        return new this(id, base);
    }

    async _ready() {
        this.emit('ready', { controller: this });
    }

    /*
     * config API
     */

    /*
     * EventEmitter implementation
     */

    get publishes() {
        return {
            ready:          'Component controller ready',
            exit:           'Component controller exit',
            observe:        'Component Observer added',
            unobserve:      'Component Observer removed',
            installing:     'Component installing',
            installed:      'Component installed',
            resolving:      'Component resolving',
            resolved:       'Component resolved',
            starting:       'Component starting',
            started:        'Component started',
            stopping:       'Component stopping',
            stopped:        'Component stopped',
            updating:       'Component updating',
            updated:        'Component updated',
            uninstalling:   'Component uninstalling',
            uninstalled:    'Component uninstalled'
        };
    }

    /*
     * system management
     */

    async exit() {
        let componentids = this._registry.keys();
        await forEach(componentids, async (componentId) => {
            await this.stopIfService(componentId);
            // await this.uninstall(componentId);   // no need to uninstall!
        });
        this.emit('exit', { controller: this });
    }

    /*
     * management API
     */

    /**
     * Check what is found at the path and install it if it is a component
     * Return the component ID in case of a proper install, throw error otherwise
     *
     * Use the returned ID for all other actions
     *
     * @param   {String}    path - path ot the component
     * @param   {String}    loader - loader to use
     * @return  {Boolean}   if the component has been isntalled
     * @throws  {ErrComponentNotFound | ErrIrregularComponent}
     */
    async install(path, loader) {
        let context;
        let status = new ComponentStatus();
        let componentid;
        // check if the component is already installed
        try {
            if (path instanceof ComponentContext) {
                componentid = path.id;
                context = await this._resolver.resolveDescriptor(path);
            } else {
                let id = this._registry.keyForPath(path);
                componentid = id;
                if (id) {
                    this._log.push({what: `component already installed: '${componentid}'`});
                    this.logger.info(`component already installed: '${componentid}'`);
                    return true;
                }

                // todo: introduce a remote resolver if used on a reliant node
                context = await this._resolver.resolve(path);
            }
            if (!context) {
                this._log.push({what: `can't install component '${componentid}'`, error: { message: `'${componentid}' can't be resolved`}});
                this.logger.error(`can't install component '${componentid}'`);
                return false;
            }

            if (context.error) {
                let e = context.error;
                this._log.push({what: `can't install component '${componentid}'`, error: e});
                this.logger.error(`can't install component '${componentid}'`, e);
                return false;
            }

            if (!componentid) {
                context.error = ErrComponentIdMissing(`component descriptor has no 'id' which is mandatory`);
                return false;
            }

            // todo: start lifecycle and send events
            context.status = status;
            // before install --> 'installing'
            status.install();
            this.emit('installing', { descriptor: context });

            if (loader) {
                if (!loader.parent) loader.parent = this._loader;
            } else {
                loader = this._loader;
            }

            await loader.load(context);          // the component will also be available in the descriptor

            this._registry.set(componentid, context, path);       // the context in the registry
            this._mirror()[componentid] = context.component;      // build mirror as shortcut for easy access

            // check it component is a service component
            await this._installService(context);

            // now it's installed
            status.installed();
            // if (context.oninstall && isFunction(context.oninstall)) context.oninstall(context.component);

            this.emit('installed', { descriptor: context });
            this._notifyInstall(context);

            return true;
        } catch (e) {
            let err = ErrIrregularComponent(path, e);
            // return component status to uninstalled
            if (context) {
                context.error = err;
                this._registry.delete(context.id);
                if (this.hasOwnProperty(context.id)) delete this[context.id];
            }
            status.forceuninstall();
            this._log.push({what: `Can't install component '${componentid}'`, error: err});
            this.logger.error(`Can't install component '${componentid}'`, e);
            return false;
        }
    }

    async uninstall(componentID) {
        let context;
        try {
            context = this._get(componentID);
            context.status.uninstall();
            this.emit('uninstalling', { context });
            // if (context.oninstall && isFunction(context.onuninstall)) context.onuninstall(context.component);
            this._registry.delete(componentID);
            delete this._mirror()[componentID];
            await this._uninstallService(context);
            context.status.uninstalled();
            this.emit('uninstalled', { context });
            this._notifyUninstall(context);
            return true;
        } catch (e) {
            let err = ErrComponentStatus(componentID, e);
            if (context) {
                context.error = err;
                context.status.forceuninstall();
            }
            this._log.push({what: `UNINSTALL '${componentID}'`, error: err});
            this.logger.error(`error at uninstall component '${componentID}'`, e);
            return false;
        }
    }

    // todo: implement the update itself!
    async update(componentID) {
        let context;
        try {
            context = this._get(componentID);
            context.status.update();
            this.emit('updating', { context });
            // if (context.onupdate && isFunction(context.onupdate)) context.onupdate(this);
            await this._updateService(context);
            context.status.updated();
            this.emit('updated', { context });
            return true;
        } catch (e) {
            let err = ErrComponentStatus(componentID, e);
            if (context) context.error = err;
            this._log.push({what: `UPDATE '${componentID}'`, error: err});
            this.logger.error(`can't update component '${componentID}'`, e);
            return false;
        }
    }

    async resolve(componentID) {
        let context;
        try {
            context = this._get(componentID);
            context.status.resolve();
            this.emit('resolving', { context });
            // resolving the component means resolving its dependencies
            // todo: check specified dependencies and install them
            //       this must be doen async, because the required components may be avaliable at any later time
            //       this component keeps resolving until the dependencies are available
            // todo?: timeout of state 'resolving', then uninstall
            // if (context.onresolve && isFunction(context.onresolve)) context.onresolve(this);
            await this._resolveService(context);
            context.status.resolved();
            this.emit('resolved', { context });
            // the 'install' notification should be sent here
            return true;
        } catch (e) {
            let err = ErrComponentStatus(componentID, e);
            if (context) context.error = err;
            this._log.push({what: `RESOLVE '${componentID}'`, error: err});
            this.logger.error(`can't resolve component '${componentID}'`, e);
            return false;
        }
    }

    async startIfService(componentID) {
        try {
            let context = this._get(componentID);
            if (context.isService) this.start(componentID);
        } catch (e) {
            this.logger.debug(`Error at controller#startIfService`, e);
        }
    }

    async start(componentID) {
        let context;
        // only for service components
        try {
            context = this._get(componentID);
            if (!context.isService) {
                this.logger.info(`Component ${componentID} is not a service; can't be started`);
                return false;
            }
            context.status.start();
            this.emit('starting', { context });
            // if (context.onstart && isFunction(context.onstart)) context.onstart(this);   // don't supply too much possibilities
            await this._startService(context);
            context.status.started();
            this.emit('started', { context });
            this._notifyStarted(context);
            return true;
        } catch (e) {
            let err = ErrComponentStatus(componentID, e);
            if (context) context.error = err;
            this._log.push({what: `START '${componentID}'`, error: err});
            this.logger.error(`can't start component '${componentID}'`, e);
            if (context) context.status.forcestop();
            return false;
        }
    }

    async stopIfService(componentID) {
        try {
            if (this.isStarted(componentID)) this.stop(componentID);
        } catch (e) {
            this.logger.debug(`Error at controller#stopIfService`, e);
        }
    }

    async stop(componentID) {
        let context;
        // only for service components
        try {
            context = this._getService(componentID);
            context.status.stop();
            // if (context.onstop && isFunction(context.onstop)) context.onstop(this);  // don't supply too much possibilities
            this.emit('stopping', { context });
            await this._stopService(context);
            context.status.stopped();
            this.emit('stopped', { context });
            this._notifyStopped(context);
            return true;
        } catch (e) {
            let err = ErrComponentStatus(componentID, e);
            if (context) context.error = err;
            this._log.push({what: `START '${componentID}'`, error: err});
            this.logger.error(`error stopping component '${componentID}'`, e);
            if (context) context.status.forcestop();
            return false;
        }
    }

    isInstalled(componentID) {
        let context = this._get(componentID);
        return (context)
            ? context.status.isInstalled
            : false;
    }

    isStarted(componentID) {
        let context = this._get(componentID);
        return (context)
            ? context.status.isStarted
            : false;
    }

    idForPath(path) {
        return this._registry.keyForPath(path);
    }

    /*
     * components API
     */

    list() {
        const entries = {};
        this._registry.keys().forEach(id => entries[id] = this._registry.get(id));
        return entries;
    }

    exists(id) {
        return this._registry.has(id);
    }

    descriptor(id) {
        return this._get(id);
    }

    // **** private

    _get(componentID) {
        let context = this._registry.get(componentID);
        if (!context) throw ErrComponentNotFound(componentID);
        return context;
    }

    _getService(componentID) {
        let context = this._get(componentID);
        if (!context.isService) throw ErrNoServiceComponent(componentID);
        return context;
    }

    // mirror on universe
    _mirror() {
        if (!myuniverse().components) myuniverse().components = {};
        return myuniverse().components;
    }

    /*
     * Service Components
     */

    async _installService(context) {
        if (context.isService) {
            context.service = context.component.service || context.component.default;
            await Promise.resolve(context.service.install());
        }
    }

    async _uninstallService(context) {
        if (context.service)  await Promise.resolve(context.service.uninstall());
    }

    async _resolveService(context) {
        if (context.service)  await Promise.resolve(context.service.resolve());
    }

    async _startService(context) {
        if (context.service)  await Promise.resolve(context.service.start());
    }

    async _stopService(context) {
        if (context.service)  await Promise.resolve(context.service.stop());
    }

    async _updateService(context) {
        if (context.service)  await Promise.resolve(context.service.update());
    }

    /*
     * Observer API
     */

    _isStatus(id, status) {
        return new Promise((resolve, reject) => {
            try {
                const ctrl = this;
                const observer = {observes: id};
                // todo: check if this is a valid status
                observer[status] = (descriptor) => {
                    ctrl.forget(observer);
                    resolve();
                };
                this.observe(observer)
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * add arbitrary observer object comprised of
     * - observes - can be an id, a tag or filter function
     * - installed
     * - started
     * - stopped
     * - uninstalled
     */
    observe(observer) {
        const observes = observer.observes;
        observer.select = isFunction(observes)
                            ? observes
                            : (descriptor) => descriptor.id === observes || descriptor.tags.indexOf(observes) > -1;
        if (!observer.installed)    observer.installed = () => {};
        if (!observer.started)      observer.started = () => {};
        if (!observer.stopped)      observer.stopped = () => {};
        if (!observer.uninstalled)  observer.uninstalled = () => {};
        this.emit('observe', { observer });
        this.observers.push(observer);
        this._replay(observer);
    }

    forget(observer) {
        let b4len = this.observers.length;

        this.observers = this.observers.filter(_observer => _observer !== observer);
        this.emit('unobserve', { observer });

        return this.observers.length < b4len;
    }

    // **** observer private
    async _notifyInstall(descriptor) {
        this._observersFor(descriptor).forEach(observer => this._notify('install', () => observer.installed(descriptor)));
    }

    async _notifyStarted(descriptor) {
        this._observersFor(descriptor).forEach(observer => this._notify('start', () => observer.started(descriptor)));
    }

    async _notifyStopped(descriptor) {
        this._observersFor(descriptor).forEach(observer => this._notify('stop', () => observer.stopped(descriptor)));
    }

    async _notifyUninstall(descriptor) {
        this._observersFor(descriptor).forEach(observer => this._notify('uninstall', () => observer.uninstalled(descriptor)));
    }

    async _replay(observer) {
        const descriptors = this._descriptorsFor(observer);
        descriptors.forEach(descriptor => {
            // todo: analyse state history and send also 'stop' and 'uninstall' notifications
            if (descriptor.status.isInstalled) {
                this._notifyInstall(descriptor);
            }
            if (descriptor.status.isStarted) {
                this._notifyInstall(descriptor);
                this._notifyStarted(descriptor);
            }
        })
    }

    _observersFor(descriptor) {
        return this.observers.filter(observer => observer.select(descriptor));
    }

    _descriptorsFor(observer) {
        return this._registry.descriptors.filter(descriptor => observer.select(descriptor));
    }

    async _notify(topic, fn) {
        setTimeout(() => {
            try {
                fn();
            } catch (e) {
                this._log.push({what: `notify '${topic}'`, error: e});
                this.logger.error(`error notify '${topic}' observer`, e);
            }
        } , 0);
    }

    // implement 'deferredPropety'

    async deferredProperty(name) {

    }

    /*
     * Component import/require API
     */


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

    /**
     * add a plugin to the controller. the controller sends state changes
     * 'ready', 'pause' and 'end' to the plugins. The plugins themselfs
     * are responsible to use the controllers API like 'install' properly.
     *
     * @param {ControllerPlugin} controllerplugin
     */
    addPlugin(controllerplugin) {
        try {
            controllerplugin.controller(this);
            controllerplugin.ready();
            this._plugins.push(controllerplugin);
        } catch (e) {
            this._log.push({what: "can't add plugin", error: e});
            this.logger.error("can't add plugin", e);
        }
    }

    removePlugin(controllerplugin) {

    }
}
