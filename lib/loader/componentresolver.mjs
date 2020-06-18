import util                         from '/util';
import fs                           from '/fs';
import path                         from "/path";

import rnd                          from "/evolux.universe";

import ComponentDescriptor, { ComponentContext } from '../component/componentcontext.mjs';
import {ErrComponentNotFound, ErrIrregularComponent} from '../errors.mjs';

const exists                        = util.promisify(fs.exists);
const stat                          = util.promisify(fs.stat);
const readFile                      = util.promisify(fs.readFile);

/**
 * The ModuleResolver analyses what is found at the specified location and checks what kind
 * of module - if so - we have.
 *
 * currently only local file path
 * todo: extend to URI's; also IPFS
 *
 * Modules:
 *  - node  ... directory containing a 'package.json' file
 *              take module information to choose between ES6 modules and CommonJS
 *  - .mjs  ... takes the default export either as 'installable' (will be wrapped if it is not)
 *              or if it is a ComponentDescriptor
 *  - .json ... TBD
 *
 * @author: Bernhard Lukassen
 */


const JSEXT = ['.js', '.mjs'];

export default class ComponentResolver {

    constructor(base) {
        this._base = base;
    }


    async resolve(relpath) {
        let url = new URL(relpath, this._base);
        let path = url.pathname;
        let descriptor = ComponentDescriptor({ href: url.href });
        return await this.resolveDescriptor(descriptor);
    }

    async resolveDescriptor(descriptor) {
        let url = new URL(descriptor.href, this._base);
        let location = url.pathname;

        if (thoregon.isThoregonModule(location)) {
            descriptor.href = location;
            return descriptor;
        } else if (!await exists(location))  {
            descriptor.error = ErrComponentNotFound(location);
        } else {
            let stats = await stat(location);
            if (stats.isDirectory()) {
                return await this._resolvePackage(descriptor, url);
            } else if (stats.isFile()) {
                return await this._resolveScript(descriptor, url);
            } else {
                // whatever this is, it is not supported
                descriptor.error = ErrIrregularComponent(location);
            }
        }
        return descriptor;
    }

    async _resolveScript(descriptor, url) {
        let location = url.pathname;
        let ext = path.extname(location);
        if (JSEXT.includes(ext)) {
            let module = await import(location);
            let defaultexport = module.default;
            if (defaultexport instanceof ComponentContext) {
                if (defaultexport.component) {
                    return defaultexport;
                } else if (defaultexport.href) {
                    defaultexport.href = this.buildHref(this.locationDir(location),defaultexport.href);
                    return await this.resolveDescriptor(defaultexport);
                } else {
                    this.ensureId(defaultexport);
                    return defaultexport;   // resolve the descriptor again?
                }
            } else {
                // build descriptor
                this.ensureId(descriptor);
                descriptor.type = 'script';
                descriptor.component = module;      // cache the loaded module; loader don't need to import again
                return descriptor;
            }
        } else {
            // todo: JSON files
            descriptor.error = ErrIrregularComponent(location);
        }
    }

    /**
     * Checks if the direc
     * @param descriptor
     * @param url
     * @private
     */
    async _resolvePackage(descriptor, url) {
        descriptor.type = 'package';
        let location = url ? url.pathname : descriptor.href;
        let packagepath = path.join(location, "package.json");
        if (!await exists(packagepath)) {
            descriptor.error = ErrIrregularComponent(`no 'package.json' found in '${location}'`);
            return descriptor;
        }
        descriptor.href = location;

        let packagedefinition = JSON.parse(new String(await readFile(packagepath)));

        // just copy basic information. Loading the component is the responsibility of the loaders from 'evolux.universe'.
        if (packagedefinition.name)         descriptor.displayName = packagedefinition.name;
        if (packagedefinition.description)  descriptor.description = packagedefinition.description;
        if (packagedefinition.version)      descriptor.version = packagedefinition.version;

        // an id is neccessary
        this.ensureId(descriptor);

        return descriptor;
    }

    buildHref(base, location) {
        return 'file://' + ((location.startsWith('/')) ? location : path.join(base, location));   // todo: handle URL's!
    }

    locationDir(location) {
        return fs.lstatSync(location).isDirectory() ? location : location.substr(0, location.lastIndexOf('/'));
    }

    ensureId(descriptor) {
        if (!descriptor._id) descriptor._id = rnd(32);
    }

}
