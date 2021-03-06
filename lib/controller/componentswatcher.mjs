/**
 *
 *
 * @author: Bernhard Lukassen
 */

import { Reporter }                 from "/evolux.supervise";
import ComponentDescriptor          from "../component/componentcontext.mjs";
import ControllerPlugin             from '../controller/controllerplugin.mjs';

export default class ComponentsWatcher extends Reporter(ControllerPlugin) {

    constructor(props) {
        super(props);
        this._pending = new Set();
    }

    static watch(componentrootname) {
        let watcher = new this();
        watcher.componentrootname = componentrootname;
        return watcher;
    }

    /*
     * ControllerPlugin lifecycle
     */

    ready() {
        const controller = this._controller;
        controller.observe({
            observes:   'matter',
            forget:     true,           // do just once, forget after execution
            installed:  () => this.doWatch()
        });
    }

    pause() {
        if (!this.root) return;
        this.root.off();
    }

    end() {
        if (!this.root) return;
        this.root.off();
    }

    /*
     * watch components in matter
     */

    doWatch() {
        if (this.root) return;
        const root = universe.matter[this.componentrootname];
        this.root = root;
        root.on(item => this.changed(item));
    }

    async changed(item, key) {
        // check if component has been removed
        if (!item) {
            if (key) await this.remove(key);
            return;
        }

        let keys = Object.keys(item).filter(elem => !elem.startsWith('_'));
        if (!keys.length) return ;
        let componentid = keys[0];

        if (this._pending.has(componentid)) return ;
        this._pending.add(componentid);

        let descrobj = await this.root[componentid].val;

        // this is the case when the component was uninstalled (matter doesn't support direct delete, the property was set to null
        if (!descrobj) {
            await this.remove(componentid);
            this._pending.delete(componentid);
            return;
        }

        let descriptor = ComponentDescriptor(descrobj);
        if (!descriptor.isValid) {
            this._pending.delete(componentid);
            this.logger.error(`Not a valid ComponentDescriptor: `, item);
            return;
        }

        const controller = this._controller;

        const id = descriptor.id;
        let installed = await controller.install(descriptor);
        if (!installed) {
            this._pending.delete(componentid);
            // was not installed
            this.logger.error(`Component '${id}' was not installed`);
            return;
        }
        await controller.resolve(id);
        await controller.startIfService(id);
        this._pending.delete(componentid);
        this.logger.info(`Component '${id}' installed`);
    }

    async remove(id) {
        const controller = this._controller;

        if (!controller.isLoaded(id)) return;

        await controller.stopIfService(id);
        let uninstalled = await controller.uninstall(id);
        this.logger.info(`Component '${id}' ${uninstalled ? '' : 'NOT'} uninstalled`);
    }
}
