ToDo
====

- distinguish between
    - component     ... runs in own sandbox context
        - always needs a service 
        - 'component.mjs' in root directory
            - components descriptor
            - service object with 
        - specify interface, available as proxy for other components
    - library       ... imported within components to be used
        - exports from 'index.mjs'
    - don't mix lib and component 

- enable for DI (Dependency Injection)
    -> see https://nestjs.com/
- enable decorators

- Refactor for component repositories in 'matter'
    - Components
    - Dependencies
    - Versions
    - Target (browser: which, version; node: version) 

- Facades 
    - API for cmponent
    - remote Proxy providing the API to the component
    - UI compoments 
        - access to document
        - 

- Firewall/Malware
    - !aways be aware of insiders
        - contributor, but works on own account
        - double agent, is on the payroll of another
        - review process for sources, especially for basic system  
    - blacklist for address/name
    - size limits
    - plugin API for malware scanners
    - introduce a closed context for each installed component, run in separate context
        - --> nodeJS: require('vm2'); https://www.heise.de/developer/artikel/JavaScript-Code-dynamisch-zur-Laufzeit-laden-und-ausfuehren-4536862.html?seite=3
        - --> browser
            - encapsulate in Worker or iframe
                - inspired by https://github.com/substack/vm-browserify  https://github.com/browserify/vm-browserify/blob/master/index.js
            - jailed (iframe sandbox) https://github.com/asvd/jailed
            - additional jail inside iframe? -> don't think so, globals can also be controlled with vm-browserify
                - vm2 (node), save eval (browser), 
                - https://github.com/dfkaye/vm-shim, https://github.com/commenthol/safer-eval#readme
        - disable overriding of methods/properties of global objects
            - -> Object.freeze(Object), Object.freeze(Array)
                - caution: freeze is flat! (does not freeze subobjects) -> 'deepFreeze' https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze 
            - Object.prototype
            - Object.prototype.constructor
            - Array.prototype.forEach
            - ...
            - polyfills must be requested by a review 
        - limit access to global variables
            - add a first line to the imported module, redefine all globals as consts (not possible with ES6: wrap all imported modules with a funtion, the globals as parameters) 
            - universe, thoregon
                - universe.puls
            - exchange several API's from window -> proxies with message passing
                - wrap loaded code
                    - check if JSON imports can override redefinitions 
                    - if standard globals can be accessed in JSON definitions, exchange source
                - localStore
                - indexDB
            - proxies for (message passing)
                - components: specify interface
                - viewmodels and presenter
                - event listeners 
            - disable tracking and spying (https://www.heise.de/news/Browser-Ueberwachungskit-fuer-Dutzende-chinesische-Webseiten-entdeckt-6169111.html)
                - IP Address via WebRTC
                - cross domain access
                    - also websockets -> https://hackernoon.com/how-to-steal-secrets-from-developers-using-websockets-dw3p3zgk
                - fingerprinting
                - etc
        - if infected at distribution
            - how?
        - replicas of thoregon with malware included (waterhole attacks https://en.wikipedia.org/wiki/Watering_hole_attack)
            - how?
            - browser plugin which checks distribution signature
        - introduce some general APIs for local data storage, very narrow, secure access
            - BrowserFS
            - LocalDB
            - keep in mind, browser only restricts cross domain access. this means apps/components needs their own contexts
        - a narrow, specialized API to move components in the browser, as well as an API for lifecycle and other important browser events
        - enables 'simulating' UI components in headless peers
        - When Workers are available as module (ES5)
            -> SharedWorker - https://developer.mozilla.org/de/docs/Web/API/SharedWorker
            -> WorkerThread - https://nodejs.org/api/worker_threads.html, https://www.heise.de/developer/artikel/Features-von-uebermorgen-Worker-Threads-in-Node-js-4354189.html
    
    - Introduce Loader/Component pairs like in java --> coordinate the loaders from universe
        - support multiple versions of same library 

- plugins for
    - browserloader/universe-service
        -> https://serviceworke.rs/fetching.html
        -> https://serviceworke.rs/json-cache.html              get a JSON to load the packages
        -> https://serviceworke.rs/cache-from-zip.html          load all base system components in one zip
        -> https://serviceworke.rs/virtual-server.html          handle virtual resources as well as IPFS and blackchain resources
        -> https://serviceworke.rs/request-deferrer.html        defer request if offline, provide a useful replacement 
    - bootloader
        

- component mirror -> namespaces for components & subcomponents

- Component(Location)Listener for 'gun'
    - Responsibilities to install different components
    - Persistent component repository e.g. to build whole apps or extend apps

- Simple way to define composite components
    - Extended Component Descriptor
        - collection of (dependent) components
        - optional components
            - user selects
            - feature only available when component is or gets installed
    - whole apps
    - app extensions 

- add convention/configuration for dependent/optional components/features

- introduce component controller/loader plugins for checks 

- Secure Components with signatures
    - use everblack (gun SEA)
    - Signature in ComponentDescriptor

- wrap components with revocable proxies to avoid reuse after uninstall
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/revocable

- 'simulate' install of the dyncomponents itself after started
    - replay events
    - 'simulate' resolve (dependencies)
    - simulate install of Universe?
- All System Components installed during boot should be visible in 'matter.components'
    - don't install again
    - virtual content? (not stored in gun but accessible via the proxy)
- Component updates
    - System Components? 
    
- separate componentloaders as segments (subcomponents) for module kinds
    - bower
    - node
    - script
    - introduce .tha ... thoregon archive
     
- Component Listener for URL's better URI's to watch, find and load components from wherever, also IPFS
    - must be secured with signatures
    - implement Source, check signatures, copy to local cache and resolve
- install components used for boot with 'import' as components
    - implement dependencies
    - resolve cycle references
- make the dyncomponents itself updatable; enable rollback
- enable testing: blue/green system, canary

- browser loader plugin for components -> service worker
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


****************************************************
## Done

- extend the bootloader and browser loader to allow ES6 'import' on installed components
    --> dynamicInstantiate
