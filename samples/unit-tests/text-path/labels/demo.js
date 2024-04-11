QUnit.test('Testing textPath labels\' polygons', function (assert) {
    const ren = new Highcharts.Renderer(
            document.getElementById('container'),
            600,
            400
        ),
        makeTextPathPolygon = (pathArr, textStr) => {
            const label = ren.text(textStr).add();
            label.bBox = label.element.getBBox();
            Highcharts.TextPath.setTextPath(
                label,
                ren.path(pathArr),
                { enabled: true }
            );
            Highcharts.fireEvent(label, 'afterGetBBox');
            return label.bBox.polygon;
        },
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

    assert.equal(
        chart.series[0].links[6].dataLabels[0].text.visibility,
        undefined,
        'TextPath label should be visible'
    );

    assert.equal(
        chart.series[0].links[5].dataLabels[0].text.visibility,
        'hidden',
        'TextPath label should be hidden'
    );
});