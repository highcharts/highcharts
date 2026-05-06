---
sidebar_label: "Introduction"
---

# Introduction to Highcharts Grid

Highcharts Grid provides a fast way to work with tabular data in the browser. Start with **Grid Lite** for viewing and interacting with data, or use **Grid Pro** for editing and extended functionality.

**Highcharts Grid Lite** is the free edition, focused on viewing and interacting with data.

**Highcharts Grid Pro** is the commercial edition. It includes everything in Grid Lite plus features such as cell editing, data validation, sparklines, and events.

## Your first Grid

This minimal example creates a working **Grid Lite** instance:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>My First Grid</title>
        <script src="https://cdn.jsdelivr.net/npm/@highcharts/grid-lite/grid-lite.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@highcharts/grid-lite/css/grid-lite.css" />
    </head>
    <body>
        <div id="container"></div>
        <script type="text/javascript">
            Grid.grid('container', {
                data: {
                    columns: {
                        product: ['Apple', 'Pear', 'Plum', 'Banana'],
                        weight: [100, 40, 0.5, 200],
                        price: [1.5, 2.53, 5, 4.5]
                    }
                }
            });
        </script>
    </body>
</html>
```

### 1. Import required JS and CSS

```html
<script src="https://cdn.jsdelivr.net/npm/@highcharts/grid-lite/grid-lite.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@highcharts/grid-lite/css/grid-lite.css" />
```

Load the required JS and CSS from the public CDN. See [Installation](https://www.highcharts.com/docs/grid/installation) for other setup options.

The CSS file includes the styles required for the grid to render correctly, including the default theme. For custom themes, see [Theming](https://www.highcharts.com/docs/grid/theming/index).

### 2. Configure the grid

```js
Grid.grid('container', {
    data: {
        columns: {
            product: ['Apple', 'Pear', 'Plum', 'Banana'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
        }
    }
});
```

Inside the `<script>` tag, create a new Grid instance with the `Grid.grid` factory function. It takes two required arguments:

1. The ID of the HTML element where Grid should be rendered.
2. The Grid configuration object.

Only the `data.columns` option is required to render a Grid. For more on the configuration object, see [Understanding Grid](https://www.highcharts.com/docs/grid/understanding-grid).

### 3. Add the HTML element

```html
<div id="container"></div>
```

Add an HTML element to the `body` with the ID you specified as the first argument in `Grid.grid`.

## View the result

With the configuration above, your Grid should look like this:

<iframe src="https://www.highcharts.com/samples/embed/grid/demo/minimal-grid?force-light-theme" allow="fullscreen"></iframe>

Continue with [Understanding Grid](https://www.highcharts.com/docs/grid/understanding-grid) for more on the Grid structure and configuration options.
