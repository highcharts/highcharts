# Highcharts Dashboards with React

To create a dashboard with **React**, please follow the steps below:

## Install the Dashboards package

```bash
npm install @highcharts/dashboards
```

## Import the Dashboards package

```typescript
import * as Dashboards from '@highcharts/dashboards';
```

## Additional packages

Consider additional packages like **Highcharts** or **DataGrid** to fully utilize the **Dashboards** potential.

First, install the package.
```bash
npm install highcharts
```

Then, import the package and the dedicated plug to connect it to the Dashboards.

```typescript
import Highcharts from 'highcharts';
import Dashboards from '@highcharts/dashboards';
import DataGrid from '@highcharts/dashboards/datagrid';

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.DataGridPlugin.custom.connectDataGrid(DataGrid);

Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
Dashboards.PluginHandler.addPlugin(Dashboards.DataGridPlugin);
```

## Create an HTML structure for the dashboard

There are two ways to do it:

### Use the Dashboards layout system
To do that, first import the `layout` module and initialize it:

```typescript
import LayoutModule from '@highcharts/dashboards/modules/layout';

LayoutModule(Dashboards);
```
Then add a div where you want to render the dashboard:
```html
<div id="dashboard"></div>
```

You can refer to the element by its ID or use the `ElementRef` to get it.

### Declare your HTML structure
Read more in the [documentation](https://www.highcharts.com/docs/dashboards/layout-description).

## Create a dashboard
The dashboard is created using the factory function `Dashboards.board`. The function takes three arguments:
- `container` - the element where the dashboard will be rendered, can be an id of the element or the direct reference to the element
- `options` - the options object for the dashboard
- `isAsync` - whether the dashboard should be rendered asynchronously or not- functional when using external data resources

## Demos
See how it works in the following demos::
- [Basic live example](https://stackblitz.com/edit/stackblitz-starters-xn8e17)
- [Custom layout live example](https://stackblitz.com/edit/stackblitz-starters-g6quez)
- [Component live example](https://stackblitz.com/edit/stackblitz-starters-sx8crk)

