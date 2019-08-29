QUnit.test('Test Aroon calculations on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        yAxis: [{
            height: '48%'
        }, {
            height: '48%',
            top: '52%'
        }],
        series: [{
            id: 'main',
            type: 'candlestick',
            data: [
                [1474378200000, 113.05, 114.12, 112.51, 113.57],
                [1474464600000, 113.85, 113.99, 112.44, 113.55],
                [1474551000000, 114.35, 114.94, 114, 114.62],
                [1474637400000, 114.42, 114.79, 111.55, 112.71],
                [1474896600000, 111.64, 113.39, 111.55, 112.88],
                [1474983000000, 113, 113.18, 112.34, 113.09],
                [1475069400000, 113.69, 114.64, 113.43, 113.95],
                [1475155800000, 113.16, 113.8, 111.8, 112.18],
                [1475242200000, 112.46, 113.37, 111.8, 113.05],
                [1475501400000, 112.71, 113.05, 112.28, 112.52],
                [1475587800000, 113.06, 114.31, 112.63, 113]
            ]
        }, {
            yAxis: 1,
            type: 'aroon',
            linkedTo: 'main',
            color: 'green',
            lineWidth: 1,
            aroonDown: {
                styles: {
                    lineColor: 'red'
                }
            },
            params: {
                period: 5
            }
        }]
    });

    function toFastAroonWithRound(arr) {
        return Highcharts.map(arr, function (point) {
            return [
                parseFloat(point[0].toFixed(4)),
                parseFloat(point[1].toFixed(4))
            ];
        });
    }

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period,
        'Initial number of Aroon points is correct'
    );

    chart.series[0].addPoint([1475617400000, 112.06, 113.31, 112.43, 112.95]);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period,
        'After addPoint number of Aroon points is correct'
    );

    // Data source - https://www.tradingview.com
    chart.series[0].setData([
        [1533772800000, 2857.19, 2862.48, 2851.98, 2853.58],
        [1533859200000, 2839.64, 2842.2, 2825.81, 2833.28],
        [1534118400000, 2835.46, 2843.4, 2819.88, 2821.93],
        [1534204800000, 2827.88, 2843.11, 2826.58, 2839.96],
        [1534291200000, 2827.95, 2827.95, 2802.49, 2818.37],
        [1534377600000, 2831.44, 2850.49, 2831.44, 2840.69],
        [1534464000000, 2838.32, 2855.63, 2833.73, 2850.13],
        [1534723200000, 2853.93, 2859.76, 2850.62, 2857.05],
        [1534809600000, 2861.51, 2873.23, 2861.32, 2862.96],
        [1534896000000, 2860.99, 2867.54, 2856.05, 2861.82],
        [1534982400000, 2860.29, 2868.78, 2854.03, 2856.98],
        [1535068800000, 2862.35, 2876.16, 2862.35, 2874.69],
        [1535328000000, 2884.69, 2898.25, 2884.69, 2896.74],
        [1535414400000, 2901.45, 2903.77, 2893.5, 2897.52],
        [1535500800000, 2900.62, 2916.5, 2898.4, 2914.04],
        [1535587200000, 2908.94, 2912.46, 2895.22, 2901.13],
        [1535673600000, 2898.37, 2906.32, 2891.73, 2901.52],
        [1536019200000, 2896.96, 2900.18, 2885.13, 2896.72],
        [1536105600000, 2891.59, 2894.21, 2876.92, 2888.6],
        [1536192000000, 2888.64, 2892.05, 2867.29, 2878.05],
        [1536278400000, 2868.26, 2883.81, 2864.12, 2871.68],
        [1536537600000, 2881.39, 2886.93, 2875.94, 2877.13],
        [1536624000000, 2871.57, 2892.52, 2866.78, 2887.89],
        [1536710400000, 2888.29, 2894.65, 2879.2, 2888.92],
        [1536796800000, 2896.85, 2906.76, 2896.39, 2904.18],
        [1536883200000, 2906.38, 2908.3, 2895.77, 2904.98]
    ], true);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period,
        'After setData number of Aroon points is correct'
    );

    chart.series[1].update({
        color: 'cyan',
        aroonDown: {
            styles: {
                lineColor: 'tomato'
            }
        },
        params: {
            period: 14
        }
    });

    assert.deepEqual(
        toFastAroonWithRound(chart.series[1].yData),
        [
            [100.0000, 28.5714],
            [92.8571, 21.4286],
            [85.7143, 14.2857],
            [78.5714, 7.1429],
            [71.4286, 0.0000],
            [64.2857, 0.0000],
            [57.1429, 0.0000],
            [50.0000, 0.0000],
            [42.8571, 14.2857],
            [35.7143, 7.1429],
            [28.5714, 0.0000],
            [21.4286, 0.0000]
        ],
        'Correct values'
    );

    assert.strictEqual(
        chart.series[1].graph.attr('stroke'),
        'cyan',
        'Line color changed'
    );

    assert.strictEqual(
        chart.series[1].grapharoonDown.attr('stroke'),
        'tomato',
        'AroonDown line color changed'
    );

    chart.series[0].points[chart.series[0].points.length - 1].remove();

    assert.deepEqual(
        toFastAroonWithRound(chart.series[1].yData),
        [
            [100.0000, 28.5714],
            [92.8571, 21.4286],
            [85.7143, 14.2857],
            [78.5714, 7.1429],
            [71.4286, 0.0000],
            [64.2857, 0.0000],
            [57.1429, 0.0000],
            [50.0000, 0.0000],
            [42.8571, 14.2857],
            [35.7143, 7.1429],
            [28.5714, 0.0000]
        ],
        'Correct values after point.remove()'
    );
});