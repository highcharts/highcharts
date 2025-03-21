Highcharts Webpacks
===================

Collection of configurations and plugins to create Highcharts bundles.
See [Webpack documentation](https://webpack.js.org/concepts/) for concept and configuration details.



Overview
--------

- `externals.json`: Maps imports, that should not be included, to the namespace.
  - Lists all imports in "files" relative to "code/es-modules".
  - Only masters that are listed in the "included" option will bundle the listed imports.
  - A leading dot in "namespacePath" will be replaced with the shared namespace.
    This should reflect namespace assignments in the masters files.

- `highcharts-es5.webpack.mjs`: Configuration to create UMD bundles from Highcharts ES5 masters.

- `highcharts.webpack.mjs`: Configurations to create ESM and UMD bundles from Highcharts masters.
