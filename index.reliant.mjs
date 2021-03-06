/**
 *
 *
 * @author: blukassen
 */

import Controller                           from "./lib/controller/reliant/controller.mjs";

// export { default as LocationWatcher }       from './lib/controller/locationwatcher.mjs';
export { default as ComponentsWatcher }     from './lib/controller/componentswatcher.mjs';
export { default as ComponentDescriptor }   from './lib/component/componentcontext.mjs';

// mockup for a service component; implement all methods in your class, it will be recognised automatically
export { default as ServiceComponent }      from './lib/component/servicecomponent.mjs';

export default Controller;
