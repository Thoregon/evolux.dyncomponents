componentcontroller
===================

AsC - Infrastructure as code

Dynamic component controller is inspired by OSGi. 
From small to large, a configuration describes which
components the target app or system needs to run.  
An execution plan will be run to create the described infrastructure.

The dyncomponents module installs itself as a component after boot.

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

discovery of installed components. Queries can be done on all component properties, as well as on properties of 
the componnent held by the component manager. 
explore comonent interface and purpose (what kind of component)

The componentcontroller of a reliant client keeps connected to its sovereign counterpart, and loads components which 
are installed at the sovereign side and are not related to infrastructure.

Autoinstaller (LocationWatcher) is available for components in a sepcified directory, multiple autoinstallers possible

Registry for interfaces
Interface belongs to categories (at least one)

Meshups for 
- Services
- Userinterface

Plugins for automatic loading/unloading.
An installend component is always a tuple of a 'ComponentLoader' and a 'Component'. This is to identify from where the 
component can from. 
