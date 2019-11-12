/**
 * Experimental pictorial series type
 *
 * To do
 * - Stroke width must be scaled in to the objectBoundingBox content units
 * - Paths should be relative to the stack box or column height. Currently
 *   simplified to yAxis.len.
 * - Option to toggle fixed aspect ratio. Currently the path scales to width and
 *   height independently. When fixed, the width of the stack or point should
 *   be dictated by the path's aspect ratio.
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
                        d: point.series.options.paths[
                            point.index % point.series.options.paths.length
                        ],
                        fill: pointAttribs.fill,
                        strokeWidth: 0,
                        stroke: pointAttribs.stroke
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

Highcharts.addEvent(Highcharts.Series, 'afterRender', function () {
    if (this instanceof Highcharts.seriesTypes.pictorial) {
        this.points.forEach(point => {
            const fill = point.graphic && point.graphic.attr('fill');
            const match = fill && fill.match(/url\(([^)]+)\)/);
            if (match) {
                const patternPath = document.querySelector(`${match[1]} path`);
                if (patternPath) {
                    const bBox = patternPath.getBBox();
                    const scaleX = 1 / bBox.width;
                    const scaleY = this.yAxis.len /
                        point.shapeArgs.height /
                        bBox.height;

                    patternPath.setAttribute(
                        'transform',
                        `scale(${scaleX} ${scaleY}) ` +
                        `translate(${-bBox.x}, ${-bBox.y})`
                    );
                }
            }

        });
    }
});

Highcharts.chart('container', {
    chart: {
        type: 'pictorial'
    },
    title: {
        text: 'Pictorial chart'
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
            paths: [
                'M96 0c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64S60.654 0 96 0m48 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H48c-26.51 0-48 21.49-48 48v136c0 13.255 10.745 24 24 24h16v136c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24V352h16c13.255 0 24-10.745 24-24V192c0-26.51-21.49-48-48-48z',
                'M128 0c35.346 0 64 28.654 64 64s-28.654 64-64 64c-35.346 0-64-28.654-64-64S92.654 0 128 0m119.283 354.179l-48-192A24 24 0 0 0 176 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H80a24 24 0 0 0-23.283 18.179l-48 192C4.935 369.305 16.383 384 32 384h56v104c0 13.255 10.745 24 24 24h32c13.255 0 24-10.745 24-24V384h56c15.591 0 27.071-14.671 23.283-29.821z'
            ],
            pointPadding: 0
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
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'top'
                }
            }
        }]

    }
});
