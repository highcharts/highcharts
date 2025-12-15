# Highcharts Dashboards with React

To create a dashboard with **React**, please follow the steps below:

## 1. Install the Dashboards package

```bash
npm install @highcharts/dashboards
```

## 2. Import the Dashboards package

```typescript
import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src.js';
```

## 3. Additional packages

If you need charts or data grids in your dashboard you need to install the  **Highcharts Core** and **Highcharts Grid Pro** NPM packages.

First, install the packages you need:

```bash
npm install highcharts
npm install @highcharts/grid-pro
```

Then, import the packages and the dedicated plugin to connect it to the dashboard:

```typescript
import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src.js';
import Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';
import Grid from '@highcharts/grid-pro';

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.GridPlugin.custom.connectGrid(Grid);
Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
Dashboards.PluginHandler.addPlugin(Dashboards.GridPlugin);
```

## 4. Prepare the structure and layout

Dashboards can use the built-in layout system or your own custom HTML.
- requires the `layout` module,
- works with rows and cells that you can nest,
- responds to container resizing (easy responsiveness),
- lets you disable the GUI and use your own structure when you need full control.
Read more in the [Layout docs](https://www.highcharts.com/docs/dashboards/layout-description).

### Option A: Built-in layout

The layout module is required to use the built-in [layout system](https://www.highcharts.com/docs/dashboards/layout-description):

```tsx
import '@highcharts/dashboards/es-modules/masters/modules/layout.src.js';
```

Define the dashboard in a small React app and pass the config to `Dashboards.board`:

```tsx
// App.tsx
export default function App() {
  const config = {
    gui: { enabled: true },
    layout: {
      rows: [{
        cells: [{ id: 'cell-0' }, { id: 'cell-1' }]
      }]
    },
    components: [{
      renderTo: 'cell-0',
      type: 'Highcharts',
      chartOptions: { title: { text: 'Series A' }, series: [{ data: [1, 2, 3] }] }
    }, {
      renderTo: 'cell-1',
      type: 'Highcharts',
      chartOptions: { title: { text: 'Series B' }, series: [{ data: [3, 2, 1] }] }
    }]
  };

  useEffect(() => {
    const board = Dashboards.board('dashboard', config);

    return () => board?.destroy();
  }, []);

  return <div id="dashboard" />;
}
```

### Option B: Custom layout
When you need full markup control, disable the GUI and point components to your own element ids.
```tsx
// App.tsx
export default function App() {
  const config = {
    gui: { enabled: false },
    components: [{
      renderTo: 'sales',
      type: 'Highcharts',
      chartOptions: { title: { text: 'Sales' }, series: [{ data: [5, 3, 4] }] }
    }, {
      renderTo: 'profit',
      type: 'Highcharts',
      chartOptions: { title: { text: 'Profit' }, series: [{ data: [2, 2, 5] }] }
    }, {
      renderTo: 'map',
      type: 'Highcharts',
      chartOptions: { title: { text: 'Regions' }, series: [{ data: [1, 4, 2] }] }
    }]
  };

  useEffect(() => {
    const board = Dashboards.board('dashboard', config);

    return () => board?.destroy();
  }, []);

  return (
    <div id="dashboard">
      <div className="row">
        <div id="sales" className="cell" />
        <div id="profit" className="cell" />
      </div>
      <div className="row">
        <div id="map" className="cell wide" />
      </div>
    </div>
  );
}
```

You can also wrap rows/cells into small React helpers to keep JSX tidy:
```tsx
// Row.tsx
type RowProps = React.PropsWithChildren<{ id?: string; className?: string }>;

export default function Row(props: RowProps) {
  return (
    <div className={'row' + (props.className || '')} id={props.id}>
      {props.children}
    </div>
  );
}
```
```tsx
// Cell.tsx
type CellProps = { id?: string; className?: string };

export default function Cell(props: CellProps) {
  return <div className={'cell' + (props.className || '')} id={props.id} />;
}
```
```tsx
// App.tsx (using Row/Cell helpers)
import Row from './Row';
import Cell from './Cell';

export default function App() {
  const config = {
    gui: { enabled: false },
    components: [{
      renderTo: 'kpi-vitamin-a',
      type: 'Highcharts',
      chartOptions: { title: { text: 'Vitamin A' }, series: [{ data: [3, 5, 4] }] }
    }, {
      renderTo: 'kpi-iron',
      type: 'Highcharts',
      chartOptions: { title: { text: 'Iron' }, series: [{ data: [2, 2, 6] }] }
    }, {
      renderTo: 'dashboard-col-0',
      type: 'Highcharts',
      chartOptions: { title: { text: 'Column 0' }, series: [{ data: [1, 2, 3] }] }
    }, {
      renderTo: 'dashboard-col-1',
      type: 'Highcharts',
      chartOptions: { title: { text: 'Column 1' }, series: [{ data: [3, 1, 2] }] }
    }, {
      renderTo: 'dashboard-col-2',
      type: 'Highcharts',
      chartOptions: { title: { text: 'Column 2' }, series: [{ data: [4, 4, 1] }] }
    }]
  };

  useEffect(() => {
    const board = Dashboards.board('dashboard', config);
    return () => board?.destroy();
  }, []);

  return (
    <div id="dashboard">
      <Row>
        <div id="kpi-wrapper">
          <Cell id="kpi-vitamin-a" />
          <Cell id="kpi-iron" />
        </div>
        <Cell id="dashboard-col-0" />
        <Cell id="dashboard-col-1" />
      </Row>
      <Row>
        <Cell id="dashboard-col-2" />
      </Row>
    </div>
  );
}
```

## 5. Create a dashboard
`Dashboards.board(container, options, isAsync?)` expects:
- `container` – element id or DOM reference,
- `options` – dashboard config (layout, components, gui, etc.),
- `isAsync` – async rendering (useful for external data).

## Demos
- [Example using built-in layout](https://stackblitz.com/edit/stackblitz-starters-3aaelrn5)
- [Example using custom layout](https://stackblitz.com/edit/stackblitz-starters-ljqhy6cw)
- [Example using dedicated component](https://stackblitz.com/edit/stackblitz-starters-xjeut4dq)
