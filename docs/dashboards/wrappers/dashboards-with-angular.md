# Highcharts Dashboards with Angular

To create a dashboard with **Angular**, please follow the steps below:

## 1. Install the Dashboards package

```bash
npm install @highcharts/dashboards
```

## 2. Import the Dashboards package

```typescript
import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src.js';
```

## 3. Additional packages
Consider additional packages like **Highcharts** or **Grid** to fully utilize the **Dashboards** potential.

First, install the package.
```bash
npm install highcharts
```

Then, import the package and the dedicated plug to connect it to the Dashboards.

```typescript
import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src.js';

// To use Highcharts Core, install `highcharts` npm library.
import Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';
// To use Grid Pro, install `@highcharts/grid-pro` npm library.
import Grid from '@highcharts/grid-pro';

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.GridPlugin.custom.connectGrid(Grid);
Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
Dashboards.PluginHandler.addPlugin(Dashboards.GridPlugin);

```

## 4. Create an HTML structure for the dashboard

There are two ways to do it:

### Use the Dashboards layout system
To do that, first import the `layout` module and initialize it:

```typescript
import '@highcharts/dashboards/es-modules/masters/modules/layout.src.js';
```
Then add a div where you want to render the dashboard:
```html
<div id="dashboard"></div>
```

You can refer to the element by its ID or use the `ElementRef` to get it.

### Declare your HTML structure
Read more in the [documentation](https://www.highcharts.com/docs/dashboards/layout-description).

## 5. Create a dashboard
The dashboard is created using the factory function `Dashboards.board`. The function takes three arguments:
- `container` - the element where the dashboard will be rendered, can be an id of the element or the direct reference to the element
- `options` - the options object for the dashboard
- `isAsync` - whether the dashboard should be rendered asynchronously or not- functional when using external data resources

## Demos
See how it works in the following demos:
- [Basic live example](https://stackblitz.com/edit/angular-kv7m5vtb)
- [Custom layout live example](https://stackblitz.com/edit/dashboards-angular-custom-layout-eu9kekif)
