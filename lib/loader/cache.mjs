/**
 * The cache uses the local filesystem. This may be subject to change in the future
 * but doesn't change the interface of the cache
 *
 * A memory file system can be used if installed underlying.
 *
 * The cache itself stores state information, if it is missing it will be rebuilt.
 *
 * The default location is './.thoregon/jscache'
 *
 * This Cache is not used in reliant clients (browsers).
 * Then the caching of the browser will be used, and the
 * wrapped/transpiled components resides at the sovereign node.
 *
 * @author: blukassen
 */

export default class Cache {

    constructor({
                    location = './.thoregon/jscache'
                } = {}) {
        Object.assign(this, {
            location
        });
    }

    async exists(path, name) {

    }

    async get(path, name) {

    }

    async put(path, name, handle) {

    }
}
