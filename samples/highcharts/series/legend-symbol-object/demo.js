Highcharts.chart('container', {

    title: {
        text: 'Legend symbol'
    },

    subtitle: {
        text: 'Demonstrating <code>legendSymbol</code> as an object',
        useHTML: true
    },

    legend: {
        symbolHeight: 12,
        symbolWidth: 40
    },

    series: [{
        type: 'scatter',
        name: 'Scatter (marker.radius override)',
        legendSymbol: {
            symbol: 'lineMarker',
            marker: {
                symbol: 'circle',
                radius: 10
            }
        },
        marker: {
            symbol: 'circle',
            radius: 5
        },
        data: [
            [0, 14], [1, 11], [2, 16], [3, 13], [4, 18],
            [5, 12], [6, 17], [7, 15], [8, 19], [9, 14]
        ]
    }, {
        type: 'line',
        name: 'Line (hollow markers, thick line)',
        lineWidth: 4,
        color: '#E8562A',
        marker: {
            symbol: 'circle',
            fillColor: 'white',
            lineColor: '#E8562A',
            lineWidth: 2
        },
        legendSymbol: {
            symbol: 'lineMarker',
            lineWidth: 1,
            marker: {
                fillColor: 'white',
                lineColor: '#E8562A',
                lineWidth: 2,
                radius: 8
            }
        },
        data: [3, 5, 4, 7, 6, 8, 5, 9, 7, 10]
    }, {
        type: 'area',
        name: 'Area (marker with custom elements)',
        legendSymbol: {
            symbol: 'areaMarker',
            marker: {
                radius: 8
            }
        },
        data: [1, 3, 2, 4, 3, 5, 4, 6, 5, 7],
        events: {
            drawLegendSymbol: function () {
                console.log(this);
                const legendItem = this.legendItem || {};
                const group = legendItem.group;
                const renderer = this.chart.renderer;
                const data = this.options.data || [];
                const first = Number(data[0]) || 0;
                const last = Number(data[data.length - 1]) || 0;
                const pct = first !== 0 ?
                    Math.round((last - first) / first * 100) : 0;
                const label = (pct >= 0 ? '+' : '') + pct + '%';
                const badgeColor = pct > 0 ?
                    '#27ae60' : pct < 0 ? '#e74c3c' : '#888';

                // Badge showing percentage change from first to last value.
                legendItem.customBadge = renderer
                    .label(label, 0, 0)
                    .attr({ zIndex: 5 })
                    .css({ color: badgeColor, fontSize: '9px' })
                    .add(group);

                const symbolBBox = legendItem.symbol?.getBBox() || {};
                legendItem.customBadge.attr({
                    x: (symbolBBox.x || 0) + (symbolBBox.width || 0),
                    y: (symbolBBox.y || 0) - 10
                });
            },

            destroyLegendSymbol: function () {
                const legendItem = this.legendItem || {};
                if (legendItem.customBadge) {
                    legendItem.customBadge =
                        legendItem.customBadge.destroy();
                }
            }
        }
    }]
});
