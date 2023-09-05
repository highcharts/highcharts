Highcharts.chart('container', {
    title: {
        text: 'Pattern fill plugin demo'
    },
    legend: {
        enabled: true
    },
    series: [{
        showInLegend: true,
        type: 'pie',
        borderColor: Highcharts.getOptions().colors[0],
        data: [{
            y: 1,
            color: {
                patternIndex: 0
            }
        }, {
            y: 1,
            color: {
                patternIndex: 1
            }
        }, {
            y: 1,
            color: {
                patternIndex: 2
            }
        }, {
            y: 1,
            color: {
                patternIndex: 3
            }
        }, {
            y: 1,
            color: {
                patternIndex: 4
            }
        }, {
            y: 1,
            color: {
                patternIndex: 5
            }
        }, {
            y: 1,
            color: {
                patternIndex: 6
            }
        }, {
            y: 1,
            color: {
                patternIndex: 7
            }
        }, {
            y: 1,
            color: {
                patternIndex: 8
            }
        }, {
            y: 1,
            color: {
                patternIndex: 9
            }
        }, {
            y: 1,
            color: {
                pattern: {
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/United_States_one_dollar_bill%2C_obverse.jpg/320px-United_States_one_dollar_bill%2C_obverse.jpg',
                    aspectRatio: 9 / 4
                }
            }
        }],
        dataLabels: {
            connectorColor: Highcharts.getOptions().colors[0],
            formatter: function () {
                const i = this.point.index;
                return i > 9 ?
                    'Custom pattern' : // For the last one, show custom label
                    'default-pattern-' + i; // Show default pattern label
            }
        }
    }]
});
