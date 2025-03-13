Highcharts Webpacks
===================

Collection of configurations and plugins to create Highcharts bundles.
See [Webpack documentation](https://webpack.js.org/concepts/) for concept and configuration details.



Overview
--------

- `externals.json`: Maps imports, that should not be included, to the namespace. 
  Only masters that are listet in the "included" option will bundle the listed imports.

- `highcharts-es5.webpack.mjs`: Configuration to create UMD bundles from Highcharts ES5 masters.

- `highcharts.webpack.mjs`: Configurations to create ESM and UMD bundles from Highcharts masters.
