---
sidebar_label: "Introduction"
---

# Introduction to Highcharts Grid

**Highcharts Grid** delivers a fast, modern way to work with tabular data. Start with **Grid Lite** for viewing and interacting with data, or step up to **Grid Pro** for editing and extended functionality, all built to meet today’s web standards.

**Highcharts Grid Lite** – A free version with a basic feature set, focused on viewing and interacting with data.

**Highcharts Grid Pro** – A commercial version that includes everything in Grid Lite plus advanced features such as cell editing, data validation, sparklines and events to expand functionality and tailor the grid to your needs.

**Important notice**: In Dashboards versions prior to 4.0.0, Grid Pro was bundled with Dashboards. Learn more about migrating to latest version in our [Migration Guide](https://www.highcharts.com/docs/dashboards/grid-migration).

## Your first Grid

Let's dive right in with a bare minimum example of a fully functional **Grid Lite**:

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
            Grid.grid("container", {
                data: {
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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@highcharts/grid-lite/css/grid-lite.css" />
```

Import the required JS and CSS from our public CDN. The [Installation article](https://www.highcharts.com/docs/grid/installation) provides more information and other installation options.

The CSS includes the necessary styles for the grid to function correctly and the default style theme. For more information on custom theming, see [the article on theming](https://www.highcharts.com/docs/grid/theming/theming).

### 2. Configure the grid

```js
Grid.grid('container', {
    data: {
        columns: {
            product: ['Apple', 'Pear', 'Plum', 'Banana'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
        },
    }
});
```

Inside the `<script>` tag, create a new instance of Grid by utilizing the `Grid.grid` factory function. This function takes two required arguments:

1. The ID of the HTML element where Grid should be rendered.
2. The Grid configuration object.

Only `data.columns` is required for Grid to be rendered. For more information on the configuration object, read the [Understanding Grid](https://www.highcharts.com/docs/grid/understanding-grid) article.

### 3. Add the HTML Element

```html
<div id="container"></div>
```

Add an HTML element to the `body` with the ID you specified as the first argument in `Grid.grid`.

## View the Result

With the configuration above, your Grid should look like this:

<iframe src="https://www.highcharts.com/samples/embed/grid/demo/your-first-grid?force-light-theme" allow="fullscreen"></iframe>

Go to [Understanding Grid](https://www.highcharts.com/docs/grid/understanding-grid) to read more about Grid structure and configuration options.
