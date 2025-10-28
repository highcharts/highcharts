QUnit.test('General contour stuff', function (assert) {
    const origRun = Highcharts.Series.types.contour.prototype.run;

    Highcharts.Series.types.contour.prototype.run = function () {
        const res = origRun.apply(this, Array.prototype.slice.call(arguments));
        Highcharts.Series.types.contour.prototype.renderPromise = res;
        return res;
    };

    const chart = Highcharts.chart('container', {
            series: [{
                type: 'contour',
                showContourLines: true,
                lineColor: '#FF0000',
                lineWidth: 2,
                contourInterval: 2,
                data: [
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
                ]
            }]
        }),
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
        const canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');

        canvas.width = contour.canvas.width;
        canvas.height = contour.canvas.height;
        ctx.drawImage(contour.canvas, 0, 0);

        const imgData = ctx.getImageData(
                p.plotX,
                p.plotY,
                canvas.width,
                canvas.height
            ).data,
            validColor = (i, res) => (
                imgData[i] === res[0] &&
                imgData[i + 1] === res[1] &&
                imgData[i + 2] === res[2] &&
                imgData[i + 3] === res[3]
            );

        // Uncomment to find color values in the image data
        /* Const len = imgData.length;
        for (let i = 0; i < len; i += 4) {
            const r = imgData[i];
            const g = imgData[i + 1];
            const b = imgData[i + 2];
            const a = imgData[i + 3];

            if (r === 255 && g === 0 && b === 0 && a === 255) {
                console.log(i);
                break;
            }
        } */

        assert.strictEqual(
            validColor(376, [255, 0, 0, 255]),
            true,
            'Contour lines should be rendered in correct color.'
        );
    });
});
