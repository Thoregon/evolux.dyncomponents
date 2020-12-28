/**
 * With the default export a descriptor for arbitrary components can be defined.
 * Describe where to find the component.
 * Specify dependencies if it is not a self contained component. The mandatory dependencies
 * will be installed in resolve phase.
 *
 * Params for ComponentDescriptor (ComponentContext)
 *
 *  id              a unique id within the repository the component will be deployed
 *  displayName =   undefined,
 *  category =      undefined,
 *  description =   undefined,
 *  href =          undefined,
 *  version =       undefined,
 *  dependencies =  {},
 *  optional =      {},
 *  tags =          [],
 *  apis =          {},
 *
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

import { isFunction} from "/evolux.util";
const isService     = (obj) => !!obj && isFunction(obj.install) && isFunction(obj.uninstall) && isFunction(obj.resolve) && isFunction(obj.start) && isFunction(obj.stop) && isFunction(obj.update);

export class ComponentContext {

    /**
     * Specifiy params. Any additional params you need can also be specified
     * {
                    id =            undefined,
                    displayName =   undefined,
                    category =      undefined,
                    description =   undefined,
                    href =          undefined,
                    version =       undefined,
                    licence:        '[MIT](https://opensource.org/licenses/MIT)',
                    pricing:        {},
                    dependencies =  {},
                    optional =      {},
                    tags =          [],
                    apis =          {},
                    oninstall =     (context) => { },
                    onresolve =     (context) => { },
                    onstart =       (context) => { },
                    onstop =        (context) => { },
                    onuninstall =   (context) => { },
                }
     */
    constructor(descriptorparams = {}) {
        let params = Object.assign({
            id :            undefined,
            displayName :   undefined,
            category :      undefined,
            description :   undefined,
            href :          undefined,
            version :       undefined,
            licence:        undefined,
            pricing:        {},
            dependencies :  {},
            optional :      {},
            tags :          [],
            apis :          {},
            oninstall :     (context) => { },
            onresolve :     (context) => { },
            onstart :       (context) => { },
            onstop :        (context) => { },
            onuninstall :   (context) => { },
        }, descriptorparams);
        Object.assign(this, params);
    }

    get isService() {
        return this.component && isService(this.component.default) || this.component.service && isService(this.component.service);
    }

    get isValid() {
        return !!this.id && !!this.href;
    }

}

export default (opts) => new ComponentContext(opts);
