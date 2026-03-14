---
sidebar_label: "Angular"
---

# Highcharts Grid with Angular

Use Grid Lite or Grid Pro in Angular by importing the Grid bundle and rendering it into a container element.

## 1. Install the Grid package

Install Grid Lite:

```bash
npm install @highcharts/grid-lite
```

## 2. Import the Grid package

```ts
import Grid from '@highcharts/grid-lite/es-modules/masters/grid-lite.src.js';
```

## 3. Add a container

Add a `div` where the Grid should be rendered:

```html
<div id="container"></div>
```

## 4. Render the Grid

Create the Grid with the `Grid.grid` factory function. It takes:

- `container`: the element where the Grid should be rendered, either as an element ID or a direct element reference
- `options`: the Grid options object

```ts
Grid.grid('container', this.options);
```

## 5. Full example

```ts
import { Component, OnInit } from '@angular/core';
import Grid from '@highcharts/grid-lite/es-modules/masters/grid-lite.src.js';
import '@highcharts/grid-lite/css/grid-lite.css';

@Component({
    selector: 'app-root',
    standalone: true,
    template: '<div id="container"></div>',
})
export class AppComponent implements OnInit {
    private options: Grid.Options = {
        data: {
            columns: {
                name: ['Alice', 'Bob', 'Charlie', 'David'],
                age: [23, 34, 45, 56],
                city: ['New York', 'Oslo', 'Paris', 'Tokyo']
            }
        }
    };

    public ngOnInit(): void {
        Grid.grid('container', this.options);
    }
}
```

For Grid Pro, swap the imports to `@highcharts/grid-pro/...` and load the Grid Pro CSS file.

See the [live Angular example](https://stackblitz.com/edit/highcharts-grid-angular-nfxuhkpv).
