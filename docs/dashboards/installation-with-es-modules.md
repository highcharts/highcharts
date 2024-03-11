Installation with ES6 modules
=============================

Highcharts Dashboards packages are available as ES6-compatible modules.

## Including a product package (ES6 module)

For debugging and development purposes you can load core files directly in your
browser page and make use of tree shaking. Please note that this results in a
decreased download size but in an increased delay caused by the amount of
(small) files to load. This approach is therefore not recommended for
production.

```html
    <script type="module">
        import Dashboards from 'https://code.highcharts.com/dashboards/es-modules/masters/dashboards.src.js';

        Dashboards.board('container', {
            editMode: {
                enabled: true,
                contextMenu: {
                    enabled: true
                }
            },
            gui: {
                enabled: true,
                layouts: [{
                    rows: [{
                        cells: [{
                            id: 'dashboard-col-0'
                        }]
                    }]
                }]
            },
            components: [
                {
                    renderTo: 'dashboard-col-0',
                    type: 'HTML',
                    elements: [{
                        tagName: 'h1',
                        attributes: {
                            text: 'Hello world'
                        }
                    }]
                }
            ]
        });

    </script>
```

## To load a plugin
A plugin is a third party/community made Highcharts Dashboards addon.
First, make sure that a plugin supports loading over NPM and load the required files.
In the example `DataGrid` supports NPM loading, so after installing the package you could initialize and register it like this:

```ts
import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src';
import DataGrid from '@highcharts/dashboards/es-modules/masters/datagrid.src';

Dashboards.DataGridPlugin.custom.connectDataGrid(DataGrid);
Dashboards.PluginHandler.addPlugin(Dashboards.DataGridPlugin);
```
