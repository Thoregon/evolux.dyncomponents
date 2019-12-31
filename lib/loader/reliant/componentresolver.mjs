import ComponentDescriptor from "../../component/componentcontext.mjs";

/**
 * this resolver forwards the resolving to the component resolver of the service
 * where every content, data as well as scripts, is loaded.
 *
 * @author: Bernhard Lukassen
 */

export default class ComponentResolver {

    constructor(base) {
        this._base = base;
    }

    async resolve(relpath) {
        let url = new URL(relpath, location.href);
        let cmppath = url.pathname;
        let descriptor = ComponentDescriptor({ href: cmppath });
        return descriptor;
    }

    async resolveDescriptor(descriptor) {
        let url = new URL(descriptor.href, location.href);
        let cmppath = url.pathname;
        descriptor.href = cmppath;
        return descriptor;
    }
}
