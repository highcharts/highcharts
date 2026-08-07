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

        const [hlc, ohlc, candlestick] = chart.series;

        // Legend symbol paths are stroked like chart points, so colors and
        // line width flow from the series options
        assert.strictEqual(
            hlc.legendItem.symbol.element.getAttribute('stroke'),
            hlc.color,
            'HLC legend symbol should be stroked with the series color'
        );

        ohlc.update({ lineWidth: 3 });
        assert.strictEqual(
            ohlc.legendItem.symbol.element.getAttribute('stroke-width'),
            '3',
            'OHLC legend symbol should respect lineWidth'
        );

        assert.strictEqual(
            candlestick.legendItem.symbol.element.getAttribute('stroke'),
            candlestick.options.lineColor,
            'Candlestick legend wicks should be stroked with lineColor'
        );

        // The candlestick draws its two candle bodies as separate rects, the
        // filled (down) one first
        const boxes = () => candlestick.legendItem.group.element
            .querySelectorAll('rect');

        assert.strictEqual(
            boxes().length,
            2,
            'Candlestick legend should draw two candle bodies'
        );

        // The bodies follow the point coloring options
        candlestick.update({
            upColor: '#ff0000',
            upLineColor: '#0000ff'
        });
        assert.strictEqual(
            boxes()[1].getAttribute('fill'),
            '#ff0000',
            'Hollow (up) body should be filled with upColor'
        );
        assert.strictEqual(
            boxes()[1].getAttribute('stroke'),
            '#0000ff',
            'Hollow (up) body should be stroked with upLineColor'
        );
        assert.strictEqual(
            boxes()[0].getAttribute('fill'),
            candlestick.color,
            'Filled (down) body should default to the series color'
        );

        // `legendSymbolColor` recolors the series-colored body
        candlestick.update({ legendSymbolColor: '#00ff00' });
        assert.strictEqual(
            boxes()[0].getAttribute('fill'),
            '#00ff00',
            'Candlestick filled body should honor legendSymbolColor'
        );

        // Hiding the series dims the bodies along with the wicks
        candlestick.setVisible(false);
        assert.strictEqual(
            boxes()[0].getAttribute('fill'),
            chart.legend.itemHiddenStyle.color,
            'Hidden candlestick legend bodies should use itemHiddenStyle'
        );
    }
);
