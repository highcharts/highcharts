Your first dashboard
===

When you are ready to create your first simple dashboard, please follow these steps:

1. Add a `div` element to your webpage with a specific `id`.

```html
<div id="container">
```

2. In this example, we are going to create a simple dashboard with two cells. The first cell contains some *static HTML*, while the second contains a Highcharts chart. For this dashboard to work, we need both the `Highcharts library` and the `Dashboards library`.

```html
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
<script src="https://code.highcharts.com/dashboards/modules/layout.js"></script>
```

However, this is not the only way to import **Dashboards** packages. For alternative approaches, e.g. install via npm, see [this article](https://www.highcharts.com/docs/dashboards/installation).

3. We need some styling to display the whole dashboard properly. You can get the basic one by importing the modules to the CSS file, as shown below.

```css
@import url("https://code.highcharts.com/dashboards/css/dashboards.css");
```

4. We are now ready to start working on the actual Dashboard configuration. Create a new dashboard instance inside the `script tag`.

To do so, you have to pass two arguments:
* the div’s ID where the dashboard should be placed (see point 1).
* the object with dashboard options.

To do so, you can use the factory function `Dashboards.board`:

```js
Dashboards.board('container', {...})
```

or the class `Dashboards.Board` to create a new instance of the dashboard:

```js
const board = new Dashboards.Board('container', {...})
```

5.  For the dashboard to work, two options are mandatory:
    * __gui__ - here, you can define the layout of the dashboard by specifying rows and cells

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
        },
        ```

    * __components - This is an array of components to be inserted into the dashboard. To place a component in a cell, use the cell ID defined in the `gui` option.
    You also have to declare the type of the component and its options.

        ```js
        components: [{
            type: 'HTML',
            renderTo: 'dashboard-col-0',
            elements: [
                {
                    tagName: 'h1',
                    style: {
                        height: '400px',
                        'text-align': 'center'
                    },
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

6. The dashboard should now look like the example below:

<iframe src="https://www.highcharts.com/samples/embed/dashboards/basic/your-first-dashboard" allow="fullscreen"></iframe>
