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
//        let url = new URL(relpath, this._base);
//        let path = url.pathname;
        let descriptor = ComponentDescriptor({ href: relpath });
        // todo: check if it exists and set an error if not
        return descriptor;
    }

}
