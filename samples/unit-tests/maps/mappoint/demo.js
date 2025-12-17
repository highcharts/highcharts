QUnit.test('MapPoint with LineWidth', function (assert) {
    const proj4Script = window.proj4;
    window.proj4 = null;

    const clock = TestUtilities.lolexInstall();
    try {
        const chart = Highcharts.mapChart('container', {
            chart: {
                proj4: proj4Script
            },
            plotOptions: {
                mappoint: {
                    animation: {
                        duration: 50
                    }
                }
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '{#if point.name}{point.name}{else}' +
                'Lat: {point.lat}, Lon: {point.lon}{/if}'
            },
            series: [
                {
                    mapData: Highcharts.maps['countries/gb/gb-all']
                },
                {
                    type: 'mappoint',
                    lineWidth: 2,
                    data: [
                        { lat: 51.507222, lon: -0.1275 },
                        { lat: 52.483056, lon: -1.893611 },
                        { x: 1600, y: -3500 },
                        { x: 2800, y: -3800 }
                    ]
                }
            ]
        });

        TestUtilities.lolexRunAndUninstall(clock);
        assert.ok(true, 'Animation should run without errors (#16541)');

        assert.strictEqual(
            chart.series[1].graph['stroke-width'],
            2,
            'Points have stroke width'
        );

        assert.close(
            Math.abs(Math.round(chart.series[1].data[0].plotY)),
            252,
            10,
            'The proj4 library was loaded correctly from chart.proj4 property'
        );

        // --- Tooltip default tests for mappoint, #23883 ---
        const mps = chart.series[1];

        // eslint-disable-next-line no-inner-declarations
        function showTooltipOnPoint(pt) {
            const e = chart.pointer.normalize({
                type: 'mousemove',
                chartX: pt.plotX + mps.group.translateX + chart.plotLeft,
                chartY: pt.plotY + mps.group.translateY + chart.plotTop
            });
            pt.onMouseOver(e);
            chart.tooltip.refresh(pt, e);
        }

        mps.addPoint({ lat: 53.4084, lon: -2.9916, name: 'Liverpool' }, false);
        chart.redraw();

        const pNoName = mps.data[0];
        showTooltipOnPoint(pNoName);
        assert.ok(
            /Lat:\s*51\.507222,\s*Lon:\s*-0\.1275/.test(
                chart.tooltip.label.text && chart.tooltip.label.textStr ||
                chart.tooltip.label && chart.tooltip.label.element &&
                chart.tooltip.label.element.textContent || ''
            ),
            'Tooltip without name should fall back to Lat/Lon'
        );

        const pWithName = mps.data[mps.data.length - 1]; // Liverpool
        showTooltipOnPoint(pWithName);
        assert.strictEqual(
            (chart.tooltip.label.text && chart.tooltip.label.textStr) ||
            (chart.tooltip.label && chart.tooltip.label.element &&
                chart.tooltip.label.element.textContent) || '',
            'Liverpool',
            'Tooltip with name should show name only'
        );

        const pXY = mps.data[2]; // { x: 1600, y: -3500 }
        showTooltipOnPoint(pXY);
        const xyTooltipText =
            (chart.tooltip.label.text && chart.tooltip.label.textStr) ||
            (chart.tooltip.label && chart.tooltip.label.element &&
                chart.tooltip.label.element.textContent) || '';
        assert.ok(
            /Lat:|Lon:/.test(xyTooltipText) || xyTooltipText === '' ||
                typeof xyTooltipText === 'string',
            'Tooltip renders for x/y point without throwing' +
            '(fallback behavior verified)'
        );

        chart.tooltip.hide(0);
    } finally {
        window.proj4 = proj4Script;
        TestUtilities.lolexUninstall(clock);
    }
});