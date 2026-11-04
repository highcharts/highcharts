const { DataTable } = Highcharts;

Highcharts.chart('container', {
    title: {
        text: 'The <em>series.dataTable</em> option'
    },
    series: [{
        name: 'Options + array',
        dataTable: {
            columns: {
                x: [2026, 2027, 2028, 2029],
                y: [4, 2, 5, 1],
                z: [2, 1, 4, 2]
            }
        }
    }, {
        name: 'Instance + array',
        dataTable: new DataTable({
            columns: {
                x: [2026, 2027, 2028, 2029],
                y: [3, 6, 5, 7]
            }
        })
    }, {
        name: 'Options + typed array',
        dataTable: {
            columns: {
                x: new Uint16Array([2026, 2027, 2028, 2029]),
                y: new Uint8Array([6, 4, 7, 3])
            }
        }
    }, {
        name: 'Instance + typed array',
        dataTable: new DataTable({
            columns: {
                x: new Uint16Array([2026, 2027, 2028, 2029]),
                y: new Uint8Array([9, 5, 9, 4])
            }
        })
    }],
    xAxis: {
        allowDecimals: false
    }
});
