/**
 *
 *
 * @author: blukassen
 */

import process              from "/process";
import path                 from "/path";

import letThereBeLight      from '/evolux.universe';

// import LocationWatcher      from "../lib/controller/locationwatcher.mjs";
import Controller           from "../lib/controller/controller.mjs";

(async () => {
    try {
        const universe              = await letThereBeLight();
        const base                  = new URL(process.cwd(), 'file:///');

        const componentcontroller   = new Controller(universe.controllerid, base.href);
        // const watcher               = new LocationWatcher(path.join(process.cwd(), './components'));

        // componentcontroller.addPlugin(watcher);
    } catch (err) {
        console.log(err);
    }
})();
