
Highcharts.chart('container', {
    title: {
        text: 'Pattern fill plugin demo'
    },

    series: [{
        type: 'pie',
        borderColor: Highcharts.getOptions().colors[0],
        data: [{
            y: 1,
            color: 'url(#highcharts-default-pattern-0)'
        }, {
            y: 1,
            color: 'url(#highcharts-default-pattern-1)'
        }, {
            y: 1,
            color: 'url(#highcharts-default-pattern-2)'
        }, {
            y: 1,
            color: 'url(#highcharts-default-pattern-3)'
        }, {
            y: 1,
            color: 'url(#highcharts-default-pattern-4)'
        }, {
            y: 1,
            color: 'url(#highcharts-default-pattern-5)'
        }, {
            y: 1,
            color: 'url(#highcharts-default-pattern-6)'
        }, {
            y: 1,
            color: 'url(#highcharts-default-pattern-7)'
        }, {
            y: 1,
            color: 'url(#highcharts-default-pattern-8)'
        }, {
            y: 1,
            color: 'url(#highcharts-default-pattern-9)'
        }, {
            y: 1,
            color: {
                pattern: {
                    image: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Onedolar2009series.jpg',
                    aspectRatio: 9 / 4
                }
            }
        }],
        dataLabels: {
            connectorColor: Highcharts.getOptions().colors[0],
            formatter: function () {
                var i = this.point.index;
                return i > 9 ?
                    'Custom pattern' : // For the last one, show custom label
                    'default-pattern-' + i; // Show default pattern label
            }
        }
    }]
});
