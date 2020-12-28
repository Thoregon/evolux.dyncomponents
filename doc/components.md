Components
==========


## Component Descriptor

The descriptor can specify the following settings and behavior:

```js
import { ComponentDescriptor } from '/evolux.dyncomponents';

export default ComponentDescriptor({
    id:             'unique_module_id',
    category:       'category_to_be_registered_in',
    displayName:    'name_to_be_displayed',     // can be omitted, then the id will be used
    href:           'url_or_path_to_module',
    licence:        'referer to a licence, can be specified as markdown e.g. [MIT](https://opensource.org/licenses/MIT)',
    pricing:        {},
    dependencies:   {},
    optional:       {},
    widgets:        {},
    main:           'main entry point',
    exports:        {},    // conditional entry points
    tags:           [],
    apis:           []
});
```

Some fields cab be taken over from 'package.json':
- main
- exports

### Dependencies

The dependencies refer to a tupel (repository, component).
The Repository will be resolved by the RepositoryResolver. 

### Optional

References to optional componentents. Gets loaded on user decission.

