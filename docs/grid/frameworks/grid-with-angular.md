---
sidebar_label: "Angular"
---

# Highcharts Grid with Angular
To create a Grid with Angular, please follow the steps below:

## 1. Install the Grid package
Install Grid Lite package with:
```bash
npm install @highcharts/grid-lite
```

## 2. Import the Grid package

```ts
import Grid from '@highcharts/grid-lite/es-modules/masters/grid-lite.src.js';
```

## 3. Create an HTML container  
Add a div where you want to render the Grid.
```html
<div id="container"></div>
```

## 4. Create a Grid
Create a Grid using the factory function `Grid.grid`. The function takes two arguments:
- `container` - the element where the Grid will be rendered, can be the id of the element or the direct reference to the element
- `options` - the object options for the Grid
```ts
Grid.grid('container', this.options);
```

## Final example
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
                city: ['New York', 'Oslo', 'Paris', 'Tokyo'],
            }
        }
    }

    ngOnInit() {
        Grid.grid('container', this.options);
    }
}
```

See the live example [here](https://stackblitz.com/edit/highcharts-grid-angular-nfxuhkpv).

