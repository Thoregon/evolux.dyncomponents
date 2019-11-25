dyncomponents
=============

AsC - Infrastructure as code

Dynamic component controller is inspired by OSGi. 
From small to large, a configuration describes which
components the target app or system needs to run.  
An execution plan will be run to create the described infrastructure.

The dyncomponents module installs itself as a component after boot.
It exposes its internals, components, the controller API, etc. as 
tru4D BoundedContext Entiries, Commands, etc. to the unverse and can be found using the starmap.

It is intended to solve the 'node_modules' hell, e.g. different versions are required.

Dyncomponents is agnostic to the type of component, whether it is a service, a storage, a libray, bounded context 
or user interface compontents. Components will be registered with a 'path' and a name.
Inspired by the CORBA component modelss, Components can publish there 'surface features' to allow clients to 
navigate and interact with it. Can be understood simmilar to hypermedia (HATEOS). Allows clients to create standard UI's. 

Inspired by Java, for infrastructure components like services, there exists 'surface features' which represents the API 
and 'darkside features' which represents the SPI.
Components of this kind can have multiple components installed at the same time. Which component will be used is specified 
by a default, accessed directly by id or choosen by a rule.
The default can by dynamically changed, an ID to ID map can be defined to exchange a component used 
by other components (clients).
The consumers get informed. (update event)

1) build a defined infrastructure by code
2) build a dynamic infrastructure depending on the environment or target (device)

Works together with 'dynlayers'.


##Loaders
Supplies a specialized loader, which plugs into loaderhierarchy from bootloader.
Component access is available for 'import' but provides a dynamic dependency injection API. 
Works with extended 'Futures' which also supports 'replaced' event.
The 'import' on the reliant (browser) side needs a specialized loader as a plugin to the browserloader, because the 
request cannot be intercepted at teh browser.  
However if used with 'import' there will be no dynamic behavior, components must be installed after boot and can not be exchanged.


discovery of installed components. Queries can be done on all component properties, as well as on properties of 
the componnent held by the component manager. 
explore comonent interface and purpose (what kind of component)

The componentcontroller of a reliant client keeps connected to its sovereign counterpart, and loads components which 
are installed at the sovereign side and are not related to infrastructure.

The component loaders rely on the underlying loaders from the universe. Means the bootloader in a 'nodeJS' souvereign 
environment, and the browserloader in a reliant peer.

Autoinstaller 
    - LocationWatcher: is available for components in a sepcified directory, multiple autoinstallers possible
    - name a fearure -> collect all neccessary components 

Registry manages for components also
    - tags
    - features
    - interfaces
    - facades

Registry for interfaces
Interface belongs to categories (at least one)

##Meshups for 
- Services
- Userinterface

build whole facades out of interfaces. Define a FacadeDescriptor requiring components, by name (not preferred), by tag 
or api. Specify the mesh how they work together, include adapters for api translation between components if necessary.

Components can be comprised of a whole bunch of other components to form an App, a Bounded Context, or a Service. 
It is even possible to reduce/extend functionality of a component, depending if other components are installed or not. 
This is also dynamic, the component will be informed if the missing component get installed or uninstalled.

##Plugins for automatic loading/unloading.
An installend component is always a tuple of a 'ComponentLoader' and a 'Component'. This is to identify from where the 
component can from. 

There exists an standardized component wrapper for components which are not 'Installable'. Every node module can be used
as a component. The dynamic dependency injection is available also if the component is not an 'Installable'.
A descriptor for the component may be created. Otherwise the componentloader takes avialable information from 'package.json':

#extension and enhancements
- extensions: subcomponents (subclasses) 
- enhancement: additional functions (on the same component/class)

##Descriptors
The descriptor can specify the following settings and behavior:

```js
export default ComponentDescriptor({
    id:             'unique_module_id',
    category:       'category_to_be_registered_in',
    displayName:    'name_to_be_displayed',     // can be omitted, then the id will be used
    href:           'url_or_path_to_module',
    dependencies:   [],
    optional:       [],
    tags:           [],
    apis:           [],
    oninstall:      (module) => { ... },
    onstart:        (module) => { ... },
    onstop:         (module) => { ... },
    onuninstall:    (module) => { ... }
});
```
    
##Name Convention for Autoloader

Defined directory structure:

    ./components
        sovereign
            headless
            headed
        reliant
            lite
            rich 

All components (and descriptors) in the base directory 'components' will be installed in all nodes


##API/SPI
Provides an registration and introspection interface for API/SPI defintions. Use to install multiple service 
components implementing the same API.

The API is also called Facade.

Rather reference an abstraction than a concretion.

A SPI is not mandatory, the API can be implemented directly. Components with an SPI mostly need a lifecycle management,
therefore a separation of API/SPI may be a better solution.  

If there is a component which can be used but does not implement the SPI, simply implement and specify an 
Adapter, a Polyfilor or a Shim.

###Schema
Supports Schema, but does not require it

###Component/Feature Detection
There is an event like API for component and feature detection. Use it when it gets available, due to an install or update.
Should be used for downward compatibility and extensibility. Users can be notified that there are more features
available when he updates or installs other component(s).

The API for component detection. The component can be addressed by an id, a tag or a filter function: 

    components.observe(idTagOrFilter, {
        installed:      (descriptor) => {},
        started:        (descriptor) => {},
        stopped:        (descriptor) => {},
        uninstalled:    (descriptor) => {},
    });

The handler functions are called reliably, regardless if the observer is registered before or after the desired event.

There is also a convention based helper 

