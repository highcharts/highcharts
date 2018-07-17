Highcharts.chart('container', {

    title: {
        text: 'Highcharts Annotations'
    },

    subtitle: {
        text: 'Annotation visibility'
    },

    series: [{
        keys: ['y', 'id'],
        data: [[29.9, '0'], [71.5, '1'], [106.4, '2'], [129.2, '3'], [144.0, '4'], [176.0, '5']]
    }],

    tooltip: {
        enabled: false
    },

    annotations: [{
        //visible: true, by default the annotation is visible
        labels: [{
            point: '0'
        }]
    }, {
        visible: false,
        labels: [{
            point: '1'
        }]
    }]
});