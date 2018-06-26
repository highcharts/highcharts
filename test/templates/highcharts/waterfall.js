TestTemplate.register('highcharts/waterfall', Highcharts.chart, {

    chart: {
        type: 'waterfall'
    },

    title: {
        text: 'template/highcharts/waterfall'
    },

    series: [{
        data: [{
            name: 'Value 1',
            y: 1
        }, {
            name: 'Value 2',
            y: 1
        }, {
            name: 'Intermediate Sum',
            isIntermediateSum: true
        }, {
            name: 'Total Sum',
            isSum: true
        }]
    }]

});
