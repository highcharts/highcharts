QUnit.test(
    'Financial series legend symbols (#24567)',
    function (assert) {
        const chart = Highcharts.stockChart('container', {
            legend: {
                enabled: true
            },
            navigator: {
                enabled: false
            },
            series: [{
                type: 'hlc',
                data: [[0, 4, 1, 3]]
            }, {
                type: 'ohlc',
                data: [[0, 2, 4, 1, 3]]
            }, {
                type: 'candlestick',
                data: [[0, 2, 4, 1, 3]]
            }]
        });

        // Icon paths (bars/wicks) are filled with no stroke, so they keep the
        // designed weight; the candlestick's boxes are drawn separately.
        chart.series.forEach(series => {
            const attribs = series.pointAttribs();

            assert.ok(
                attribs.fill && attribs.fill !== 'none',
                series.type + ' legend symbol should be filled'
            );
            assert.notOk(
                attribs.stroke,
                series.type + ' legend symbol should have no stroke'
            );
        });

        const candlestick = chart.series[2],
            boxes = () => Array.from(
                candlestick.legendItem.group.element.querySelectorAll('rect')
            );

        // The candlestick draws its two box bodies as separate bordered rects.
        assert.strictEqual(
            boxes().filter(rect => rect.getAttribute('stroke')).length,
            2,
            'Candlestick legend should draw two bordered box bodies'
        );

        // The hollow (up) body takes the `upColor`.
        candlestick.update({ upColor: '#ff0000' });
        assert.ok(
            boxes().some(rect => rect.getAttribute('fill') === '#ff0000'),
            'Candlestick hollow body should be filled with upColor'
        );

        // `legendSymbolColor` recolors the filled (series-color) body (#24567).
        candlestick.update({ legendSymbolColor: '#00ff00' });
        assert.strictEqual(
            boxes().find(
                rect => !rect.classList.contains('highcharts-point-up')
            ).getAttribute('fill'),
            '#00ff00',
            'Candlestick filled body should honor legendSymbolColor'
        );
        candlestick.update({ legendSymbolColor: void 0 });

        // Hiding the series dims the boxes along with the wicks.
        const filledBox = boxes().find(
                rect => !rect.classList.contains('highcharts-point-up')
            ),
            visibleFill = filledBox.getAttribute('fill');

        candlestick.setVisible(false);
        assert.notStrictEqual(
            filledBox.getAttribute('fill'),
            visibleFill,
            'Hidden candlestick legend boxes should be dimmed'
        );
    }
);
