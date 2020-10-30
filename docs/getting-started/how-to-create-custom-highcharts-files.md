Creating custom Highcharts files
================================

Thanks to ES modules you can create your own custom Highcharts package files. A
benefit of using a custom file can be optimization of browser load speed due to
lower filesize and less files to request.

Follow the steps below to get started.



Install Highcharts
------------------

Go to the [`highcharts/highcharts`](https://github.com/highcharts/highcharts)
repository and click on "Code" and select "Download ZIP". Once the zip file is
downloaded, unpack it to a desired location.

Open the unpacked folder `highcharts-master` in a command line or terminal and
run `npm install` to install any required dependencies. On Macs this step
requires the Installation of Xcode app or the Command Line Tools, which you run
with `xcode-select --install`.



Create a custom master file
---------------------------

Go in your editor to the unpacked folder `highcharts-master/js/masters` and
create a new file, named for example `custom.src.js`. In this example we want a
basic line chart with some interactivity. To achieve this we will need a setup
that lists all the needed ES modules like this:

```js
'use strict';
import Highcharts from '../Core/Globals.js';
import '../Core/Renderer/SVG/SVGRenderer.js';
import '../Core/Chart/Chart.js';
import '../Series/LineSeries.js';
import '../Core/Interaction.js';
export default Highcharts;
```

Modify the setup according to your needs, then proceed with the next step.
Please note that the order of the imported ES modules should match the
dependencies of each file. Optional additions therefore should come last.

For similar examples take a look at the other master files.



Create the custom package file
------------------------------

Run `npx gulp scripts` to build all package files out of the master files. For 
running the automated tests in addition, run `npm test`.

In our example the new file `js/masters/custom.src.js`
becomes the new package file `code/custom.src.js`.

You can pick the package file `code/custom.src.js` and use it in your project.



Use your custom package file
----------------------------

According to our [installation](./installation.md) guide you can reference your
custom package file in a `script` tag:

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
