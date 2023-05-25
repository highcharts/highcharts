const CSVConnector = Dashboards.DataConnector.types.CSV;
const MathModifier = Dashboards.DataModifier.types.Math;

// Load data
const connector = new CSVConnector({
    csv: document.getElementById('csv').innerText,
    firstRowAsNames: true
});
connector.load();

// Add MathModifier to create USD column with exchange valuta from EUR
connector.table.setModifier(new MathModifier({
    columnFormulas: [{
        column: 'USD',
        formula: 'B1*C1'
    }]
}));

// Create Dashboard
Dashboards.board('container', {
    connector,
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-1'
                }, {
                    id: 'dashboard-col-2'
                }]
            }]
        }]
    },
    components: [
        {
            cell: 'dashboard-col-1',
            connector,
            type: 'Highcharts',
            sync: {
                highlight: true
            },
            columnKeyMap: {
                Day: 'x',
                EUR: 'eur',
                Rate: 'y',
                USD: 'usd'
            },
            title: {
                text: 'Chart',
                style: {
                    textAlign: 'center'
                }
            },
            allowConnectorUpdate: true,
            chartOptions: {
                xAxis: {
                    type: 'category'
                },
                chart: {
                    animation: false,
                    type: 'line'
                },
                title: {
                    text: 'Drag points to update the data grid'
                },
                plotOptions: {
                    series: {
                        dragDrop: {
                            draggableY: true,
                            dragPrecisionY: 1
                        }
                    }
                }
            }
        }, {
            cell: 'dashboard-col-2',
            type: 'DataGrid',
            connector,
            editable: true,
            sync: {
                highlight: true
            }
        }
    ]
});
