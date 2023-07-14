# Highcharts Dashboards #
A JavaScript library for interactive dashboards.

## Installation
There are multiple ways to import this package.
Among the most popular are:
* Using npm, run the following command in your terminal:
``` Shell
    npm install @highcharts/dashboards
```
Then import the package in your project:
``` JS
    import Dashboards from '@highcharts/dashboards';
```
* Importing as a script
``` HTML
    <script src="https://code.highcharts.com/dashboards/dashboards.js"></script>
```

To fully utilize the Dashboards potential, there might be a need to load additional modules.
In the [installation documentation](https://highcharts.com/docs/dashboards/installation), you can find more information on how to do that and other ways of importing the Dashboards.

## Components
Each dashboard is built with different components. You can add the most basic `HTMLComponent` where you can add some text, image etc.
To create a chart you can add a `HighchartsComponent`. If you would like to show your data in a tabular way use the `DataGridComponent`. Or use the `KPIComponent` to highlight some individual numbers/indications.

To properly show the component you have to declare the `id` of a cell, where it should be placed and the `type` of that component.
Below is an example of what a component configuration might look like:
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
In the [component documentation](https://highcharts.com/docs/dashboards/types-of-components), you can find more information on how each one of them works and what can be configured.

## Working with Data

You can import your data from multiple sources, for example CSV and Google Spreadsheet. They are going to be handled by the Connectors and distributed as DataTables.

More about this concept in the [Data Handling section](https://www.highcharts.com/docs/dashboards/data-handling).

## GUI
The GUI is a part of the dashboard that allows you to create a layout of the dashboard. You can add rows and cells to the layout. The layout is a grid where you can place your components.
Below is an example of what a GUI configuration might look like:
``` JS
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
More about the GUI in the [documentation](https://www.highcharts.com/docs/dashboards/layout-description).


## Edit Mode
Edit Mode allows the user to edit the dashboard by adding, removing and editing components.

Find more information in the [Edit Mode documentation](https://highcharts.com/docs/dashboards/edit-mode).

## Your first dashboard
To create your dashboard, you first have to import the Dashboards package.
You also need a placeholder for your dashboard. In this example we will use a div with the id `container`.
``` HTML
    <script src="https://code.highcharts.com/dashboards/dashboards.js"></script>

    <div id="container"></div>
```

Your dashboard can now be created:
``` JS
    Dashboards.board('container', {
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
    });
```

See it in action: [demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/basic/your-first-dashboard).

## FAQ
Answers to common questions can be found on our [FAQ page](https://highcharts.com/docs/dashboards/frequently-asked-questions).