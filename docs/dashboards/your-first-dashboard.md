Your first dashboard
===

When you are ready to create your first simple dashboard, please follow these steps:

1. Add a div to your webpage with a specific id.

    ```html
    <div id="container">
    ```

2. In this basic example we are going to create a dashboard with two cells. One will contain a static HTML and the other will contain a chart created with Highcharts.
Thus, we have to import the main dashboard package, the Highcharts library and a plugin that allows implementing the Highcharts chart inside the dashboard.

    ```html
    <script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/dashboards/modules/dashboards-plugin.js"></script>
    ```

    However, this is not the only way to import Dashboards packages. See other ways, e.g. install via npm, [here](https://www.highcharts.com/docs/dashboards/installation).

3. In order to properly display the whole dashboard, we need some styling. You can get the basic one by importing the modules to the CSS file as shown below.
If you want to use Highcharts charts, you should also import the charts styles, because the [styled mode](https://www.highcharts.com/docs/chart-design-and-style/custom-themes-in-styled-mode) is enabled by default in Dashboards.

    ```css
    @import url("https://code.highcharts.com/css/highcharts.css");
    @import url("https://code.highcharts.com/dashboards/css/dashboards.css");
    ```

4. With that, we are ready to start working on an actual dashboard config. Inside the script tag, create a new instance of the dashboard. <br>
To do so, you have to pass two arguments:
    * the div’s id where the dashboard should be placed (see point 1).
    * the object with dashboard options.

    To do so, you can use the factory function `Dashboards.board`:

    ```js
    Dashboards.board('container', {...})
    ```
    or the class `Dashboards.Board` to create a new instance of the dashboard:

    ```js
    const board = new Dashboards.Board('container', {...})
    ```

5.  As options, you have to provide two essential things:
    * __gui__ - here you can define the layout of the dashboard by specifying rows and cells

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

    * __components__ - this is an array with components to be inserted into the dashboard. To place a component in a cell, use the cell id. You also have to declare the type of the component (more on that in a dedicated chapter) and its options.

        ```js
        components: [{
            type: 'HTML',
            cell: 'dashboard-col-0',
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
            cell: 'dashboard-col-1',
            type: 'Highcharts',
            chartOptions: {
                series: [{
                    data: [1, 2, 3, 4]
                }]
            }
        }]
        ```

6. With that config, your dashboard should look like the example below:

<iframe src="https://www.highcharts.com/samples/embed/dashboards/basic/your-first-dashboard"></iframe>
