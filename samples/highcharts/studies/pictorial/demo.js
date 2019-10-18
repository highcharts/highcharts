/**
 * Experimental pictorial series type
 *
 * To do
 * - One path per category or perhaps simpler, per point
 * - Stroke width must be translated in to the objectBoundingBox content units
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

            const scaleY = point.series.yAxis.len / point.shapeArgs.height;

            pointAttribs.fill = {
                pattern: {
                    path: {
                        d: point.series.options.path,
                        fill: pointAttribs.fill,
                        strokeWidth: 0,
                        stroke: pointAttribs.stroke,
                        transform: `scale(1, ${scaleY})`
                    },
                    x: point.shapeArgs.x,
                    y: 0,
                    width: point.shapeArgs.width,
                    height: point.series.yAxis.len,
                    patternContentUnits: 'objectBoundingBox',
                    backgroundColor: 'none'
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
/*
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
*/

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
    subtitle: {
        text: 'Male symbols in sidewind due to a bug in our experimental path parser'
    },
    xAxis: {
        categories: ['Men', 'Women'],
        lineWidth: 0
    },
    yAxis: {
        visible: false
    },
    plotOptions: {
        pictorial: {
            stacking: 'percent',

            /*
            Icon paths from font-awesome, https://fontawesome.com/license,
            translated using http://jsfiddle.net/highcharts/a0jrvxch/
            */
            path: 'M0.57143,0C0.72922,0,0.85714,0.05596,0.85714,0.125L0.57143,0.25,0.28571,0.19404,0,0.06904L0.57143,0M0.78571,0.28125L0.735,0.28125C0.63361,0.30165,0.51362,0.30253,0.40786,0.28125L0.35714,0.28125C0.23879,0.28125,0.14286,0.32322,0.14286,0.375L0.14286,0.64063C0.14286,0.66651,0.19083,0.6875,0.25,0.6875L0.32143,0.6875L0.32143,0.95313C0.32143,0.97901,0.3694,1,0.42857,1L0.71429,1C0.77346,1,0.82143,0.97901,0.82143,0.95313L0.82143,0.6875L0.89286,0.6875C0.95203,0.6875,1,0.66651,1,0.64063L1,0.375C1,0.32322,0.90406,0.28125,0.78571,0.28125z'
        }
    },
    legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical'
    },
    series: [{
        data: [10, 20],
        name: 'Quality A'
    }, {
        data: [20, 50],
        name: 'Quality B'
    }, {
        data: [70, 30],
        name: 'Quality C'
    }]
});
