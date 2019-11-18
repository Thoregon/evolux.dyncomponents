/**
 *
 *
 * @author: Bernhard Lukassen
 */

export default class Controller {

    constructor(id, base) {
        this._id = id;
        this._base = base;
    }

    static baseCwd(id) {
        let base = '/';
        return new this(id, base);
    }

}
