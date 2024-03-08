Layout
===

## Overview
An essential part of any dashboard is the positioning of its components. The layout can initially be defined from the configuration object, and then changed when Edit mode is enabled. Here are the building blocks of a dashboard layout.

![layout-description-img.png](layout-description-img.png)
* Green boxes: rows
* Red boxes: individual cells
* Blue boxes: nested layout inside a cell

To be able to use Dashboards with layout system and edit mode you first have to load the `layout` module.

```html
<script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
<script src="https://code.highcharts.com/dashboards/modules/layout.js"></script>
```

Alternatively, you can download the NPM package like:
```bash
npm install @highcharts/dashboards
```
and import it in your project like:
```js
import * as Dashboards from '@highcharts/dashboards';
import LayoutModule from '@highcharts/dashboards/modules/layout';

LayoutModule(Dashboards);
```

If you use ESM, you can also import the modules directly from the package:

```js
import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src.js';
import '@highcharts/dashboards/es-modules/masters/modules/layout.src.js';
```

## Rows
Each layout consists of at least one row. The row spans through the entire width of the outer layout it's defined in. Using Edit mode, you can change its width and height, and by doing so, you also resize the cells inside the row.
Each row can have its own style defined, and its cells can be defined either as a js object or as a JSON.

## Cells
Each row consists of at least one cell. There can be many cells in the same row, and they are the containers for the components, or the nested layout.

## Nested layout demo
<iframe style="width: 100%; height: 600px; border: none;" src="https://www.highcharts.com/samples/embed/dashboards/gui/nested-layout" allow="fullscreen"></iframe>

## How the dashboard layout engine makes your dashboard responsive
The layout takes care of calculating the position of the components. Generally, each row is placed in columns, and cells are placed in rows. Things get more complicated when dealing with the resizer module, which lets you change the width and height of the row and cell. The dashboard layout engine is based on flexbox, and by setting width and height in percentage values, cell and row sizes are adjusted dynamically when the outer container resizes. This can happen in nested layouts, when several rows are positioned inside of a cell which also can be resized.

Use regular CSS media queries to adjust your layout to different screens.

Example:
```css
/* LARGE */
@media (max-width: 1200px) {
    #dashboard-cell-1 {
        flex: 1 1 33.333%;
    }
}
  
/* MEDIUM */
@media (max-width: 992px) {
    #dashboard-cell-1 {
        flex: 1 1 50%;
    }
}
  
/* SMALL */
@media (max-width: 576px) {
    #dashboard-cell-1 {
        flex: 1 1 100%;
    }
}
```

Instead of regular CSS media queries, you can also use [container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries), which will make more sense if your dashboard does not cover the entire window horizontally. See [a demo that uses this](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/demo/accounting/).

Example:
```css
/* Create a containment context */
#container {
    container: dashboard / inline-size;
}

/* LARGE */
@container dashboard (max-width: 1200px) {
    #dashboard-cell-1 {
        flex: 1 1 33.333%;
    }
}

/* MEDIUM */
@container dashboard (max-width: 992px) {
    #dashboard-cell-1 {
        flex: 1 1 50%;
    }
}

/* SMALL */
@container dashboard (max-width: 576px) {
    #dashboard-cell-1 {
        flex: 1 1 100%;
    }
}

```

## Custom layout

If you prefer to use your own layout structure, feel free to use it as well. Only what you need is disable the gui by option. Also, the `layout.js` module is not needed then. Please remember that each container should have an unique `id` for rendered component.

```js
    gui: {
        enabled: false
    },
    components: [{
        renderTo: 'dashboard-col-0',
        type: 'Highcharts',
        chartOptions: {
            chart: {
                type: 'pie'
            },
            series: [{
                data: [1,2,3]
            }]
        },
    }]
```

[Here is the standalone demo](https://www.highcharts.com/samples/embed/dashboards/gui/custom-layout).
[Here is the tailwind demo](https://www.highcharts.com/samples/embed/dashboards/gui/custom-layout-tailwind).

*Please note that disabled GUI does not allow you to use the [Edit Mode](https://www.highcharts.com/docs/dashboards/edit-mode) module.
