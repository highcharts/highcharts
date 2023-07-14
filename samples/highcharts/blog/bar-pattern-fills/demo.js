Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Color blind demo using pattern fills'
    },
    xAxis: {
        categories: ['A', 'B']
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'V1',
        color: 'url(#highcharts-default-pattern-0)',
        data: [5, 3]
    }, {
        name: 'V2',
        color: 'url(#highcharts-default-pattern-8)',
        data: [2, -2]
    }, {
        name: 'V3',
        data: [3, 4]
    }]
});