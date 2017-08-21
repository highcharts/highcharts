Highcharts.chart('container', {

    title: {
        text: 'Highcharts Annotations'
    },

    subtitle: {
        text: 'Annotation label presentation options'
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
            point: '0',
            shadow: true
        }, {
            point: '1',
            shadow: {
                color: 'red',
                offsetX: -1,
                opacity: 0.3
            }
        }, {
            point: '2',
            padding: 10
        }, {
            point: '3',
            style: {
                fontSize: '8px'
            }
        }, {
            point: '4',
            borderWidth: 3
        }, {
            point: '5'
        }],
        labelOptions: {
            borderRadius: 5,
            backgroundColor: 'rgba(252, 255, 197, 0.7)',
            borderWidth: 1,
            borderColor: '#AAA'
        }
    }]
});