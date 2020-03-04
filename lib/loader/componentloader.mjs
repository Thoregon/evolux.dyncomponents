/**
 * The component runtime environment doesn't need to know about the underlying file system to load and install components
 * The CompontentLoader defines the context for the Component, it provides a separation similar to a namespace.
 * This is the responsibility of the CompontentLoader.
 * Standard CompontentLoaders are supplied, coustom can be plugged in
 * Each CompontentLoader has a parent, except the SystemCompontentLoader, which is the top most loader.
 *
 * todo: use Source for Components from anywhere
 *
 * @author: blukassen
 */

import Loader           from './loader.mjs';
import { Reporter }     from "/evolux.supervise";

export default class ComponentLoader extends Reporter(Loader) {

    constructor(controller) {
        super();
        this.controller = controller;
    }

    get id() {
        return "evolux.dyncomponents.root";
    }

    async load(descriptor) {
        descriptor.loader = this;
        if (descriptor.component) return true;
        descriptor.component = await import(descriptor.href);

/*
    todo: refactor the whole browserloader/bootloader/moduleresolver/thoregonloader to make this working
        try {
            // todo: move to 'resolve'
            // import here has the wrong parent URL! (file:///Entw/Projects/ThoregonUniverse/evolux.modules/evolux.dyncomponents/lib/loader/componentloader.mjs)
            let url = `${descriptor.href}/@components`;
            let subcomponents = await import(url);
            await this.controller.installAll(subcomponents);
        } catch (e) {
            // this.logger.error(`import subcomponents from '${descriptor.href}'`,e);
        }
*/

        return descriptor;
    }

}
