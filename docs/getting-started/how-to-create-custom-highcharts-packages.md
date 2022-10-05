Creating custom Highcharts packages
===================================

Thanks to ES modules you can create your own custom Highcharts package.
A benefit of using a custom file can be optimization of browser load speed due
to lower filesize and less files to request.

Follow the steps below to get started.



Install Highcharts
------------------

Go to the [`highcharts/highcharts`](https://github.com/highcharts/highcharts)
repository and click on "Code" and select "Download ZIP". Once the zip file is
downloaded, unpack it to a desired location.

The following steps require Node.js, which you can download and install from the
[Node.js website](https://nodejs.org/en/). Highcharts supports the TSL variant.

When Node.js is installed, open you command line, shell, or terminal, and go to
the unpacked folder `highcharts-master`. There you have to run `npm install` to
install the required dependencies for building custom Highcharts files.



Create a custom master file
---------------------------

In your editor, go to the unpacked folder `highcharts-master/ts/masters/` and
create a new file, named for example `custom.src.ts`. In this example we want a
basic line chart. To achieve this we will need a setup that lists all the needed
ES modules like this:

```ts
'use strict';
import Highcharts from '../Core/Globals.js';
import SVGRenderer from '../Core/Renderer/SVG/SVGRenderer.js';
import Chart from '../Core/Chart/Chart.js';
import LineSeries from '../Series/Line/LineSeries.js';
const exports: AnyRecord = Highcharts;
exports.Renderer = SVGRenderer;
exports.SVGRenderer = SVGRenderer;
exports.Chart = Chart;
exports.chart = Chart.chart;
exports.LineSeries = LineSeries;
export default exports;
```

Modify the setup according to your needs, then proceed with the next step.
Please note that the order of the imported ES modules sometimes have to match
the dependencies of each file. Optional additions therefore should come last.
See other masters for order information.

For similar examples take a look at the existing master files.



Create the custom package file
------------------------------

Run `npx gulp scripts --force` to build all package files out of the master
files. Optional run `npx gulp scripts-compile` in addition to get minified
versions.

In our example the new file `ts/masters/custom.src.ts` becomes the new package
file `code/custom.src.js`. The minified version can be found as
`code/custom.js`. You can pick these package files from the `code/` folder and
use it in your project.

For ESM-compatible files you have to copy the `code/es-modules/` folder. Feel
free to rename the folder for your needs. This folder might have a large size,
but ESM will pick only necessary files from it for your project. A bundler like
`parcel` or `webpack` can help in the final stage of your project to optimize
the loading time further.


Use your custom package file
----------------------------

According to our [installation](./installation.md) guide you can reference your
custom package file either as an ES6 module...

```html
<html>
    <body>
        <div id="container"></div>
        <script type="module">
            import Highcharts from './es-modules/masters/custom.src.js';
            Highcharts.chart('container', {
                series: [{
                    type: 'line',
                    data: [1, 32, 42]
                }]
            });
        </script>
    </body>
</html>
```

... or in classic manner with a `script` tag:

```html
<html>
    <head>
        <script src="custom.src.js"></script>
    </head>
    <body>
        <div id="container"></div>
        <script>
            Highcharts.chart('container', {
                series: [{
                    type: 'line',
                    data: [1, 32, 42]
                }]
            });
        </script>
    </body>
</html>
```
