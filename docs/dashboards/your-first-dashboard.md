Your first dashboard
===

If you are ready to create your first simple dashboard please follow the steps:

1. Add a div to your webpage with a specific id. Additionally, if you are planning to use the Edit Mode, please add the class `highcharts-dashboards` to that div (more on that in a dedicated chapter).

    ```html
        <div id="container" class="highcharts-dashboards">
    ```

2. In this basic example we are going to create a dashboard with two cells. One will contain a static HTML and the other will contain a chart created with the Highcharts.
Thus we have to import the main dashboard package, the Highcharts library and a plugin that allows implementing the Highcharts chart inside the dashboard.

    ```html
        <script src="https://code.highcharts.com/dashboards.js"></script>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/dashboards-plugin.js"></script>
    ```

3. In order to properly display the whole dashboard we need some styling. You can get the basic one by importing the modules to the CSS file as shown below.

    ```css
        @import "https://code.highcharts.com/css/dashboards/gui.css";
    ```

4. With that, we are ready to start working on an actual dashboard config. Inside the script tag, create a new instance of the dashboard. <br>
    To do so, you have to pass two arguments :
    * the div’s id where the dashboard should be placed (see point 1).
    * the object with dashboard options.


    ```js
        const dashboard = new Dashboard.Dashboard('container', {...})
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

    * __components__ - array with components to insert into the dashboard. To place a component in the cell, use the cell id. You also have to declare the type of the component (more on that in a dedicated chapter) and its options.

    ```js
        components: [{
            type: 'html',
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

6. With that config, you dashboard should look like the one in the [demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/samples/dashboard/demos/your-first-dashboard).