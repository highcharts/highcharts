const CSVConnector = Dashboards.DataConnector.types.CSV;
const csvData = document.getElementById('csv').innerText;

const connector = new CSVConnector({
    csv: csvData,
    firstRowAsNames: true
});

connector.load();


// Necessary to enable styled mode in order to properly style the
// chart depending on the theme.
Highcharts.setOptions({
    chart: {
        styledMode: true
    }
});


Dashboards.board('container', {
    connector,
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
    components: [
        {
            cell: 'dashboard-col-0',
            connector,
            type: 'Highcharts',
            sync: {
                highlight: true
            },
            columnKeyMap: {
                Food: 'x',
                'Vitamin A': 'y'
            },
            title: {
                text: 'Column chart'
            },
            chartOptions: {
                xAxis: {
                    type: 'category'
                },
                title: {
                    text: ''
                },
                chart: {
                    animation: false,
                    type: 'column'
                },
                plotOptions: {
                    series: {
                        colorByPoint: true
                    }
                }
            }
        }, {
            cell: 'dashboard-col-1',
            type: 'DataGrid',
            connector,
            editable: true,
            title: {
                text: 'Grid component'
            },
            sync: {
                highlight: true
            }
        }
    ]
});


[...document.querySelectorAll('input[name="color-mode"]')]
    .forEach(input => {
        input.addEventListener('click', e => {
            document.getElementById('container').className =
                e.target.value === 'none' ? '' : `highcharts-${e.target.value}`;
        });
    });
