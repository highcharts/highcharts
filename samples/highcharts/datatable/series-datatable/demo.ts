const { DataTableCore } = Highcharts;

Highcharts.chart('container', {
    title: {
        text: 'The <em>series.dataTable</em> option'
    },
    series: [{
        name: 'Options + array',
        dataTable: {
            columns: {
                x: [0, 1, 3, 4],
                y: [4, 2, 5, 1],
                z: [2, 1, 4, 2]
            }
        }
    }, {
        name: 'Instance + array',
        dataTable: new DataTableCore({
            columns: {
                x: [0, 1, 3, 4],
                y: [3, 6, 5, 7]
            }
        })
    }, {
        name: 'Options + typed array',
        dataTable: {
            columns: {
                x: new Uint8Array([0, 1, 3, 4]),
                y: new Uint8Array([6, 4, 7, 3])
            }
        }
    }, {
        name: 'Instance + typed array',
        dataTable: new DataTableCore({
            columns: {
                x: new Uint8Array([0, 1, 3, 4]),
                y: new Uint8Array([9, 5, 9, 4])
            }
        })
    }]
});
