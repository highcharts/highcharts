Highcharts.chart('container', {

    title: {
        text: 'Highcharts Annotations'
    },

    subtitle: {
        text: 'Annotation label text options'
    },

    series: [{
        keys: ['y', 'id'],
        data: [[39.9, '0'], [71.5, '1'], [106.4, '2'], [129.2, '3'], [144.0, '4'], [176.0, '5']]
    }],

    tooltip: {
        enabled: false
    },

    annotations: [{
        labels: [{
            point: '0',
            format: '{y:.2f} mm'
        }, {
            point: '1',
            text: '{point.plotY:.2f} px'
        }, {
            point: '2'
        }, {
            point: '3'
        }, {
            point: '4'
        }, {
            point: '5'
        }],
        labelOptions: {
            formatter: function () {
                return (this.series.dataMax - this.y).toFixed(2);
            }
        }
    }]
});