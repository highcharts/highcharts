const dataTable = new Highcharts.DataTable({
    columns: {
        Time: [Math.round(Date.now() / 1000) * 1000],
        'Average Reading': [1 + Math.random()],
        'Max Reading': [2 + 2 * Math.random()]
    }
});

Highcharts.chart('container', {
    dataTable,
    title: {
        text: 'Live DataTable chart'
    },
    subtitle: {
        text: 'Adding new points shifts out old ones when exceeding 20 ' +
            'table rows'
    },
    plotOptions: {
        series: {
            dataMapping: {
                x: 'Time'
            }
        }
    },
    time: {
        timezone: void 0 // Local time
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    series: [{
        dataMapping: {
            y: 'Average Reading'
        },
        type: 'column'
    }, {
        dataMapping: {
            y: 'Max Reading'
        }
    }]
});

setInterval(() => {
    if (dataTable.rowCount > 20) {
        dataTable.deleteRows(0);
    }
    dataTable.setRow({
        Time: Math.round(Date.now() / 1000) * 1000,
        'Average Reading': 1 + Math.random(),
        'Max Reading': 2 + 2 * Math.random()
    });
}, 1000);
