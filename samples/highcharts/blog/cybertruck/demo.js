Highcharts.chart('container', {
    chart: {
        type: 'area',
        height: '50%'
    },
    title: {
        text: 'Cybertruck Chart'
    },
    xAxis: {
        categories: ['Front', 'Middle', 'Rear']
    },
    yAxis: {
        visible: false,
        min: -0.5,
        startOnTick: false
    },
    plotOptions: {
        area: {
            lineWidth: 0,
            marker: {
                enabled: false
            }
        }
    },
    series: [{
        data: [
            [0, 1],
            [0.85, 1.8],
            [2, 1]
        ],
        name: 'Top',
        color: 'silver'
    }, {
        data: [1, 1, 1],
        name: 'Bottom',
        color: 'gray'
    }, {
        data: [{
            x: 0.3,
            y: 0
        }, {
            x: 1.7,
            y: 0
        }],
        color: 'charcoal',
        type: 'scatter',
        marker: {
            symbol: 'circle',
            radius: 25
        },
        name: 'Wheel'

    }, {
        name: 'Windows',
        data: [
            [0.25, 1.1],
            [0.85, 1.65],
            [1.55, 1.2]
        ],
        threshold: 1.1,
        color: '#666'
    }, {
        name: 'Oops',
        data: [
            [0.25, 1.1],
            [0.85, 1.65],
            [1.55, 1.2]
        ],
        threshold: 1.1,
        color: {
            pattern: {
                image: 'https://cdn1.iconfinder.com/data/icons/security/80/Security_safety-10-512.png',
                width: 50,
                y: 22,
                height: 50
            }
        }
    }]
});
