/**
 * Experimental pictorial series type
 *
 * To do
 * - Make the patterns stretch to the rect or the stack box. Check out
 *   patternContentUnits: 'objectBoundingBox'. For stack box math,
 *   see ColumnPyramidSeries.ts.
 * - One path per category or perhaps simpler, per point
 * - Fix the path.fill bug, if agreed it's a bug (should also fix hover states)
 */

Highcharts.seriesType(
    'pictorial',
    'column',
    {
        borderWidth: 0
    },
    {
        pointAttribs: function (point, selected) {
            const pointAttribs = Highcharts.seriesTypes.column.prototype
                .pointAttribs.call(this, point, selected);

            pointAttribs.fill = {
                pattern: {
                    path: {
                        d: point.series.options.pictorialPath,
                        fill: pointAttribs.fill,
                        strokeWidth: pointAttribs.strokeWidth,
                        stroke: pointAttribs.stroke
                    },
                    x: point.shapeArgs.x,
                    y: 0,
                    width: point.shapeArgs.width,
                    height: point.series.yAxis.len,
                    color: 'none'
                }
            };

            delete pointAttribs.stroke;
            delete pointAttribs.strokeWidth;

            return pointAttribs;
        }
    }
);

// Workaround for something that looks like a bug: The `pattern.path.fill`
// option is not applied to the path, but rather the rect. And there is no way
// to set the fill of the <path> itself.
Highcharts.addEvent(Highcharts.Chart, 'render', e => {
    Object.keys(e.target.renderer.patternElements).forEach(id => {
        const pattern = e.target.renderer.patternElements[id];
        const path = pattern.element.querySelector('path');
        const rect = pattern.element.querySelector('rect');

        if (rect) {
            path.setAttribute('fill', rect.getAttribute('fill'));
            rect.setAttribute('fill', 'none');
        }
    });
});

Highcharts.chart('container', {
    chart: {
        scrollablePlotArea: {
            minWidth: 460
        },
        type: 'pictorial'
    },
    title: {
        text: 'Pictorial chart'
    },
    xAxis: {
        type: 'category',
        labels: {
            style: {
                fontSize: '18px'
            }
        }
    },
    plotOptions: {
        pictorial: {
            stacking: 'percent',
            pictorialPath: 'm 50 0 l 50 150 l -50 150 l -50 -150 z'
        }
    },
    series: [{
        data: [10, 20, 70, 30]
    }, {
        data: [90, 80, 30, 70]
    }]
});
