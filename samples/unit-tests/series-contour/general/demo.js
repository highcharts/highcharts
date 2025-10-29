const data = [
    [
        0,
        0,
        0.140726950019598
    ],
    [
        0,
        1,
        0.40378292836248875
    ],
    [
        0,
        2,
        1.4396357107907534
    ],
    [
        0,
        3,
        3.07622979208827
    ],
    [
        1,
        0,
        0.6653608484193683
    ],
    [
        1,
        1,
        1.5778379840776324
    ],
    [
        1,
        2,
        3.062559375539422
    ],
    [
        1,
        3,
        1.1082659168168902
    ],
    [
        2,
        0,
        2.272705583833158
    ],
    [
        2,
        1,
        2.054922603070736
    ],
    [
        2,
        2,
        1.0537998769432306
    ],
    [
        2,
        3,
        0.36005113646388054
    ],
    [
        3,
        0,
        1.1910509625449777
    ],
    [
        3,
        1,
        2.792851034551859
    ],
    [
        3,
        2,
        3.8372049434110522
    ],
    [
        3,
        3,
        3.3824260281398892
    ]
];

const getColorFunc = contourCanvas => {
    const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        w = canvas.width = contourCanvas.width,
        h = canvas.height = contourCanvas.height;

    ctx.drawImage(contourCanvas, 0, 0);
    const imgData = ctx.getImageData(
        0,
        0,
        w,
        h
    ).data;
    return (
        i = imgData.length - 4 // Last pixel is default
    ) => [
        imgData[i],
        imgData[i + 1],
        imgData[i + 2],
        imgData[i + 3]
    ].toString();
};

QUnit.test('General contour stuff', function (assert) {
    const runFunc = Highcharts.Series.types.contour.prototype.run;

    Highcharts.Series.types.contour.prototype.run = function (
    ) {
        const series = this;
        this.runPromise = runFunc.apply(series, []);
    };

    const chart = Highcharts.chart('container', {
            series: [{
                type: 'contour',
                showContourLines: true,
                lineColor: '#FF0000',
                lineWidth: 2,
                contourInterval: 2,
                data
            }]
        }),
        done = assert.async(),
        contour = chart.series[0],
        p = contour.points[5],
        tc = new TestController(chart);

    tc.moveTo(p.plotX + chart.plotLeft, p.plotY + chart.plotTop);

    assert.strictEqual(
        chart.tooltip.label.text.textStr,
        // eslint-disable-next-line max-len
        '<span style="color: rgba(134.11622864659876,134.11622864659876,134.11622864659876, 1);">################</span>',
        'Tooltip should be colored correctly.'
    );

    contour.runPromise.then(function () {
        const getColor = getColorFunc(contour.canvas);

        // Check the first non-transparent pixel
        assert.strictEqual(
            getColor(0),
            [197, 197, 197, 255].toString(),
            'First pixel in contour plot should be gray.'
        );

        // Check a pixel that should be part of a contour line
        assert.strictEqual(
            getColor(416),
            [255, 0, 0, 255].toString(),
            'Contour lines should be rendered in correct color.'
        );

        done();
    });
});


QUnit.test('Inverted', function (assert) {
    const chart = Highcharts.chart('container', {
            chart: {
                inverted: true
            },
            series: [{
                type: 'contour',
                showContourLines: true,
                lineColor: '#FF0000',
                lineWidth: 2,
                contourInterval: 2,
                data
            }]
        }),
        done = assert.async(),
        contour = chart.series[0];

    assert.notStrictEqual(
        contour.context ?? void 0,
        void 0,
        'WebGPU should be initialized in inverted contour plot.'
    );

    contour.runPromise.then(function () {
        const getColor = getColorFunc(contour.canvas);

        // Check the first non-transparent pixel
        assert.strictEqual(
            getColor(0),
            [59, 59, 59, 255].toString(),
            'First pixel in inverted contour plot should be dark gray.'
        );

        assert.strictEqual(
            getColor(),
            [197, 197, 197, 255].toString(),
            'Last pixel in inverted contour plot should be light gray.'
        );

        done();
    });
});

QUnit.test('X Axis Reversed', function (assert) {
    const chart = Highcharts.chart('container', {
            xAxis: {
                reversed: true
            },
            series: [{
                type: 'contour',
                showContourLines: true,
                lineColor: '#FF0000',
                lineWidth: 2,
                contourInterval: 2,
                data
            }]
        }),
        done = assert.async(),
        contour = chart.series[0];

    assert.notStrictEqual(
        contour.context ?? void 0,
        void 0,
        'WebGPU should be initialized in reverted contour plot.'
    );

    contour.runPromise.then(function () {
        const getColor = getColorFunc(contour.canvas);

        // Check the first non-transparent pixel
        assert.strictEqual(
            getColor(0),
            [197, 197, 197, 255].toString(),
            'First pixel in reversed contour plot should be light gray.'
        );

        assert.strictEqual(
            getColor(),
            [59, 59, 59, 255].toString(),
            'Last pixel in reversed contour plot should be dark gray.'
        );

        done();
    });
});
