Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },

    title: {
        text: 'Desktop screen readers'
    },

    caption: {
        text: 'Basic bar chart demo'
    },

    xAxis: {
        type: 'category'
    },

    series: [{
        name: 'Percentage usage',
        data: [{
            name: 'JAWS',
            y: 30.2,
            accessibility: {
                description: 'This is the most used desktop screen reader'
            }
        }, {
            name: 'ZoomText',
            y: 22.2
        }, {
            name: 'Window-Eyes',
            y: 20.7
        }, {
            name: 'NVDA',
            y: 14.6
        }, {
            name: 'VoiceOver',
            y: 7.6
        }, {
            name: 'System Access To Go',
            y: 1.5
        }, {
            name: 'ChromeVox',
            y: 0.3
        }, {
            name: 'Other',
            y: 2.9
        }]
    }, {
        name: 'Test values',
        data: [3, 6, 8, 10, 4, 1, 1, 0]
    }]
});
