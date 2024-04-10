Highcharts.chart('container', {

    series: [{
        data: [2, {
            y: 4,
            id: 'pointI'
        }, 3, {
            y: 4,
            id: 'pointII'
        }, 6]
    }],

    annotations: [{
        labelOptions: {
            includeInDataExport: true // default
        },
        labels: [{
            point: 'pointI',
            text: 'This is my annotation I'
        }]
    }, {
        labelOptions: {
            includeInDataExport: false
        },
        labels: [{
            point: 'pointII',
            text: 'This is my annotation II'
        }]
    }],

    exporting: {
        showTable: true
    }
});