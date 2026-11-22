Highcharts.chart('container', {
    chart: {
        alignThresholds: true,
        type: 'column'
    },
    title: {
        text: 'Demo of <em>chart.alignThresholds</em>'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears']
    },
    yAxis: [
        {
            title: {
                text: 'Primary Axis'
            },
            gridLineWidth: 0,
            id: 'primary',
            plotLines: [
                {
                    value: 0,
                    width: 2,
                    zIndex: 1
                }
            ]
        },
        {
            title: {
                text: 'Secondary Axis'
            },
            id: 'secondary',
            opposite: true
        }
    ],
    series: [
        {
            yAxis: 'primary',
            data: [-5, -11, -1, 2]
        },
        {
            yAxis: 'secondary',
            data: [1000, 1001, 1002, 1004]
        }
    ]
});
