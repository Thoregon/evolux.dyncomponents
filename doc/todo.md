ToDo
====

- separate componentloaders as segments (subcomponents) for module kinds
    - bower
    - node
    - script
    - introduce .tha ... thoregon archive

- introduce a closed context for each installed component
    - --> nodeJS: require('vm2'); https://www.heise.de/developer/artikel/JavaScript-Code-dynamisch-zur-Laufzeit-laden-und-ausfuehren-4536862.html?seite=3
    - --> browser: https://github.com/dfkaye/vm-shim, https://github.com/commenthol/safer-eval#readme
    - no access to global variables except 'universe'
    - a narrow, specialized API to move components in the browser, as well as an API for lifecycle and other important browser events
    - enables 'simulating' UI components in headless peers

- Introduce Loader/Component pairs like in java --> coordinate the loaders from universe

- extend the bootloader and browser loader to allow ES6 'import' on installed components
    --> dynamicInstantiate
     
- Component Listener for URL's better URI's to watch, find and load components from wherever, also IPFS
    - must be secured with signatures
    - implement Source, check signatures, copy to local cache and resolve
- install components used for boot with 'import' as components; 
- make the dyncomponents itself updatable; enable rollback
- enable testing: blue/green system, canary

- browser loader plugin for components
    - reliant resolver (remote for component resolver)
- rudimentary pub/sub for boot, then exchange it with the evolux.pubsub component
    - controller requires install of evolux.pubsub, listens on itself when it is installed

- use the true4D command/event procedure to update/install components
    - bounded contexts for the thoregon system and it's parts

- handle uncaught errors: restart component

- cli
    - install/uninstall components
    - start/stop components
    - list components (with status)
