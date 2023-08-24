const data = [
    1, // first group
    2, // first group ---> (1 + 2) / 2 = 1,5
    3, // second group
    4, // second group ---> (3 + 4) / 2 = 3,5
    1,
    2,
    3,
    4,
    1,
    2,
    3,
    4
];

Highcharts.stockChart('container', {
    chart: {
        height: 800
    },
    yAxis: [{
        height: '33.33%',
        offset: 0,
        title: {
            text: 'Anchor start- default'
        }
    }, {
        height: '33.33%',
        top: '33.33%',
        offset: 0,
        title: {
            text: 'Anchor middle'
        }
    }, {
        height: '33.33%',
        top: '66.66%',
        offset: 0,
        title: {
            text: 'Anchor end'
        }
    }],
    plotOptions: {
        series: {
            data: data,
            pointInterval: 3600 * 1000,
            dataGrouping: {
                approximation: 'average',
                enabled: true,
                forced: true,
                units: [
                    ['hour', [2]]
                ]
            }
        }
    },
    series: [{
        yAxis: 0
    }, {
        yAxis: 1,
        dataGrouping: {
            anchor: 'middle'
        }
    }, {
        yAxis: 2,
        dataGrouping: {
            anchor: 'end'
        }
    }]
});