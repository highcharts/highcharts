QUnit.test(
    'Testing DMI indicator (values, period and updates), #15140.',
    assert => {

        const chart = Highcharts.stockChart('container', {
                yAxis: [{
                    height: '60%'
                }, {
                    height: '40%',
                    top: '60%'
                }],
                series: [{
                    id: 'main',
                    type: 'ohlc',
                    data: [
                        [1552311000000, 43.87, 44.78, 43.84, 44.72],
                        [1552397400000, 45.00, 45.67, 44.84, 45.23],
                        [1552483800000, 45.56, 45.83, 45.23, 45.43],
                        [1552570200000, 45.97, 46.03, 45.64, 45.93],
                        [1552656600000, 46.21, 46.83, 45.94, 46.53],
                        [1552915800000, 46.45, 47.1, 46.45, 47.01],
                        [1553002200000, 47.09, 47.25, 46.48, 46.63],
                        [1553088600000, 46.56, 47.37, 46.18, 47.04],
                        [1553175000000, 47.51, 49.08, 47.45, 48.77],
                        [1553261400000, 48.83, 49.42, 47.69, 47.76],
                        [1553520600000, 47.88, 47.99, 46.65, 47.19],
                        [1553607000000, 47.92, 48.22, 46.15, 46.7],
                        [1553693400000, 47.19, 47.44, 46.64, 47.12],
                        [1553779800000, 47.24, 47.39, 46.88, 47.18],
                        [1553866200000, 47.46, 47.52, 47.13, 47.49],
                        [1554125400000, 47.91, 47.92, 47.1, 47.81],
                        [1554211800000, 47.77, 48.62, 47.76, 48.51],
                        [1554298200000, 48.31, 49.13, 48.29, 48.84],
                        [1554384600000, 48.7, 49.09, 48.28, 48.92],
                        [1554471000000, 49.11, 49.28, 48.98, 49.25],
                        [1554730200000, 49.1, 50.06, 49.08, 50.03],
                        [1554816600000, 50.08, 50.71, 49.81, 49.88],
                        [1554903000000, 49.67, 50.19, 49.54, 50.15],
                        [1554989400000, 50.21, 50.25, 49.61, 49.74],
                        [1555075800000, 49.8, 50.03, 49.05, 49.72]
                    ]
                }, {
                    type: 'dmi',
                    linkedTo: 'main',
                    yAxis: 1
                }]
            }),
            DMIIndicator = chart.series[1],
            testNumberOfPoints = textDescription => {
                assert.strictEqual(
                    chart.series[0].points.length,
                    DMIIndicator.points.length +
                        DMIIndicator.options.params.period,
                    textDescription
                );
            };

        testNumberOfPoints(
            `The number of the initial DMI points should be equal to the
            number of the main series' points plus period.`
        );

        assert.deepEqual(
            DMIIndicator.yData,
            [
                [43.297380585516, 31.98074277854195, 12.65474552957359],
                [46.826720017784, 32.94264339151991, 11.930174563590466],
                [52.409302040847, 35.88571057923044, 11.205523484177014],
                [56.031253042069, 37.37679367307779, 10.532574411020512],
                [55.780902106716, 35.18263120832816, 9.986745438658557],
                [57.186486029443, 35.66350095611376, 9.713810868814292],
                [62.461775706847, 38.92198371971314, 8.99326717591371],
                [66.199381720766, 41.19798697885961, 8.378595740415323],
                [59.112437497085, 39.11846792735972, 10.052380741307685],
                [59.525469402892, 37.607393331916384, 9.541683831350067],
                [44.821122205165, 34.70030407492836, 13.221302313080818]
            ],
            'The DMI (DX, +DI, -DI) values should be correct.'
        );

        chart.series[0].addPoint([1555335000000, 49.65, 49.96, 49.5, 49.81]);

        testNumberOfPoints(
            `After addPoint: the number of DMI points should be equal to the
            number of the main series' points plus period.`
        );

        assert.deepEqual(
            DMIIndicator.yData,
            [
                [43.297380585516, 31.98074277854195, 12.65474552957359],
                [46.826720017784, 32.94264339151991, 11.930174563590466],
                [52.409302040847, 35.88571057923044, 11.205523484177014],
                [56.031253042069, 37.37679367307779, 10.532574411020512],
                [55.780902106716, 35.18263120832816, 9.986745438658557],
                [57.186486029443, 35.66350095611376, 9.713810868814292],
                [62.461775706847, 38.92198371971314, 8.99326717591371],
                [66.199381720766, 41.19798697885961, 8.378595740415323],
                [59.112437497085, 39.11846792735972, 10.052380741307685],
                [59.525469402892, 37.607393331916384, 9.541683831350067],
                [44.821122205165, 34.70030407492836, 13.221302313080818],
                [44.821122205164, 33.3953721369493, 12.72410495098401]
            ],
            'After addPoint: the DMI (DX, +DI, -DI) values should be correct.'
        );

        chart.series[0].setData([
            [0, 5, 30.1983, 29.4072, 29.8720],
            [1, 5, 30.2776, 29.3182, 30.2381],
            [2, 5, 30.4458, 29.9611, 30.0996],
            [3, 5, 29.3478, 28.7443, 28.9028],
            [4, 5, 29.3477, 28.5566, 28.9225],
            [5, 5, 29.2886, 28.4081, 28.4775],
            [6, 5, 28.8334, 28.0818, 28.5566],
            [7, 5, 28.7346, 27.4289, 27.5576],
            [8, 5, 28.6654, 27.6565, 28.4675],
            [9, 5, 28.8532, 27.8345, 28.2796],
            [10, 5, 28.6356, 27.3992, 27.4882],
            [11, 5, 27.6761, 27.0927, 27.2310],
            [12, 5, 27.2112, 26.1826, 26.3507],
            [13, 5, 26.8651, 26.1332, 26.3309],
            [14, 5, 27.4090, 26.6277, 27.0333],
            [15, 5, 26.9441, 26.1332, 26.2221],
            [16, 5, 26.5189, 25.4307, 26.0144],
            [17, 5, 26.5189, 25.3518, 25.4605],
            [18, 5, 27.0927, 25.8760, 27.0333],
            [19, 5, 27.6860, 26.9640, 27.4487]
        ]);

        testNumberOfPoints(
            `After setData: the number of DMI points should be equal to the
            number of the main series' points plus period.`
        );

        assert.deepEqual(
            DMIIndicator.yData,
            [
                [65.536917892157, 6.749418735468388, 32.419560489012234],
                [68.725990520516, 6.291978073515623, 33.94576680306143],
                [72.604416961353, 5.781786709035135, 36.42784030185068],
                [73.00927420736, 5.2866652539515755, 33.887273932175226],
                [55.062130522264, 8.698807305216645, 30.01601120448783],
                [39.005433261603, 12.491034564715834, 28.466825233811164]
            ],
            'After setData: the DMI (DX, +DI, -DI) values should be correct.'
        );

        assert.strictEqual(
            DMIIndicator.graph.element.getAttribute('stroke'),
            Highcharts.defaultOptions.colors[1],
            'The DX line color should be correct.'
        );

        assert.strictEqual(
            DMIIndicator.graphplusDILine.element.getAttribute('stroke'),
            DMIIndicator.options.plusDILine.styles.lineColor,
            'The +DI line color should be green-ish by default.'
        );

        assert.strictEqual(
            DMIIndicator.graphminusDILine.element.getAttribute('stroke'),
            DMIIndicator.options.minusDILine.styles.lineColor,
            'The -DI line color should be red-ish by default.'
        );

        DMIIndicator.update({
            params: {
                period: 9
            },
            color: '#111222',
            plusDILine: {
                styles: {
                    lineColor: '#07f207',
                    lineWidth: 3
                }
            },
            minusDILine: {
                styles: {
                    lineColor: '#f20a0a',
                    lineWidth: 4
                }
            }
        });

        assert.strictEqual(
            DMIIndicator.graph.element.getAttribute('stroke'),
            '#111222',
            'The DX line color should be correct.'
        );

        assert.strictEqual(
            DMIIndicator.graphplusDILine.element.getAttribute('stroke'),
            '#07f207',
            'The +DI line color should be #07f207 (green-ish).'
        );

        assert.strictEqual(
            DMIIndicator.graphminusDILine.element.getAttribute('stroke'),
            '#f20a0a',
            'The -DI line color should be #f20a0a (red-ish).'
        );

        assert.strictEqual(
            DMIIndicator.graph.element.getAttribute('stroke-width'),
            '1',
            'The DX line width should be correct.'
        );

        assert.strictEqual(
            DMIIndicator.graphplusDILine.element.getAttribute('stroke-width'),
            '3',
            'The +DI line width should be correct.'
        );

        assert.strictEqual(
            DMIIndicator.graphminusDILine.element.getAttribute('stroke-width'),
            '4',
            'The -DI line width should be correct.'
        );

        testNumberOfPoints(
            `After period update: the number of DMI points should be equal
            to the number of the main series' points plus period.`
        );

        assert.deepEqual(
            DMIIndicator.yData,
            [
                [76.08491199785, 4.1133243980219065, 30.28608402273882],
                [79.462994811667, 3.543787173680344, 30.96744892118592],
                [81.529648910112, 3.301151548994026, 32.444260467579944],
                [86.176508809317, 2.8997649731834154, 39.05439744763665],
                [86.385665234542, 2.646993790152366, 36.238399227629884],
                [56.967941469273, 8.680654131358372, 31.664402218478898],
                [62.949215797801, 7.760613203017402, 34.131148982986446],
                [69.683776284956, 6.782842717435752, 37.96443703079862],
                [70.364402600831, 5.887796348038017, 33.84682596265047],
                [43.927350477024, 10.91939104592899, 28.027907285157493],
                [21.91966974528, 16.535109503389695, 25.81898774350347]
            ],
            'After period update: the DMI (DX, +DI, -DI) values should be correct.'
        );

        chart.series[0].points[chart.series[0].points.length - 1].remove();

        testNumberOfPoints(
            `After point remove: the number of DMI points should be equal to
            the number of the main series' points plus period.`
        );

        assert.deepEqual(
            chart.series[1].yData,
            [
                [76.08491199785, 4.1133243980219065, 30.28608402273882],
                [79.462994811667, 3.543787173680344, 30.96744892118592],
                [81.529648910112, 3.301151548994026, 32.444260467579944],
                [86.176508809317, 2.8997649731834154, 39.05439744763665],
                [86.385665234542, 2.646993790152366, 36.238399227629884],
                [56.967941469273, 8.680654131358372, 31.664402218478898],
                [62.949215797801, 7.760613203017402, 34.131148982986446],
                [69.683776284956, 6.782842717435752, 37.96443703079862],
                [70.364402600831, 5.887796348038017, 33.84682596265047],
                [43.927350477024, 10.91939104592899, 28.027907285157493]
            ],
            'After point remove: the DMI (DX, +DI, -DI) values should be correct.'
        );
    });
