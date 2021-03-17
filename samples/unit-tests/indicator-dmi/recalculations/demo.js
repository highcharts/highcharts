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
            'The number of the initial DMI points should be equal to the ' +
            'number of the main series\' points plus period.'
        );

        assert.deepEqual(
            DMIIndicator.yData,
            [
                [43.29738058551631, 31.980742778541977, 12.65474552957356],
                [46.82672001778382, 32.94264339152121, 11.930174563590992],
                [52.409302040847635, 35.885710579230704, 11.20552348417689],
                [56.03125304207054, 37.376793673076655, 10.532574411019665],
                [55.78090210671901, 35.18263120832859, 9.986745438657872],
                [57.18648602944597, 35.66350095611362, 9.713810868813523],
                [62.461775706850055, 38.92198371971246, 8.993267175912646],
                [66.19938172076904, 41.19798697886022, 8.378595740414633],
                [59.11243749708767, 39.118467927361465, 10.052380741307163],
                [59.52546940289456, 37.607393331916676, 9.541683831349514],
                [44.82112220516712, 34.7003040749299, 13.221302313080557]
            ],
            'The DMI (DX, +DI, -DI) values should be correct.'
        );

        chart.series[0].addPoint([1555335000000, 49.65, 49.96, 49.5, 49.81]);

        testNumberOfPoints(
            'After addPoint: the number of DMI points should be equal to the' +
            ' number of the main series\' points plus period.'
        );

        assert.deepEqual(
            DMIIndicator.yData,
            [
                [43.29738058551631, 31.980742778541977, 12.65474552957356],
                [46.82672001778382, 32.94264339152121, 11.930174563590992],
                [52.409302040847635, 35.885710579230704, 11.20552348417689],
                [56.03125304207054, 37.376793673076655, 10.532574411019665],
                [55.78090210671901, 35.18263120832859, 9.986745438657872],
                [57.18648602944597, 35.66350095611362, 9.713810868813523],
                [62.461775706850055, 38.92198371971246, 8.993267175912646],
                [66.19938172076904, 41.19798697886022, 8.378595740414633],
                [59.11243749708767, 39.118467927361465, 10.052380741307163],
                [59.52546940289456, 37.607393331916676, 9.541683831349514],
                [44.82112220516712, 34.7003040749299, 13.221302313080557],
                [44.82112220516712, 33.39537213695045, 12.724104950983515]
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
            'After setData: the number of DMI points should be equal to the ' +
            'number of the main series\' points plus period.'
        );

        assert.deepEqual(
            DMIIndicator.yData,
            [
                [65.53691789215699, 6.749418735468349, 32.41956048901219],
                [68.7259905205163, 6.291978073515645, 33.94576680306178],
                [72.60441696135364, 5.781786709035126, 36.42784030185114],
                [73.00927420735995, 5.286665253951643, 33.88727393217602],
                [55.06213052226521, 8.69880730521673, 30.01601120448897],
                [39.00543326160389, 12.491034564715859, 28.46682523381189]
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
            '#ff0000',
            'The +DI line color should be green by default.'
        );

        assert.strictEqual(
            DMIIndicator.graphminusDILine.element.getAttribute('stroke'),
            '#00ff00',
            'The -DI line color should be red by default.'
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
            "2",
            'The DX line width should be correct.'
        );

        assert.strictEqual(
            DMIIndicator.graphplusDILine.element.getAttribute('stroke-width'),
            "3",
            'The +DI line width should be correct.'
        );

        assert.strictEqual(
            DMIIndicator.graphminusDILine.element.getAttribute('stroke-width'),
            "4",
            'The -DI line width should be correct.'
        );

        testNumberOfPoints(
            'After period update: the number of DMI points should be equal' +
            'to the number of the main series\' points plus period.'
        );

        assert.deepEqual(
            DMIIndicator.yData,
            [
                [76.08491199785043, 4.113324398021884, 30.2860840227388],
                [79.46299481166608, 3.543787173680393, 30.967448921185536],
                [81.52964891011236, 3.301151548994061, 32.44426046758002],
                [86.17650880931696, 2.899764973183458, 39.0543974476366],
                [86.38566523454249, 2.646993790152364, 36.23839922762998],
                [56.96794146927318, 8.680654131358406, 31.664402218479147],
                [62.94921579780129, 7.760613203017373, 34.13114898298695],
                [69.68377628495614, 6.782842717435719, 37.96443703079929],
                [70.3644026008313, 5.887796348037979, 33.8468259626507],
                [43.927350477024916, 10.919391045928643, 28.027907285157198],
                [21.919669745279812, 16.535109503389414, 25.81898774350285]
            ],
            'After period update: the DMI (DX, +DI, -DI) values should be correct.'
        );

        chart.series[0].points[chart.series[0].points.length - 1].remove();

        testNumberOfPoints(
            'After point remove: the number of DMI points should be equal to' +
            ' the number of the main series\' points plus period.'
        );

        assert.deepEqual(
            chart.series[1].yData,
            [
                [76.08491199785043, 4.113324398021884, 30.2860840227388],
                [79.46299481166608, 3.543787173680393, 30.967448921185536],
                [81.52964891011236, 3.301151548994061, 32.44426046758002],
                [86.17650880931696, 2.899764973183458, 39.0543974476366],
                [86.38566523454249, 2.646993790152364, 36.23839922762998],
                [56.96794146927318, 8.680654131358406, 31.664402218479147],
                [62.94921579780129, 7.760613203017373, 34.13114898298695],
                [69.68377628495614, 6.782842717435719, 37.96443703079929],
                [70.3644026008313, 5.887796348037979, 33.8468259626507],
                [43.927350477024916, 10.919391045928643, 28.027907285157198]
            ],
            'After point remove: the DMI (DX, +DI, -DI) values should be correct.'
        );
    });
