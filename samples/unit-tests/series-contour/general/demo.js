const preTag = document.getElementById('data');
const data = JSON.parse(preTag.textContent?.trim() || preTag.innerText?.trim());

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
    return (i = imgData.length - 4) => [
        imgData[i],
        imgData[i + 1],
        imgData[i + 2],
        imgData[i + 3]
    ].toString();
};

QUnit.test('General contour stuff', function (assert) {
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

    contour.renderPromise.then(function () {
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

    contour.renderPromise.then(function () {
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

    contour.renderPromise.then(function () {
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
