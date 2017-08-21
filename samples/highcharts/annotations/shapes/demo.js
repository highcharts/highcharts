Highcharts.chart('container', {

    title: {
        text: 'Highcharts Annotations'
    },

    subtitle: {
        text: 'Annotation label shapes'
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
            point: '0'
            // shape: 'callout'
        }, {
            point: '1',
            shape: 'connector',
            y: -80
        }, {
            point: '2',
            shape: 'rect'
        }, {
            point: '3',
            shape: 'circle',
            padding: 10
        }, {
            point: '4',
            shape: 'diamond',
            padding: 20
        }, {
            point: '5',
            shape: 'triangle',
            padding: 20,
            overflow: 'justify'
        }]
    }]
});