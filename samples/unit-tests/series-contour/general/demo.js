QUnit.test('General contour stuff', function (assert) {
    const chart = Highcharts.chart('container', {
            series: [{
                type: 'contour',
                data: [
                    [
                        0,
                        0,
                        0.25
                    ],
                    [
                        0,
                        1,
                        0.25
                    ],
                    [
                        0,
                        2,
                        0.25
                    ],
                    [
                        0,
                        3,
                        0.25
                    ],
                    [
                        1,
                        0,
                        0.25
                    ],
                    [
                        1,
                        1,
                        0.25
                    ],
                    [
                        1,
                        2,
                        0.25
                    ],
                    [
                        1,
                        3,
                        0.25
                    ],
                    [
                        2,
                        0,
                        0.5
                    ],
                    [
                        2,
                        1,
                        0.5
                    ],
                    [
                        2,
                        2,
                        0.5
                    ],
                    [
                        2,
                        3,
                        0.5
                    ],
                    [
                        3,
                        0,
                        0.75
                    ],
                    [
                        3,
                        1,
                        0.75
                    ],
                    [
                        3,
                        2,
                        0.75
                    ],
                    [
                        3,
                        3,
                        0.75
                    ]
                ]
            }]
        }),
        done = assert.async(),
        contour = chart.series[0];

    contour.renderPromise.then(() => {
        for (const bufferName of [
            'extremesUniformBuffer',
            'valueExtremesUniformBuffer',
            'contourIntervalUniformBuffer',
            'contourOffsetUniformBuffer',
            'smoothColoringUniformBuffer',
            'showContourLinesUniformBuffer',
            'contourLineColorBuffer',
            'colorAxisStopsUniformBuffer',
            'colorAxisStopsCountUniformBuffer',
            'isInvertedUniformBuffer'
        ]) {
            assert.strictEqual(
                (contour[bufferName] && true) || false,
                true,
                `The buffer '${bufferName}' should exist`
            );
        }
        done();
    });
});
