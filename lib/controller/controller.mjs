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
 *
 * @author: blukassen
 */

import ComponentResolver            from "../loader/componentresolver.mjs";
import BaseController               from "./basecontroller.mjs";

export default class Controller extends BaseController {

    constructor(id, base) {
        super(id, base);

        // caution: This resolver resolves the location, not the component.
        // resolving the component means resolving its dependencies
        this._resolver = new ComponentResolver(base);
    }

}
