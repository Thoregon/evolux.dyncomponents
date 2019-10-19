/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ComponentStatus from "../lib/controller/componentstatus.mjs";

let stat = new ComponentStatus();

// do a full lifecycle
stat.install();
console.log(stat.state);
stat.installed();
console.log(stat.state);
stat.resolve();
console.log(stat.state);
stat.resolved();
console.log(stat.state);
stat.start();
console.log(stat.state);
stat.started();
console.log(stat.state);
stat.stop();
console.log(stat.state);
stat.stopped();
console.log(stat.state);
stat.update();
console.log(stat.state);
stat.updated();
console.log(stat.state);
stat.resolve();
console.log(stat.state);
stat.resolved();
console.log(stat.state);
stat.start();
console.log(stat.state);
stat.started();
console.log(stat.state);
