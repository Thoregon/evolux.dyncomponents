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

    static baseCwd(id) {
        let base = '/';
        return new this(id, base);
    }

}
