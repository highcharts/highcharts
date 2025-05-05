Highcharts Webpacks
===================

Collection of configurations and plugins to create Highcharts bundles.
See [Webpack documentation](https://webpack.js.org/concepts/) for concept and configuration details.



Overview
--------

- `externals.json`: Here you can map imports to the namespace.

- `highcharts-es5.webpack.mjs`: Configuration to create UMD bundles from Highcharts ES5 masters.

- `highcharts.webpack.mjs`: Configurations to create ESM and UMD bundles from Highcharts masters.



Externals
---------

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
