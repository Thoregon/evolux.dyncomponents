/**
 * Loader interface
 *
 * The loader can do whatever is necessary to provide the required module/component.
 * It can download compoents and wrap or transpile it to be usable with toregon.
 *
 * However the 'real' loading is done either by the native nodeJS Module or by
 * the browser. This loader just resolves where to load ES6 modules.
 *
 * Every Loader will have a parent except the root loader which is
 * system defined and can not be exchanged.
 *
 * Usage:
 *  just subclass an implement methods
 *
 * @author: blukassen
 */

import { ErrNotImplemented } from '../errors.mjs';

export default class Loader {

    /*
     * Implement by loaders
     */

    get id() {
        throw ErrNotImplemented('Loader.id()');
    }

    load(name, parentloader, stage) {
        throw ErrNotImplemented('Loader.resolve()');
    }

    /*
     * managemnt API
     */


}
