Highcharts.chart('container', {
    chart: {
        polar: true,
        type: 'area'
    },
    accessibility: {
        typeDescription: 'Polar chart with 2 data series.'
    },
    title: {
        text: 'Bitcoin Historical Prices: 2020 & 2021'
    },
    tooltip: {
        shared: true,
        valueSuffix: '$'
    },
    xAxis: {
        gridLineColor: '#8991ad',
        lineWidth: 0,
        tickmarkPlacement: 'on',
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        accessibility: {
            description: 'Months of the Year'
        }
    },
    yAxis: {
        gridLineColor: '#8991ad',
        gridLineInterpolation: 'polygon',
        max: 75000,
        tickInterval: 25000,
        accessibility: {
            description: 'Bitcoin Price in USD'
        },
        labels: {
            format: `{#if isFirst}<text fill="#000">{value}</text>
                {else}{value}{/if}`,
            align: 'left',
            style: {
                color: '#fff'
            }
        },
        plotBands: [{
            color: '#464b6f',
            from: 0,
            to: 75000
        }]
    },
    plotOptions: {
        series: {
            pointPlacement: 'on',
            marker: {
                enabled: false
            }
        }
    },
    series: [{
        color: '#ffbf00',
        name: '2020',
        zIndex: 1,
        data: [
            9349.1, 8543.7, 6412.5, 8629.0, 9454.8, 9135.4,
            11333.4, 11644.2, 10776.1, 13797.3, 19698.1, 28949.4
        ]
    }, {
        color: '#fb922c',
        fillOpacity: 0.2,
        name: '2021',
        zIndex: 0,
        data: [
            33108.1, 45164.0, 58763.7, 57720.3, 37298.6, 35026.9,
            41553.7, 47130.4, 43823.3, 61309.6, 56882.9, 46219.5
        ]
    }]
});
