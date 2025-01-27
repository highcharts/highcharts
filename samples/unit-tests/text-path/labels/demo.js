QUnit.test('Testing textPath labels\' polygons', function (assert) {
    const ren = new Highcharts.Renderer(
            document.getElementById('container'),
            600,
            400
        ),
        makeTextPathPolygon = (pathArr, textStr) => (ren
            .text(textStr)
            .add()
            .setTextPath(
                ren.path(pathArr),
                { enabled: true }
            )
            .getBBox()
            .polygon
        ),
        straightPath = ['M', 100, 100, 'L', 200, 100],
        curvedPath = [
            ['M', 120, 100, 'C', 440, 200, 100, 420, 220, 170],
            ['L', 500, 200]
        ],
        testPolygon = (path, textContent, polygonName) => {
            const polygon = makeTextPathPolygon(path, textContent);

            assert.strictEqual(
                polygon !== undefined,
                true,
                'There should be a ' + polygonName + ' polygon'
            );

            assert.deepEqual(
                polygon,
                makeTextPathPolygon(
                    path,
                    '<span>' + textContent + '</span>'
                ),
                'Wrapping text in spans should not impact ' +
                polygonName + ' polygons'
            );

            assert.deepEqual(
                polygon,
                makeTextPathPolygon(
                    path,
                    textContent.replace(
                        'textpath',
                        '<span style="color: red;">textpath</span>'
                    )
                ),
                'Nested spans should not impact ' +
                polygonName + ' polygons'
            );

            assert.deepEqual(
                polygon,
                makeTextPathPolygon(
                    path,
                    '<span>' +
                    textContent.replace(
                        'textpath',
                        '<span style="color: red;">textpath</span>'
                    ) +
                    '</span>'
                ),
                'Wrapped and nested spans should not impact ' +
                polygonName + ' polygons'
            );
        };
    testPolygon(straightPath, 'testing textpath', 'non-curved non-linebreaked');
    testPolygon(straightPath, 'testing<br>textpath', 'non-curved linebreaked');
    testPolygon(curvedPath, 'testing textpath', 'curved non-linebreaked');
    testPolygon(curvedPath, 'testing<br>textpath', 'curved non-linebreaked');
});

QUnit.test('Hiding overlapping textPath labels', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 150
        },
        series: [{
            type: 'treegraph',
            keys: ['parent', 'id'],
            data: [
                [undefined, 'Proto Indo-European'],
                ['Proto Indo-European', 'Indo-Iranian'],
                ['Proto Indo-European', 'Indo-Iranian'],
                ['Proto Indo-European', 'Indo-Iranian'],
                ['Proto Indo-European', 'Indo-Iranian'],
                ['Proto Indo-European', 'Indo-Iranian'],
                ['Proto Indo-European', 'Indo-Iranian'],
                ['Proto Indo-European', 'Indo-Iranian'],
                ['Proto Indo-European', 'Indo-Iranian'],
                ['Proto Indo-European', 'Indo-Iranian']
            ],
            dataLabels: {
                enabled: true,
                allowOverlap: false,
                linkFormat: 'TEST LINK LABEL'
            }
        }]
    });

    let visible = 0,
        hidden = 0;

    for (const link of chart.series[0].links) {
        const visibility = link.dataLabels[0].text.visibility;
        if (visibility === 'hidden') {
            hidden++;
        } else if (!visibility) {
            visible++;
        }
    }

    assert.equal(
        visible,
        2,
        '2 labels should be visible'
    );

    assert.equal(
        hidden,
        7,
        '7 labels should be hidden'
    );
});