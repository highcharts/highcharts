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
        keys: ['name', 'y', 'color'],
        data: [
            ['R', 1, '#9c0014'],
            ['SV', 11, '#da47bb'],
            ['AP', 49, '#e90031'],
            ['SP', 19, '#a8cd4d'],
            ['MDG', 1, '#3e8720'],
            ['KrF', 8, '#f4b436'],
            ['V', 8, '#14b48f'],
            ['H', 45, '#00bbef'],
            ['FrP', 27, '#005996']
        ],
        name: 'Seats',
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
