/**
 * Highcharts plugin for creating individual arrow-head like inverted bars.
 */
declare namespace Highcharts {
    interface Point {
        dlBox?: Highcharts.SVGAttributes;
        shapeType?: string;
        stackY?: number;
    }
}
(({ addEvent, Series }) => {
    addEvent(
        Series.types.column,
        'afterColumnTranslate',
        function () {
            const options = this.options,
                topMargin: number = options.custom.topMargin || 0,
                bottomMargin: number = options.custom.bottomMargin || 0,
                idx = this.index;

            if (options.custom.headSize) {

                this.points.forEach(point => {
                    const shapeArgs = point.shapeArgs,
                        w = shapeArgs.width,
                        h = shapeArgs.height,
                        x = shapeArgs.x,
                        y = shapeArgs.y,
                        cutLeft = idx !== 0,
                        cutRight = point.stackY !== point.y || !cutLeft;

                    let len = options.custom.headSize; // in pixels

                    if (point.y < 0) {
                        len *= -1;
                    }

                    // Preserve the box for data labels
                    point.dlBox = point.shapeArgs;

                    point.shapeType = 'path';
                    point.shapeArgs = {
                        d: [
                            ['M', x, y + topMargin],
                            [
                                'L',
                                x + w / 2,
                                y + topMargin + (cutRight ? len : 0)
                            ], // arrow
                            // top side
                            ['L', x + w, y + topMargin],
                            // right side
                            ['L', x + w, y + h],
                            // bottom side
                            [
                                'L',
                                x + w / 2,
                                y + h + bottomMargin + (cutLeft ? len : 0)
                            ],
                            ['L', x, y + h + bottomMargin],
                            // left side
                            ['L', x, y],
                            // close
                            ['Z']
                        ]
                    };

                });
            }
        }
    );
})(Highcharts);

Highcharts.chart('container', {
    chart: {
        type: 'bar',
        height: 170
    },
    title: {
        text: 'Mars EDL forces comparison'
    },
    plotOptions: {
        bar: {
            custom: {
                headSize: 6
            },
            stacking: 'normal',
            dataLabels: {
                enabled: true,
                y: 20,
                verticalAlign: 'bottom',
                color: 'var(--highcharts-neutral-color-100, black)'
            },
            color: 'rgb(255, 7, 77)',
            negativeColor: 'rgb(1, 127, 250)',
            accessibility: {
                exposeAsGroupOnly: true
            }
        }
    },
    tooltip: {
        format: '<span style="color:{point.color}">\u25CF</span> ' +
            '<b>{series.name}: {point.y}</b>'
    },
    accessibility: {
        typeDescription: 'Stacked bar "force" chart. Positive forces ' +
            'are shown on the right side and negative on the left.',
        series: {
            descriptionFormat: 'Series {add series.index 1} of ' +
            '{chart.series.length}, Name: {series.name}, ' +
            '{#if (gt series.points.0.y 0)}accelerating' +
            '{else}decelerating{/if} value of {series.points.0.y}.'
        }
    },
    yAxis: {
        reversedStacks: false,
        opposite: true,
        labels: {
            enabled: false
        },
        title: null,
        accessibility: {
            description: ''
        },
        stackLabels: {
            enabled: true,
            verticalAlign: 'top',
            style: {
                fontSize: '1.2em'
            },
            format: '{#if (lt total 0)}Min{else}Max{/if}: {total}'
        },
        startOnTick: false,
        endOnTick: false
    },
    xAxis: {
        visible: false,
        title: null,
        accessibility: {
            description: ''
        }
    },
    legend: {
        enabled: false
    },
    /*
    NOTE: These data values are arbitrary, illustrative and does not reflect
    the strength of actual forces in a Mars EDL sequence. They aim to broadly
    demonstrate the key dynamics affecting the spacecraft during EDL.
    */
    series: [
        // Unwanted/additive forces
        { name: 'Initial Entry Speed', data: [15] },
        { name: 'Martian Gravity', data: [3] },

        // Slowing forces
        { name: 'Atmospheric Drag (Re-entry)', data: [-9] },
        { name: 'Parachute Drag', data: [-7] },
        { name: 'Heat Shield Separation', data: [-0.5] },
        { name: 'Retro Rockets (Powered decent)', data: [-1.5] },
        { name: 'Sky Crane Operation', data: [-1] }
    ]
} satisfies Highcharts.Options);
