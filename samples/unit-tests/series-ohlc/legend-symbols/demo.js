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
            }, {
                type: 'hollowcandlestick',
                // The first point is an up one, the legend must not follow it
                data: [[0, 2, 4, 1, 3], [1, 3, 5, 2, 4]]
            }]
        });

        const [hlc, ohlc, candlestick, hollow] = chart.series,
            // The down glyph is the legend symbol, the up one its own element
            down = series => series.legendItem.symbol.element,
            up = series => series.legendSymbolUp.element,
            paint = element => [
                element.getAttribute('fill'),
                element.getAttribute('stroke'),
                element.getAttribute('stroke-width')
            ],
            // The legend derives the up colors, so assert they match a point
            pointPaint = series => {
                const attribs = series.pointAttribs(series.points[0]);

                return [
                    attribs.fill,
                    attribs.stroke,
                    String(attribs['stroke-width'])
                ];
            };

        assert.deepEqual(
            Array.from(
                candlestick.legendItem.group.element
                    .querySelectorAll('.highcharts-point')
            ).map(element => element.getAttribute('class')),
            [
                'highcharts-point highcharts-point-down',
                'highcharts-point highcharts-point-up'
            ],
            'The legend should hold two candles, classed like the points ' +
            'they stand for so that styled mode can tell them apart'
        );

        assert.strictEqual(
            down(hlc).getAttribute('stroke'),
            hlc.color,
            'HLC legend symbol should be stroked with the series color'
        );
        assert.notOk(
            hlc.legendSymbolUp,
            'HLC has no open value, so both its stems belong to the one symbol'
        );

        ohlc.update({ lineWidth: 3, upColor: '#ff0000' });
        assert.strictEqual(
            down(ohlc).getAttribute('stroke-width'),
            '3',
            'OHLC legend symbol should respect lineWidth'
        );
        assert.strictEqual(
            up(ohlc).getAttribute('stroke'),
            '#ff0000',
            'OHLC up stem should be stroked with upColor'
        );

        candlestick.update({
            lineColor: 'red',
            upColor: '#00e272',
            upLineColor: '#00e272'
        });
        assert.strictEqual(
            down(candlestick).getAttribute('fill'),
            candlestick.color,
            'Down candle should be filled with the series color'
        );
        assert.strictEqual(
            down(candlestick).getAttribute('stroke'),
            'red',
            'Down candle should be stroked with lineColor'
        );
        assert.strictEqual(
            up(candlestick).getAttribute('fill'),
            '#00e272',
            'Up candle should be filled with upColor'
        );
        assert.strictEqual(
            up(candlestick).getAttribute('stroke'),
            '#00e272',
            'Up candle, wick included, should be stroked with upLineColor'
        );
        assert.deepEqual(
            paint(up(candlestick)),
            pointPaint(candlestick),
            'Up candle should be painted like an up point'
        );

        // Hollow candlesticks color by trend, which upColor cannot express
        assert.strictEqual(
            up(hollow).getAttribute('fill'),
            'transparent',
            'Hollow candlestick up candle should be hollow'
        );
        assert.deepEqual(
            paint(up(hollow)),
            pointPaint(hollow),
            'Hollow candlestick up candle should be painted like an up point'
        );
        assert.strictEqual(
            down(hollow).getAttribute('fill'),
            hollow.options.color,
            'Hollow candlestick down candle should take the falling color'
        );

        candlestick.update({ legendSymbolColor: '#0000ff' });
        assert.strictEqual(
            down(candlestick).getAttribute('fill'),
            '#0000ff',
            'Down candle should honor legendSymbolColor'
        );

        candlestick.setVisible(false);
        assert.strictEqual(
            up(candlestick).getAttribute('fill'),
            chart.legend.itemHiddenStyle.color,
            'Hiding the series should dim the up candle too'
        );
    }
);
