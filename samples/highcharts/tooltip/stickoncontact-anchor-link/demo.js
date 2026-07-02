Highcharts.chart('container', {
    title: {
        text: 'Tooltip with clickable anchor links'
    },

    subtitle: {
        text: 'Use stickOnContact to keep the tooltip open while hovering links'
    },

    tooltip: {
        stickOnContact: true
    },

    xAxis: {
        categories: ['A', 'B', 'C']
    },

    series: [{
        tooltip: {
            headerFormat: '',
            pointFormat:
                '{point.y} <a href="{point.custom.url}" ' +
                'target="_blank" rel="noopener">Link</a>'
        },
        data: [{
            y: 1,
            custom: {
                url: 'https://www.highcharts.com/#1'
            }
        }, {
            y: 3,
            custom: {
                url: 'https://www.highcharts.com/#2'
            }
        }, {
            y: 2,
            custom: {
                url: 'https://www.highcharts.com/#3'
            }
        }]
    }]
});
