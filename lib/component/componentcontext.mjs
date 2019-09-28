/**
 * With the default export a descriptor for arbitrary components can be defined.
 * Describe where to find the component.
 * Specify dependencies if it is not a self contained component. The mandatory dependencies
 * will be installed in resolve phase.
 * If needed, provide hooks for component state changes. Param = component context.
 *  - oninstall     ... invoked after component is installed, error prevents resolve
 *  - onresolve     ... invoked after component is resolved, error prevents start
 *  - onstart       ... invoked after component is started
 *  - onstop        ... invoked before component is stopped
 *  - onuninstall   ... invoked before component is uninstalled
 *
 * The class works as the context to handle the component
 *
 * @author: Bernhard Lukassen
 */

import ServiceComponent             from "./servicecomponent.mjs";

export class ComponentContext {

    constructor({
                    id =            undefined,
                    displayName =   undefined,
                    category =      undefined,
                    description =   undefined,
                    href =          undefined,
                    version =       undefined,
                    dependencies =  [],
                    optional =      [],
                    oninstall =     (context) => { },
                    onresolve =     (context) => { },
                    onstart =       (context) => { },
                    onstop =        (context) => { },
                    onuninstall =   (context) => { },
                } = {}) {
        Object.assign(this, { id, category, href, oninstall, onstart, onstop, onuninstall, status: null, module: null });
    }

    get isService() {
        return this.module && this.module.default && (this.module.default instanceof ServiceComponent);
    }

}

export default (opts) => new ComponentContext(opts);
