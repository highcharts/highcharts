QUnit.test('Inside or outside plot area', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            marginLeft: 100,
            marginRight: 100
        },
        title: {
            text: 'Highcharts Wind Barbs'
        },

        xAxis: {
            type: 'datetime',
            offset: 40,
            min: Date.UTC(2017, 0, 29, 4),
            max: Date.UTC(2017, 0, 29, 20)
        },
        plotOptions: {
            series: {
                pointStart: Date.UTC(2017, 0, 29),
                pointInterval: 36e5
            }
        },

        series: [{
            type: 'windbarb',
            data: [
                [9.8, 177.9],
                [10.1, 177.2],
                [11.3, 179.7],
                [10.9, 175.5],
                [9.3, 159.9],
                [8.8, 159.6],
                [7.8, 162.6],
                [5.6, 186.2],
                [6.8, 146.0],
                [6.4, 139.9],
                [3.1, 180.2],
                [4.3, 177.6],
                [5.3, 191.8],
                [6.3, 173.1],
                [7.7, 140.2],
                [8.5, 136.1],
                [9.4, 142.9],
                [10.0, 140.4],
                [5.3, 142.1],
                [3.8, 141.0],
                [3.3, 116.5],
                [1.5, 327.5],
                [0.1, 1.1],
                [1.2, 11.1]
            ],
            name: 'Wind'
        }, {
            type: 'area',
            keys: ['y', 'rotation'], // rotation is not used here
            data: [
                [9.8, 177.9],
                [10.1, 177.2],
                [11.3, 179.7],
                [10.9, 175.5],
                [9.3, 159.9],
                [8.8, 159.6],
                [7.8, 162.6],
                [5.6, 186.2],
                [6.8, 146.0],
                [6.4, 139.9],
                [3.1, 180.2],
                [4.3, 177.6],
                [5.3, 191.8],
                [6.3, 173.1],
                [7.7, 140.2],
                [8.5, 136.1],
                [9.4, 142.9],
                [10.0, 140.4],
                [5.3, 142.1],
                [3.8, 141.0],
                [3.3, 116.5],
                [1.5, 327.5],
                [0.1, 1.1],
                [1.2, 11.1]
            ]
        }]

    });

    assert.strictEqual(
        chart.series[0].points.map(function (point) {
            return Boolean(point.graphic);
        }).join(','),
        [
            false, false, false, false, true, true, true, true, true, true,
            true, true, true, true, true, true, true, true, true, true, true,
            false, false, false
        ].join(','),
        'Hidden points ouside plot area (#7507)'
    );


    chart.xAxis[0].setExtremes(
        1485681192000,
        1485700200000,
        true,
        false
    );
    assert.strictEqual(
        chart.series[0].points.some(function (point) {
            return (
                point.graphic &&
                point.graphic.attr('translateY').toString() === 'NaN'
            );
        }),
        false,
        'All valid points should be translated (#7507)'
    );
});