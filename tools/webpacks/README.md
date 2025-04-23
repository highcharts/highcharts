Webpacks
========

Collection of configurations and plugins to create product bundles and additional module bundles.
Most configuration options are also covered in the [Webpack documentation](https://webpack.js.org/concepts/).


Overview
--------

* [Get started](#get-started)

* [Adding modules](#adding-modules)
  - [Adding a self-contained module](#adding-a-self-contained-module)
  - [Adding a module with shared code](#adding-a-module-with-shared-code)
  - []

* [Adding a product](#adding-a-product)

* [Fixing a Webpack bug](#fixing-a-webpack-bug)


Get started
-----------

There are three reasons to change something in the webpacks folder:

1. Add a module bundle with shared code in `externals.json`.

2. Add a new configuration for a new product.

3. Fix a bug in the bundling procedure which is most likely triggered by one of our plugins.


Adding modules
--------------

Not every module requires changes in Webpack:

* [Adding a self-contained module](#adding-a-self-contained-module)

* [Adding a module with shared code](#adding-a-module-with-shared-code)


### Adding a self-contained module

If the module is self-contained without code required by other modules, you do not need to change anything in Webpack.

If the module requires other modules (or products) to function properly, just make sure to list all required modules in the doclet of the masters file.
The order of the `@requires` tags is important and should follow the logical dependencies.
Circular dependencies must be avoided.

#### Example

```TypeScript
// File: ts/masters/module/example.src.ts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/example
 * @requires highcharts
 * @requires highcharts/highcharts-more
 *
 * Example module
 *
 * (c) 2009-2025 Highsoft AS
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import ExampleClass from '../../Extensions/ExampleClass.js';
const G: AnyRecord = Highcharts;
G.ExampleClass = G.ExampleClass || ExampleClass;
export default Highcharts;
```

In our example the `example.src.ts` module requires the Highcharts namespace from the product bundle `highcharts` and the `ExampleClass` in requires code from the module bundle `highcharts/highcharts-more`.


### Adding a module with shared code

If you module provides shared code required by other modules, you have to define the relationship in `externals.json`.
This helps Webpack to make the correct decision to decided when to bundle the code and when to expect the code on the product namespace.

#### Example

```TypeScript
// File: ts/masters/module/example.src.ts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/example
 * @requires highcharts
 * @requires highcharts/highcharts-more
 *
 * Example module
 *
 * (c) 2009-2025 Highsoft AS
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import ExampleClass from '../../Extensions/ExampleClass.js';
const G: AnyRecord = Highcharts;
G.ExampleClass = G.ExampleClass || ExampleClass;
export default Highcharts;
```

```TypeScript
// File: ts/masters/module/second-example.src.ts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/second-example
 * @requires highcharts
 * @requires highcharts/modules/example
 *
 * Example module
 *
 * (c) 2009-2025 Highsoft AS
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import ExampleClass from '../../Extensions/ExampleClass.js';
const G: AnyRecord = Highcharts;
G.ExampleClass = G.ExampleClass || ExampleClass;
export default Highcharts;
```


Updating a module with shared code
----------------------------------

@TODO

In `externals.json` you define which code files should go into which bundle and
be accessible under a certain namespace path. The root namespace should not be
defined to keep the flexibility over multiple products.

Each entry is an object to provide:
- `files`: List all imports relative to "code/es-modules".
- `included`: Only module masters that are listed in the "included" option will
  bundle the listed files if they are referenced as imports. An empty array
  defaults to the default product master (`highcharts`).
- `namespacePath`: This reflects the namespace assignment in the masters files
  (the ones in `included`).
  * A leading dot will be replaced with the shared namespace.
  * A `{name}` pattern will be replaced with the imports file name without the
    file extension.


Adding a product
----------------

@TODO



Fixing a Webpack bug
--------------------

Before hunting for the bug, take a minute to understand our plugins.

* `externals.mjs`: This Webpack callback decides, whether a file should be bundled or can be expected on the namespace.
  In `externals.json` can you map imports to the namespace and modules.

* `plugins/MastersLoader.mjs`: This is a Webpack loader to prepare masters files for ESM bundling.
  It adds all `@requires` of a master file as imports to auto-resolve.

* `plugins/Error16Plugin.mjs`: The Webpack plugin adds error 16 to product UMD bundles.
   It gets raised when multiple products with the same namespace are loaded.

* `plugins/ProductMetaPlugin.mjs`: Here the meta placeholder in the doclet of the masters file get replaced.

* `plugins/UMDExtensionPlugin.mjs`: With this Webpack plugin the shared product namespace is added to all UMD loaders.
  By default the Webpack plugin only adds a namespace to the classic global fallback, while UMD loaders are expected to solve dependencies by file path.

### Hints

* If produced bundles are not working at all, it is likely an issue with the regular expression of the plugins.

* If webpack is not working, it is more likely an issue with the configuration, the externals callback, or the MastersLoader.
