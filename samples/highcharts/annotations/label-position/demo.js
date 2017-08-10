Highcharts.chart('container', {

    title: {
        text: 'Highcharts Annotations'
    },

    subtitle: {
        text: 'Annotation label position options'
    },

    series: [{
        keys: ['y', 'id'],
        data: [[29.9, '0'], [71.5, '1'], [106.4, '2'], [129.2, '3'], [144.0, '4'], [176.0, '5']]
    }],

    tooltip: {
        enabled: false
    },

    annotations: [{
        labels: [{
            //verticalAlign: 'top', top by default
            align: 'left',
            point: '0'
        }, {
            //verticalAlign: 'top', top by default
            align: 'right',
            point: '1'
        }, {
            //align: 'center', center by default
            verticalAlign: 'top',
            point: '2'
        }, {
            x: 50,
            point: '3'
        }, {
            distance: 20,
            point: '4'
        }],
        labelOptions: {
            point: '1',
            y: 0,
            allowOverlap: true
        }
    }]
});