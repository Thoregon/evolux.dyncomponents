/**
 * This is the controller for dyncomponents. the controller acts as an API facade,
 * providing information about installed components and the lifecyle methods to
 * install, uninstall, start and stop components.
 *
 * It is responible for dispatching
 *
 * There exists standard 'loaders' and 'plugins' to get started.
 * Other 'loaders' and 'plugins' can be itself installed as components.
 *
 * todo: install components used for boot with 'import' as components;
 * todo: make the dyncomponents itself updatable; enable rollback
 * todo: enable testing: blue/green system, canary
 * todo: persistent logging. use components which  will be installed
 *
 * @author: blukassen
 */

import Registry             from "./registry.mjs";
import Cache                from "../loader/cache.mjs";
import ComponentResolver    from "../loader/componentresolver.mjs";
import ComponentLoader      from "../loader/componentloader.mjs";
import ComponentStatus      from "./componentstatus.mjs";
import ServiceComponent     from "../component/servicecomponent.mjs";

import { ErrComponentNotFound, ErrIrregularComponent, ErrComponentIdMissing, ErrComponentStatus, ErrNoServiceComponent }  from '../errors.mjs';

export default class Controller {

    constructor(id, base) {
        this._id        = id;
        this._logger    = universe.logger;
        this._plugins   = [];
        this._registry  = new Registry();
        this._cache     = new Cache();
        // caution: This resolver resolves the location, not the component.
        // resolving the component means resolving its dependencies
        this._resolver  = new ComponentResolver(base);
        this._loader    = new ComponentLoader();
        this._log       = [];
        this._stage     = universe.stage;
        this._base      = base;

        // todo: used evolox.pubsub
        this._observers = {
            installing:     [],
            installed:      [],
            resolving:      [],
            resolved:       [],
            starting:       [],
            started:        [],
            stopping:       [],
            stopped:        [],
            updating:       [],
            updated:        [],
            uninstalling:   [],
            uninstalled:    []
        };
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
        let descriptor;
        let status = new ComponentStatus();
        // check if the component is already installed
        try {
            let id = this._registry.keyForPath(path);
            if (id) {
                this._log.push({ what: `component already installed: '${path}'`});
                this._logger.info(`component already installed: '${path}'`);
                return true;
            }

            descriptor = await this._resolver.resolve(path);
            if (descriptor.error) {
                this._log.push({ what: `can't install component '${path}'`, error: e});
                this._logger.error(`can't install component '${path}' -->`, e.stack ? e.stack : e.message);
                return false;
            }

            if (!descriptor.id) {
                descriptor.error = ErrComponentIdMissing(`component descriptor has no 'id' which is mandatory`);
                return false;
            }

            // todo: start lifecycle and send events
            descriptor.status = status;
            // before install --> 'installing'
            status.installing();

            if (loader) {
                if (!loader.parent) loader.parent = this._loader;
            } else {
                loader = this._loader;
            }

            await loader.load(descriptor);          // the component will also be available in the descriptor

            this._registry.set(descriptor.id, descriptor, path);

            // check it component is a service component
            this._installService(descriptor);

            // now it's installed
            status.installed();

            if (descriptor.oninstall) descriptor.oninstall(descriptor);

            return true;
        } catch (e) {
            let err = ErrIrregularComponent(path, e);
            // return component status to uninstalled
            if (descriptor) descriptor.error = err;
            status.forceuninstall();
            this._log.push({ what: `Can't install component INSTALL '${path}'`, error: err});
            this._logger.error(`Can't install component '${path}'`, e.stack ? `\n${e.stack}` : ` --> ${e.message}`);
            return false;
        }
    }

    async uninstall(componentID) {
        let context;
        try {
            context = this._get(componentID);
            context.status.uninstall();
            if (descriptor.oninstall) descriptor.onuninstall(context);
            this._registry.delete(componentID);
            await this._uninstallService(context);
            context.status.uninstalled();
            return true;
        } catch (e) {
            let err = ErrComponentStatus(componentID, e);
            if (context) {
                context.error = err;
                context.status.forceuninstall();
            }
            this._log.push({ what: `UNINSTALL '${componentID}'`, error: err});
            this._logger.error(`error at uninstall component '${path}'`, e.stack ? `\n${e.stack}` : ` --> ${e.message}`);
            return false;
        }
    }

    // todo: implement the update itself!
    async update(componentID) {
        let context;
        try {
            context = this._get(componentID);
            context.status.update();
            await this._updateService(context);
            context.status.updated();
            return true;
        } catch (e) {
            let err = ErrComponentStatus(componentID, e);
            if (context) context.error = err;
            this._log.push({ what: `UPDATE '${componentID}'`, error: err});
            this._logger.error(`can't update component '${path}'`, e.stack ? `\n${e.stack}` : ` --> ${e.message}`);
            return false;
        }
    }

    async resolve(componentID) {
        let context;
        try {
            context = this._get(componentID);
            context.status.resolve();
            // resolving the component means resolving its dependencies
            // todo: check specified dependencies and install them
            //       this must be doen async, because the required components may be avaliable at any later time
            //       this component keeps resolving until the dependencies are available
            // todo?: timeout of state 'resolving', then uninstall
            await this._resolveService(context);
            context.status.resolved();
            return true;
        } catch (e) {
            let err = ErrComponentStatus(componentID, e);
            if (context) context.error = err;
            this._log.push({ what: `RESOLVE '${componentID}'`, error: err});
            this._logger.error(`can't update component '${path}'`, e.stack ? `\n${e.stack}` : ` --> ${e.message}`);
            return false;
        }
    }

    async start(componentID) {
        let context;
        // only for service components
        try {
            context = this._getService(componentID);
            context.status.start();
            await this._startService(context);
            context.status.started();
            return true;
        } catch (e) {
            let err = ErrComponentStatus(componentID, e);
            if (context) context.error = err;
            this._log.push({ what: `START '${componentID}'`, error: err});
            this._logger.error(`can't start component '${path}'`, e.stack ? `\n${e.stack}` : ` --> ${e.message}`);
            if (context) context.status.forcestop();
            return false;
        }
    }

    async stop(componentID) {
        let context;
        // only for service components
        try {
            context = this._getService(componentID);
            context.status.stop();
            await this._stopService(context);
            context.status.stopped();
            return true;
        } catch (e) {
            let err = ErrComponentStatus(componentID, e);
            if (context) context.error = err;
            this._log.push({ what: `START '${componentID}'`, error: err});
            this._logger.error(`error stopping component '${path}'`, e.stack ? `\n${e.stack}` : ` --> ${e.message}`);
            if (context) context.status.forcestop();
            return false;
        }
    }

    idForPath(path) {

    }

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

    /*
     * Service Components
     */

    _installService(context) {
        if (context.isService) {
            context.service = new context.module.default();
            context.service.install();
        }
    }

    _uninstallService(context) {
        if (context.service) context.service.uninstall();
    }

    _resolveService(context) {
        if (context.service) context.service.resolve();
    }

    _startService(context) {
        if (context.service) context.service.start();
    }

    _stopService(context) {
        if (context.service) context.service.stop();
    }

    _updateService(context) {
        if (context.service) context.service.update();
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
            this._log.push({ what: "can't add plugin", error: e});
            this._logger.error("can't add plugin", e.message);
        }
    }

    removePlugin(controllerplugin) {

    }

    // **** Observers

}
