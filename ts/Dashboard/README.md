# Highcharts Dashboards #
A JavaScript library for interactive dashboards.

## Installation
There are multiple different ways how you can import this package.
Among the most popular are:
* Using npm
```bash
    npm install <PACKAGE-NAME>
```
* Importing as a script
```html
    <script src="https://code.highcharts.com/dashboards.js"></script>
 ```

To fully utilize the Dashboards potential, there might be a need to load additional modules. <br>
In the [documentation](https://highcharts.com/docs/dashboards/instalation), you can find more information on how to do that and what are the other ways of importing the Dashboards.

## Components
Each dashboard is built with different components. You can add the most basic HTMLComponent where you can add some text, image etc.
To create a chart you can add ChartComponent. If you would like to show your data in a tabular way use the DataGridComponent. Also useful might be to show some individual numbers/indications, for that use the KPIComponent.

To properly show the component you have to declare the `id` of a cell where it should be placed and the `type` of that component.
An example of how the component might look like:
``` JS
    {
        type: 'Highcharts',
        cell: 'cell-id-2',
        chartOptions: {
            series: [{
                type: 'pie',
                data: [1, 2, 3, 2, 3]
            }]
        }
    }
```
In the component [documentation](https://highcharts.com/docs/dashboards/types-of-components), you can find more information on how each one of them works and what can be configured.

## Working with Data

