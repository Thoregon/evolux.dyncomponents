/**
 * ComponentController for reliant nodes
 *
 * todo: introduce webworker listening to install components from sovereign node
 *
 * @author: Bernhard Lukassen
 */

import ComponentResolver            from "../../loader/reliant/componentresolver.mjs";
import BaseController               from "../basecontroller.mjs";

export default class Controller extends BaseController {

    constructor(id, base) {
        super(id, base);
        this._resolver = new ComponentResolver(base);
    }

    /**
     * get the base working directory
     * @param id
     * @return {Controller}
     */
    static baseCwd(id) {
        let base = '/';
        return new this(id, base);
    }

    /**
     * import a string ontaining javascript a module
     *
     * usage example:
     *  let module = await importJS("export const a = { a: 'A' };");
     *  let a = module.a;       -> { a: 'A' }
     * @param js
     * @return {Promise<*>}
     */
    static async importJS(js) {
        let url = "data:application/javascript;charset=utf-8," + encodeURIComponent(js);
        let module = await import(url);
        return module;
    }

}
