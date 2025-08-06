---
sidebar_label: "Introduction"
---

# Introduction to Highcharts Grid

**Highcharts Grid** (formerly known as DataGrid) is a versatile tool for displaying and managing tabular data. Originally introduced as a component in Highcharts Dashboards, it provides a high-performance, interactive, and editable data table solution.

Highcharts Grid is available in two versions:

**Highcharts Grid Lite** – A free version with a basic feature set.

**Highcharts Grid Pro** – A more advanced, commercial version that currently requires a [Highcharts Dashboards](https://www.highcharts.com/docs/dashboards/grid-component) license and includes additional features. Though it is part of the Dashboards package and license, Grid Pro can also be used as a [standalone component](https://www.highcharts.com/docs/dashboards/grid-standalone).

This documentation focuses on **Highcharts Grid** in general. For specific information on **Highcharts Grid Pro** in a Dashboards context, see the article on [Dashboards Grid Component](https://www.highcharts.com/docs/dashboards/grid-component).

## My First Grid

Let's dive right in with a bare minimum example of a fully functional **Grid Lite**:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>My First Grid</title>
        <script src="https://cdn.jsdelivr.net/npm/@highcharts/grid-lite/grid-lite.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@highcharts/grid-lite/css/grid.css" />
    </head>
    <body>
        <div id="container"></div>
        <script type="text/javascript">
            Grid.grid("container", {
                dataTable: {
                    columns: {
                        product: ["Apple", "Pear", "Plum", "Banana"],
                        weight: [100, 40, 0.5, 200],
                        price: [1.5, 2.53, 5, 4.5],
                    },
                },
            });
        </script>
    </body>
</html>
```

### 1. Import required JS and CSS

```html
<script src="https://cdn.jsdelivr.net/npm/@highcharts/grid-lite/grid-lite.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@highcharts/grid-lite/css/grid.css" />
```

Import the required JS and CSS from our public CDN. The [Installation article](https://www.highcharts.com/docs/grid/installation) provides more information and other installation options.

The CSS includes the necessary styles for the grid to function correctly and the default style theme. For more information on custom theming, see [the article on theming](https://www.highcharts.com/docs/grid/theming/theming).

### 2. Configure the grid

```js
Grid.grid("container", {
    dataTable: {
        columns: {
            product: ["Apple", "Pear", "Plum", "Banana"],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
        },
    },
});
```

Inside the `<script>` tag, create a new instance of Grid by utilizing the `Grid.grid` factory function. This function takes two required arguments:

1. The ID of the HTML element where Grid should be rendered.
2. The Grid configuration object.

Only the `dataTable` option is required for Grid to be rendered. For more information on the configuration object, read the [Understanding Grid](https://www.highcharts.com/docs/grid/understanding-grid) article.

### 3. Add the HTML Element

```html
<div id="container"></div>
```

Add an HTML element to the `body` with the ID you specified as the first argument in `Grid.grid`.

## View the Result

With the configuration above, your Grid should look like this:

<iframe src="https://www.highcharts.com/samples/embed/grid/demo/your-first-grid?force-light-theme" allow="fullscreen"></iframe>

Go to [Understanding Grid](https://www.highcharts.com/docs/grid/understanding-grid) to read more about Grid structure and configuration options.
