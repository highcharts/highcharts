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

* [Updating a module with shared code](#updating-a-module-with-shared-code)

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

Not every new module requires changes in Webpack:

* [Adding a self-contained module](#adding-a-self-contained-module)

* [Adding a module with shared code](#adding-a-module-with-shared-code)


### Adding a self-contained module

If the module is self-contained without code required by other modules, you do not need to change anything in Webpack.

If the module requires other modules (or products) to function properly, just make sure to list all required modules in the doclet of the masters file.
The order of the `@requires` tags is important and should follow the logical dependencies.
Circular dependencies must be avoided.

**Example:**

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
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
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
This helps Webpack to make the correct decision when to bundle the code and when to expect the code on the product namespace.

**Example:**

```TypeScript
// File: ts/masters/modules/example.src.ts
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
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import ExampleClass from '../../Extensions/ExampleClass.js';
const G: AnyRecord = Highcharts;
G.ExampleClass = G.ExampleClass || ExampleClass;
export default Highcharts;
```

```TypeScript
// File: ts/masters/modules/second-example.src.ts
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
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import SecondExample from '../../Extensions/SecondExample.js';
const G: AnyRecord = Highcharts;
G.SecondExample = G.SecondExample || SecondExample;
export default Highcharts;
```

Now an entry in `externals.json` is needed, to inform Webpack about the namespace property for `ExampleClass` as used by `SecondExample`.

```JSON
// File: tools/webpacks/externals.json
[{
    "files": ["Extensions/ExampleClass"],
    "included": ["modules/example"],
    "namespacePath": ".{name}"
}]
```

Updating a module with shared code
----------------------------------

Webpack provides an callback option where one can define dynamically, whether a file for the current bundle should be included.
Our callback system can be found in `externals.mjs` with the related definitions in `externals.json`.

In `externals.json` you define which code files should go into which bundle and otherwise be accessible under a certain namespace path.
The root namespace should not be defined to keep the flexibility over multiple product namespaces.

Each entry is an object with the following properties:

* `files`: Defines the matches that are covered by this entry.

* `included`: Defines the masters files that should bundle the covered file matches.
  An empty array defaults to the default product master (`highcharts`).

* `namespacePath`: This point to the namespace property when the files are not bundled.
  - It reflects the namespace assignment that happens in the masters files (the ones in `included`).
  - A leading dot will be replaced with the shared product namespace.
  - A `{name}` pattern will be replaced with the imports file name (without file extension).
  - If the export of a file is merged into the namespace root itself, then you can keep the namespace empty.

**Examples:**

```JSON
[
    {
        "files": [
            "Stock/Indicators/SMA/SMAIndicator"
        ],
        "included": [
            "module/stock"
        ],
        "namespace": ".Series.types.sma"
    },
    {
        "files": [
            "Shared/TimeBase",
        ],
        "included": [], // = highcharts
        "namespace": ".Time"
    },
    {
        "files": [
            "Core/Utilities"
        ],
        "included": [],
        "namespace": "" // Utilities properties are part of the namespace itself.
    }
]
```


Adding a product
----------------

Completely new products will usually need a new configuration, that contains:

* The target folder to place bundles in.

* Information about the bundle structure.

* The externals callback for complex products with module system.

* Plugins to adjust masters doclet and bundle structure.

**Example:**

```JavaScript
const masterFile = './code/product/es-modules/masters/product.src.js'.replaceAll(Path.sep, Path.posix.sep);
const masterPath = Path.posix.relative('./code/product/es-modules/masters/', masterFile);
const masterName = masterPath.replace(/(?:\.src)?\.js$/u, '');
export default [{
    entry: masterFile,
    experiments: { outputModule: true },
    externals = [(info) => {
        const contextPath = FSLib.path([info.context, info.request], true);
        if (contextPath.includes('masters')) {
            return makeExternals(
                info,
                masterName,
                mastersFolder,
                namespace,
                'module-import'
            );
        } else {
            return resolveExternals(
                info,
                masterName,
                sourceFolder,
                namespace,
                productMasters[0],
                'module-import'
            );
        }
    }],
    mode: 'production',
    module: { rules: [ {
        test: /\.src\.js$/u,
        exclude: /node_modules/u,
        use: {
            loader: Path.posix.join(import.meta.dirname, 'plugins/MastersLoader.mjs'),
            options: {
                mastersFolder: Path.posix.dirname(mastersFile),
                requirePrefix: 'highcharts'
            }
        }
    } ] },
    output: {
        filename: masterPath,
        globalObject: 'this',
        library: { type: 'modern-module' },
        module: true,
        path: Path.resolve('./code/product/esm/')
    },
    plugins: [new ProductMetaPlugin({ productName: 'Product' })]
}];
```


Fixing a Webpack bug
--------------------

Before hunting for the bug, take a minute to understand our plugins.

* `externals.mjs`: This Webpack callback decides, whether a file should be bundled or can be expected on the namespace.
  In `externals.json` can you map imports to the namespace and modules.
  If a file is not mentioned in `externals.mjs` it gets always bundled as an import.
  **Note:** Changes in this file affect all webpack configurations, means all product teams have to review these changes.

* `plugins/MastersLoader.mjs`: This is a Webpack loader to prepare masters files for ESM bundling.
  It adds all `@requires` modules of a master file as imports to auto-resolve.
  The imports then can be picked up in the externals callback to make them mandatory external as in `highcharts.webpack.mjs`.

* `plugins/Error16Plugin.mjs`: The Webpack plugin adds error 16 to product UMD bundles.
   It gets raised when multiple products with the same namespace are loaded.

* `plugins/ProductMetaPlugin.mjs`: Here the meta placeholder in the doclet of the masters file get replaced.

* `plugins/UMDExtensionPlugin.mjs`: With this Webpack plugin the shared product namespace is added to all UMD loaders.
  By default the Webpack plugin only adds a namespace to the classic global fallback, while UMD loaders are expected to solve dependencies by file path.

**Hints:**

* If produced bundles are not working at all, it is likely an issue with the regular expression of the plugins.

* If webpack is not working, it is more likely an issue with the configuration, the externals callback, or the MastersLoader.
