(async () => {
    const csv = await fetch(
        'https://www.highcharts.com/samples/data/operating-systems-trends.csv'
    ).then(result => result.text());
    const dataTable = new Highcharts.Data({ csv }).getDataTable();

    Highcharts.chart('container', {
        dataTable,
        time: {
            timezone: 'UTC'
        },
        title: {
            text: 'DataTable from CSV'
        },
        subtitle: {
            text: 'The data shows operating systems trends'
        },
        xAxis: {
            type: 'datetime'
        },
        plotOptions: {
            series: {
                dataMapping: {
                    x: 'Month'
                }
            }
        },
        series: [{
            dataMapping: {
                y: 'Android'
            }
        }, {
            dataMapping: {
                y: 'iOS'
            }
        }, {
            dataMapping: {
                y: 'Microsoft Windows'
            }
        }, {
            dataMapping: {
                y: 'Linux'
            }
        }, {
            dataMapping: {
                y: 'MacOS'
            }
        }]
    });

    Object.setPrototypeOf(dataTable, Grid.DataTable.prototype);
    Grid.grid('grid-container', {
        data: {
            dataTable
        },
        columns: [{
            id: 'Month',
            cells: {
                format: '{value:%[bY]}'
            }
        }]
    });
})();
