const { DataTable } = Highcharts;

Highcharts.stockChart('container', {
    title: {
        text: 'The <em>series.dataTable</em> option'
    },
    plotOptions: {
        series: {
            relativeXValue: true,
            pointIntervalUnit: 'day',
            pointStart: '2026-01-01'
        }
    },
    series: [{
        name: 'Options + array',
        dataTable: {
            columns: {
                x: [89, 90, 91, 92],
                y: [4, 2, 5, 1],
                z: [2, 1, 4, 2]
            }
        }
    }, {
        name: 'Instance + array',
        dataTable: new DataTable({
            columns: {
                x: [89, 90, 91, 92],
                y: [3, 6, 5, 7]
            }
        })
    }, {
        name: 'Options + typed array',
        dataTable: {
            columns: {
                x: new Uint16Array([89, 90, 91, 92]),
                y: new Uint8Array([6, 4, 7, 3])
            }
        }
    }, {
        name: 'Instance + typed array',
        dataTable: new DataTable({
            columns: {
                x: new Uint16Array([89, 90, 91, 92]),
                y: new Uint8Array([9, 5, 9, 4])
            }
        })
    }],
    xAxis: {
        allowDecimals: false
    }
});
