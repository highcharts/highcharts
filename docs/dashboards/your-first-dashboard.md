# Your first dashboard

When you are ready to create your first simple dashboard, please follow these steps:

## 1. Add a `div` element
 The first required step in creating a dashboard is to define a `div` element where the dashboard is to be rendered. The `id` of the 'div' identifies the HTML element and is needed by the script that manages the dashboard. This `div` is generally  referred to as the **Dashboards** container.

```html
<div id="container">
```

## 2. Create the dashboard
In this example, we will create a simple dashboard with two cells. The first cell contains some *static HTML*, while the second contains a **Highcharts** chart. For this dashboard to work, we need both the **Highcharts** library and the **Dashboards** library, as well as the `layout` module. The required JS modules are imported as follows:

```html
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
<script src="https://code.highcharts.com/dashboards/modules/layout.js"></script>
```

However, there are other ways to import **Dashboards** packages. For alternative approaches, e.g. install via **npm**, see [this article](https://www.highcharts.com/docs/dashboards/installation).

## 3. Add CSS
We need CSS styling to display the dashboard properly. The default styles of the dashboard is contained is the **Dashboards** CSS file, and imported as shown below.

```css
@import url("https://code.highcharts.com/dashboards/css/dashboards.css");
```

## 4. Add the script
We are now ready to start working on the actual **Dashboards** configuration. Create a new dashboard instance inside the `script` tag.

To do so, you have to pass two arguments:
* the container div’s ID where the dashboard should be placed (see point 1).
* the object with dashboard options.

To do so, you can use the factory function `Dashboards.board`:

```js
Dashboards.board('container', {...})
```

or the class `Dashboards.Board` to create a new instance of the dashboard:

```js
const board = new Dashboards.Board('container', {...})
```

## 5. Add mandatory options
For the dashboard to work, two options are mandatory:

### gui
This is an objects that is used to define the layout of the dashboard by specifying rows and cells

```js
gui: {
    layouts: [{
        id: 'layout-1',
        rows: [{
            cells: [{
                id: 'dashboard-col-0'
            }, {
                id: 'dashboard-col-1'
            }]
        }]
    }]
}
```

### components
This is an array of components to be inserted into the dashboard. To place a component in a cell, use the cell ID defined in the `gui` option.
You also have to declare the type of the component and its options.

```js
components: [{
    type: 'HTML',
    renderTo: 'dashboard-col-0',
    elements: [
        {
            tagName: 'h1',
            textContent: 'Your first dashboard'
        }
    ]
}, {
    renderTo: 'dashboard-col-1',
    type: 'Highcharts',
    chartOptions: {
        series: [{
            data: [1, 2, 3, 4]
        }]
    }
}]

```

## View the result
With the configuration above, your datagrid should look like this:

<iframe src="https://www.highcharts.com/samples/embed/dashboards/basic/your-first-dashboard"></iframe>
