# Highcharts Dashboards #
A JavaScript library for interactive dashboards.

## Installation
There are multiple different ways how you can import this package.
Among the most popular are:
* Using npm
Run the following command in your terminal:
```bash
    npm install <PACKAGE-NAME>
```
Then import the package in your project:
``` JS
    import Dashboards from '<PACKAGE-NAME>';
```
* Importing as a script
```html
    <script src="https://code.highcharts.com/dashboards.js"></script>
 ```

To fully utilize the Dashboards potential, there might be a need to load additional modules.  
In the [installation documentation](https://highcharts.com/docs/dashboards/installation), you can find more information on how to do that and what are the other ways of importing the Dashboards.

## Components
Each dashboard is built with different components. You can add the most basic `HTMLComponent` where you can add some text, image etc.
To create a chart you can add `HighchartsComponent`. If you would like to show your data in a tabular way use the `DataGridComponent`. Or use the `KPIComponent` to highlight some individual numbers/indications.

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
In the [component documentation](https://highcharts.com/docs/dashboards/types-of-components), you can find more information on how each one of them works and what can be configured.

## Working with Data

You can import your data from multiple sources for example CSV and Google Spreadsheet. They are going to be handled by the Stores and distributed as DataTables.  

More about this concept in the [Data documentation](https://highcharts.com/docs/dashboards/data).

## GUI
The GUI is a part of the dashboard that allows you to create a layout of the dashboard. You can add rows and cells to the layout. The layout is a grid where you can place your components.  
An example of how the GUI configuration might look like:
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
More about the GUI in the [documentation](https://highcharts.com/docs/dashboards/gui).


## Edit Mode
The Edit Mode is a part of the dashboard that allows you to edit the dashboard. You can add, remove and edit components.  
To enable the Edit Mode you have to add the `highcharts-dashboards` class to the div where the dashboard is placed.  

Find more information in the [Edit Mode documentation](https://highcharts.com/docs/dashboards/edit-mode).

## Your first dashboard
To create your first dashboard you have to import the Dashboards package and create a new dashboard.  
You also need a placeholder for that dashboard. In this example we will use a div with the id `container`.
```html
    <script src="https://code.highcharts.com/dashboards.js"></script>

    <div id="container" class="highcharts-dashboard"></div>
```
Than the dashboard can be created:
``` JS
    const dashboard = new Dashboard.Dashboard('container', {
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

See it in action: [demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/samples/dashboard/demos/your-first-dashboard).

## FAQ
How to connect data or how to add components and synchronize them together.  
Answers to those and other similar questions can be found on the dedicated [FAQ page](https://highcharts.com/docs/dashboards/frequently-asked-questions).