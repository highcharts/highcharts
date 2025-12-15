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

### Option A: Built-in layout

The layout module is required to use the built-in [layout system](https://www.highcharts.com/docs/dashboards/layout-description):

```typescript
import '@highcharts/dashboards/es-modules/masters/modules/layout.src.js';
```

Then define a simple Angular component that creates the dashboard:

```typescript
// dashboard.component.ts
import { Component, ElementRef, OnInit } from '@angular/core';
import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src.js';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private options = {};
  private readonly isAsync = true;

  constructor(public elementRef: ElementRef) {}

  ngOnInit() {
    this.setOptions();
    this.renderDashboard();
  }

  private renderDashboard() {
    Dashboards.board(this.elementRef.nativeElement, this.options, this.isAsync);
  }

  private setOptions() {
    this.options = {
      gui: {
        layouts: [{
          rows: [{
            cells: [{ id: 'cell-0' }, { id: 'cell-1' }]
          }]
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
  }
}
```

### Option B: Custom layout

When you need [full markup control](https://www.highcharts.com/docs/dashboards/layout-description#custom-layout), disable `gui` and point components to your own element ids.

```typescript
// dashboard.component.ts
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src.js';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './main.html',
  styleUrls: ['./main.css'],
})
export class App implements OnInit {
  private options = {};
  private readonly isAsync = true;

  constructor(public elementRef: ElementRef) {}

  ngOnInit() {
    this.setOptions();
    this.renderDashboard();
  }

  private renderDashboard() {
    Dashboards.board(this.elementRef.nativeElement, this.options, this.isAsync);
  }

  private setOptions() {
    this.options = {
      gui: {
        enabled: false
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
  }
}
```

```html
<!-- main.html -->
<div id="container">
  <div class="row">
    <div class="cell" id="cell-0"></div>
    <div class="cell" id="cell-1"></div>
  </div>
</div>
```

## Demos
See how it works in the following demos:
- [Example using built-in layout](https://stackblitz.com/edit/angular-kv7m5vtb)
- [Example using custom layout](https://stackblitz.com/edit/dashboards-angular-custom-layout-eu9kekif)
