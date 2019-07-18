##Loader

follows the specification from WHATWG:
- https://whatwg.github.io/loader/
- https://gist.github.com/dherman/7568080

The loader uses internal a layered architecture for each step in the pipeline to enable to exchange resolvers, translators ...
It allows e.g. to plugin to the 'resolve' step a check for vulnerabilities. 
The layers are also components which will be loaded by a bootloader. 

Loader Pipeline:

- resolve
- fetch
- translate
- instantiate


see also:
- https://exploringjs.com/es6/ch_modules.html
- https://www.bitovi.com/blog/module-loaders-master-the-pipeline

