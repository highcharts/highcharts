# Installation

## Install via NPM
One way to add the Highcharts Dashboards to your web page is via npm script. You can get all **Dashboards** functionality through packages, which can be installed using the following script:
```bash
npm install @highcharts/dashboards
```
Then import the package into your project:
```js
import * as Dashboards from '@highcharts/dashboards';
```

If you don't intend to use your own [custom layout](https://www.highcharts.com/docs/dashboards/layout-description#custom-layout), import and register the layout module as well:
```js
import * as Dashboards from '@highcharts/dashboards';
import LayoutModule from '@highcharts/dashboards/modules/layout';

LayoutModule(Dashboards);
```

## Include Dashboards by script tag
Include the JavaScript files in the `<head>` section of your web page as shown below.

```html
<script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
<script src="https://code.highcharts.com/dashboards/modules/layout.js"></script>
 ```


## Load files from your domain
In the example above, the Javascript files are loaded from [code.highcharts.com](https://code.highcharts.com), but you can download the files from [highcharts.com](https://www.highcharts.com/download/) and include them on your web page. Here is an example with Highcharts Dashboards served from your own server:

```html
<script src="../code/dashboards/dashboards.js"></script>
<script src="../code/dashboards/modules/layout.js"></script>
```

## Load additional modules
You might want to include some additional modules in your webpage that are not included in the basic `dashboards.js` module.
The basic module lets you create the elementary dashboard with `HTMLComponents`, but if you want to use predefined component types, you need to add the necessary modules. E.g. to use a Highcharts component, you need to add the following scripts:
```html
../highcharts.js
../dashboards/dashboards.js
```

If you are using npm, you can import the modules as follows:
```ts
import * as Highcharts from 'highcharts';
import * as Dashboards from '@highcharts/dashboards';
```

Then, you can use the `HighchartsPlugin` to connect the Highcharts component with the Dashboards.  
It works similarly for other plugins, e.g., DataGrid.

```ts
Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
```

## Get started

Now, you are ready to use Dashboards. Check out [Your first Dashboard](https://highcharts.com/docs/dashboards/your-first-dashboard) to get started.
