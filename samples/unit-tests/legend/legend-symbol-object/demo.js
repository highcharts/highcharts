QUnit.test('legendSymbol string and object forms', function (assert) {
    const chart = Highcharts.chart('container', {
        legend: { symbolHeight: 12 },
        series: [{
            // String form — backward compatibility
            type: 'line',
            data: [1, 2, 3],
            legendSymbol: 'rectangle'
        }, {
            // String form — backward compatibility
            type: 'line',
            data: [2, 3, 4],
            legendSymbol: 'lineMarker'
        }, {
            // Object — explicit radius, not capped
            type: 'line',
            data: [1, 2, 3],
            legendSymbol: {
                symbol: 'lineMarker',
                marker: { radius: 10 }
            }
        }, {
            // Object — no explicit radius, falls back to cap
            type: 'line',
            data: [1, 2, 3],
            marker: { radius: 20 },
            legendSymbol: { symbol: 'lineMarker' }
        }, {
            // Object — marker.fillColor
            type: 'line',
            data: [1, 2, 3],
            legendSymbol: {
                symbol: 'lineMarker',
                marker: { fillColor: '#ff0000' }
            }
        }, {
            // Object — marker.lineColor + marker.lineWidth
            type: 'line',
            data: [1, 2, 3],
            legendSymbol: {
                symbol: 'lineMarker',
                marker: { lineColor: '#00ff00', lineWidth: 3 }
            }
        }, {
            // Object — marker.symbol overrides shape
            type: 'line',
            data: [1, 2, 3],
            marker: { symbol: 'circle' },
            legendSymbol: {
                symbol: 'lineMarker',
                marker: { symbol: 'diamond' }
            }
        }, {
            // Object — marker.enabled forces marker visible
            type: 'scatter',
            data: [[0, 1], [1, 2]],
            marker: { enabled: false },
            legendSymbol: {
                symbol: 'lineMarker',
                marker: { enabled: true, radius: 5 }
            }
        }, {
            // Object — legendSymbol.color overrides series color
            type: 'line',
            color: '#ff0000',
            data: [1, 2, 3],
            legendSymbol: {
                symbol: 'lineMarker',
                color: '#0000ff'
            }
        }, {
            // Object — legendSymbol.lineWidth overrides series lineWidth
            type: 'line',
            lineWidth: 6,
            data: [1, 2, 3],
            legendSymbol: {
                symbol: 'lineMarker',
                lineWidth: 1
            }
        }]
    });

    const s = chart.series;

    assert.strictEqual(
        s[0].legendItem.symbol.element.nodeName,
        'rect',
        'String "rectangle": renders a <rect> element'
    );
    assert.strictEqual(
        s[1].legendItem.symbol.element.nodeName,
        'path',
        'String "lineMarker": renders a <path> marker element'
    );
    assert.ok(
        s[1].legendItem.symbol.isMarker,
        'String "lineMarker": symbol has isMarker flag'
    );
    assert.ok(
        s[2].legendItem.symbol.getBBox().height > chart.legend.symbolHeight,
        'Explicit marker.radius exceeds symbolHeight cap'
    );
    assert.ok(
        Math.round(s[3].legendItem.symbol.getBBox().height) <=
            Math.round(chart.legend.symbolHeight),
        'Series marker.radius is capped to symbolHeight when not explicit'
    );
    assert.strictEqual(
        s[4].legendItem.symbol.attr('fill'),
        '#ff0000',
        'marker.fillColor applied as fill'
    );
    assert.strictEqual(
        s[5].legendItem.symbol.attr('stroke'),
        '#00ff00',
        'marker.lineColor applied as stroke'
    );
    assert.strictEqual(
        s[5].legendItem.symbol.attr('stroke-width'),
        3,
        'marker.lineWidth applied as stroke-width'
    );
    assert.strictEqual(
        s[6].symbol,
        'circle',
        'Series marker symbol unchanged by legendSymbol.marker.symbol'
    );
    assert.ok(
        s[7].legendItem.symbol,
        'marker.enabled:true forces legend marker visible'
    );
    assert.strictEqual(
        s[8].legendItem.line.attr('stroke'),
        '#0000ff',
        'legendSymbol.color overrides series color in legend'
    );
    assert.strictEqual(
        s[9].legendItem.line.attr('stroke-width'),
        1,
        'legendSymbol.lineWidth overrides series lineWidth in legend'
    );
});

QUnit.test('legendSymbol events', function (assert) {
    let drawFired = false;
    let drawEventLegend, drawEventItem;
    let destroyFired = false;
    let destroyLegendItem;

    const chart = Highcharts.chart('container', {
        series: [{
            type: 'line',
            data: [1, 2, 3],
            events: {
                drawLegendSymbol: function (e) {
                    drawFired = true;
                    drawEventLegend = e.legend;
                    drawEventItem = e.item;

                    // Add a custom element to verify destroyLegendSymbol
                    const legendItem = this.legendItem || {};
                    legendItem.customEl = this.chart.renderer
                        .rect(0, 0, 4, 4)
                        .add(legendItem.group);
                },
                destroyLegendSymbol: function (e) {
                    destroyFired = true;
                    destroyLegendItem = e.legendItem;
                    if (e.legendItem.customEl) {
                        e.legendItem.customEl =
                            e.legendItem.customEl.destroy();
                    }
                }
            }
        }]
    });

    assert.ok(drawFired, 'drawLegendSymbol event fired');
    assert.strictEqual(
        drawEventLegend,
        chart.legend,
        'drawLegendSymbol event carries legend instance'
    );
    assert.strictEqual(
        drawEventItem,
        chart.series[0],
        'drawLegendSymbol event carries series as item'
    );
    assert.ok(
        chart.series[0].legendItem.symbol,
        'Default symbol is still drawn after drawLegendSymbol event'
    );
    assert.ok(
        chart.series[0].legendItem.customEl,
        'Custom SVG element added via drawLegendSymbol event'
    );

    chart.series[0].update({ name: 'Updated' });

    assert.ok(destroyFired, 'destroyLegendSymbol event fired on series update');
    assert.strictEqual(
        typeof destroyLegendItem,
        'object',
        'destroyLegendSymbol event carries legendItem object'
    );
    assert.strictEqual(
        destroyLegendItem.customEl,
        void 0,
        'Custom element cleaned up in destroyLegendSymbol handler'
    );
});
