Browserloader
=============

Does the same as the Loader, but as precompiled scripts for the browser - none independent clients - 
to reduce data transfer and startp time. 

Assembles a script which does the dynamic loading in the browser. 
The script will be loaded from a boot script, which detects the clients properties 
and helps to build the right loader script. 
This boot script will be referenced directly in the HTML.  
Caching of precompiled scripts is done, client get ist own signature. Client boot script will always check if 
relevant settings or information has been changed and asks the server for a replacement.

The dynamic browser loader is also reponsible for hot reloading during development
and also for updates in production.

The 'serverside' composes scripts, which can simply be loaded from the client. On the headless 'serverside' 
these scripts will be loaded with the Module class.

Check browser Memory:

    navigator.storage.estimate().then(result => console.log(result))


