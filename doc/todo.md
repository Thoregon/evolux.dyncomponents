ToDo
====

- Component Listener for URL's better URI's to watch, find and load components from wherever, also IPFS
    - must be secured with signatures
    - implement Source, check signatures, copy to local cache and resolve
- install components used for boot with 'import' as components; 
- make the dyncomponents itself updatable; enable rollback
- enable testing: blue/green system, canary

- rudimentary pub/sub for boot, then exchange it with the evolux.pubsub component
    - controller requires install of evolux.pubsub, listens on itself when it is installed

- use the true4D command/event procedure to update/install components
    - bounded contexts for the thoregon system and it's parts

- handle uncaught errors: restart component

- cli
    - install/uninstall components
    - start/stop components
    - list components (with status)
