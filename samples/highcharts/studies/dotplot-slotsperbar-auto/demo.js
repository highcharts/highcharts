Highcharts.chart('container', {
    chart: {
        type: 'dotplot'
    },
    title: {
        text: 'Stortinget'
    },
    xAxis: {
        type: 'category',
        offset: 5
    },
    yAxis: {
        visible: false
    },
    legend: {
        enabled: false
    },
    series: [{
        data: [
            ['R', 1],
            ['SV', 11],
            ['AP', 49],
            ['SP', 19],
            ['MDG', 1],
            ['KrF', 8],
            ['V', 8],
            ['H', 45],
            ['FrP', 27]
        ],
        name: 'Delegates',
        colorByPoint: true,
        dataLabels: {
            enabled: true,
            y: -10,
            style: {
                fontSize: '1em',
                fontWeight: 'normal'
            }
        }
    }]
});
