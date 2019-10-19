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

import Loader               from './loader.mjs';

export default class ComponentLoader extends Loader {

    constructor(props) {
        super(props);
    }

    get id() {
        return "evolux.dyncomponents.root";
    }

    async load(descriptor) {
        descriptor.loader = this;
        if (descriptor.component) return true;
        descriptor.component = await import(descriptor.href);
        return descriptor;
    }

}
