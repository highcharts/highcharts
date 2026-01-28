Grid.grid('container', {
    data: {
        connector: {
            id: 'employees-json',
            type: 'CSV',
            enablePolling: true,
            dataRefreshRate: 1,
            csvURL: 'https://demo-live-data.highcharts.com/time-data.csv'
        },
        updateOnChange: true
    },
    columns: [{
        id: 'Time',
        dataType: 'datetime'
    }, {
        id: 'Value',
        cells: {
            format: '{value:0.2f}'
        },
        filtering: {
            condition: 'greaterThan',
            value: 0
        }
    }]
});
