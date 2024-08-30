Highcharts.chart('container-area', {
    chart: {
        type: 'area'
    },

    title: {
        text: ''
    },

    xAxis: {
        visible: false
    },

    yAxis: {
        visible: false
    },

    exporting: {
        enabled: false
    },

    lang: {
        accessibility: {
            chartContainerLabel: 'Area chart with patterns.'
        }
    },

    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '<p>Area chart showing use of visual pattern ' +
                'fills.</p>'
        },
        landmarkVerbosity: 'one'
    },

    legend: {
        enabled: false
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6],
        color: '#88e',
        fillColor: {
            pattern: {
                color: '#11d',
                path: {
                    d: 'M 0 10 L 10 0 M -1 1 L 1 -1 M 11 9 L 9 11',
                    strokeWidth: 3
                },
                width: 10,
                height: 10,
                opacity: 0.4
            }
        }
    }, {
        data: [
            null, null, null, null, null,
            43.1, 95.6, 148.5, 216.4, 194.1, 95.6, 54.4
        ],
        color: '#e88',
        fillColor: {
            pattern: {
                color: '#d11',
                path: {
                    d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
                    strokeWidth: 3
                },
                width: 10,
                height: 10,
                opacity: 0.4
            }
        }
    }]
});
