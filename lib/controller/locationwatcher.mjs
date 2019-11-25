/**
 * Watches local directories to install, uninstall and update components
 *
 * Is only instantiated if the is a local filesystem and the component 'chokidar'
 * is available
 *
 * @author: blukassen
 */
import util                         from '/util';
import fs                           from '/fs';

import chokidar                     from '/chokidar';
import ControllerPlugin             from '../controller/controllerplugin.mjs';
import { ErrLocationNotFound }      from '../errors.mjs';

const exists                        = util.promisify(fs.exists);
const stat                          = util.promisify(fs.stat);

export default class LocationWatcher extends ControllerPlugin {

    constructor(location) {
        super();
        this._location = location;
    }

    ready() {
        this._setupFileListener();
    }

    pause() {
        this._unwatch();
    }

    end() {
        this._unwatch();
    }

    /*
     * private - watcher behavior
     */

    async _setupFileListener() {
        if (this.watcher) return;
        if (!fs.existsSync(this._location)) throw ErrLocationNotFound(this._location);

        let watcher = chokidar.watch(this._location, {
            persistent: true,
            followSymlinks: true,
            alwaysStat: true,
            ignorePermissionErrors: true
        });
        this.watcher = watcher;
        watcher.on('add',       path => this._foundComponent(path));
        watcher.on('change',    (path, stats) => this._changedFile(path, stats));
        watcher.on('unlink',    (path, stats) => this._removeFile(path, stats));

        // dir events; currently not in use because all add and unlink events come individually for each file
        // watcher.on('addDir',    (path, stats) => this._addDir(path, stats));
        // watcher.on('unlinkDir', (path, stats) => this._removeDir(path, stats));
    }

    _unwatch() {
        if (!this.watcher) return;

        this.watcher.close();
        delete this.watcher;
    }

    async _foundComponent(path) {
        let controller = this._controller;
        await controller.install(path);
        let id = this._controller.idForPath(path);
        if (!id) {
            // was not installed
            this._controller.logger.error(`LocationWatcher: Component '${path} was not installed`);
            return;
        }
        await controller.resolve(id);
        await controller.startIfService(id);
    }

    async _updatedComponent(path, stats) {
        let controller = this._controller;
        let id = controller.idForPath(path);
        // todo: service lifecycle: stop - update - resolve - start
        if (id) await controller.update(id);
    }

    async _removedComponent(path) {
        let controller = this._controller;
        let id = controller.idForPath(path);
        if (id) {
            await controller.stopIfService(id);
            await controller.uninstall(id);
        }
    }
}
