Highcharts.chart('container', {
    title: {
        text: 'Pattern fill module'
    },
    subtitle: {
        text: 'With pattern transform'
    },
    series: [{
        type: 'pie',
        borderColor: Highcharts.getOptions().colors[0],
        data: [{
            y: 1,
            color: {
                pattern: {
                    path: 'M 0 0 L 5 10 L 10 0',
                    width: 10,
                    height: 10,
                    color: '#6070a0',
                    patternTransform: 'scale(3) rotate(30)'
                }
            }
        }],
        dataLabels: {
            enabled: false
        }
    }]
});
