/*
The purpose of this demo is to demonstrate how multiple charts on the same page
can be linked through DOM and Highcharts events and API methods. It takes a
standard Highcharts config with a small variation for each data set, and a
mouse/touch event handler to bind the charts together.
*/

declare namespace Highcharts {
    interface Point {
        highlight(event: MouseEvent|PointerEvent|TouchEvent): void;
    }
}

/**
 * In order to synchronize tooltips and crosshairs, override the
 * built-in events with handlers defined on the parent element.
 */
['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
    document.getElementById('container').addEventListener(
        eventType,
        function (e: MouseEvent|PointerEvent|TouchEvent) {
            let chart,
                i,
                event: Highcharts.PointerEventObject;

            for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                chart = Highcharts.charts[i];
                // Find coordinates within the chart
                event = chart.pointer.normalize(e);
                // Highlight the hovered point
                chart.series[0].searchPoint(event, true)?.highlight(e);
            }
        }
    );
});

/**
 * Override the reset function, we don't need to hide the tooltips and
 * crosshairs.
 */
Highcharts.Pointer.prototype.reset = function () {
    return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function (
    event: MouseEvent|PointerEvent|TouchEvent
): void {
    const normalizedEvent = this.series.chart.pointer.normalize(event);
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    // Show the crosshair
    this.series.chart.xAxis[0].drawCrosshair(normalizedEvent, this);
};

/**
 * Synchronize extremes (zooming) through the setExtremes event handler.
 */
function syncExtremes(
    this: Highcharts.Axis,
    e: Highcharts.AxisSetExtremesEventObject
): void {
    const thisChart = this.chart;

    if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.charts.forEach(chart => {
            if (chart !== thisChart) {
                chart.xAxis[0].setExtremes?.( // It is null while updating
                    e.min,
                    e.max,
                    undefined,
                    false,
                    { trigger: 'syncExtremes' }
                );
            }
        });
    }
}

/**
 * Resets chart zoom on selection event.
 */
function resetZoom(e: Highcharts.SelectEventObject): boolean {
    // Prevent feedback loop
    if (e.resetSelection) {
        return true;
    }

    // Zoom out all other charts on selection
    Highcharts.charts.forEach(chart => {
        if (chart !== e.target) {
            chart.zoomOut();
        }
    });
    return true;
}

(async () => {
    // Get the data
    const activity = await fetch(
        'https://www.highcharts.com/samples/data/activity.json'
    ).then(res => res.json());

    // Loop the data sets and create one chart each
    activity.datasets.forEach(function (
        dataset: {
            name: string;
            type: string;
            valueDecimals: number;
            unit: string;
            data: Array<number>|Array<[number, number]>;
        },
        i: number
    ): void {
        // Add X values
        const mappedData = (dataset.data as Array<number>).map(
            (val: number, j: number): [number, number] => [
                activity.xData[j], val
            ]
        );
        dataset.data = mappedData;

        const chartDiv = document.createElement('div');
        chartDiv.className = 'chart';
        document.getElementById('container').appendChild(chartDiv);

        Highcharts.chart(chartDiv, {
            chart: {
                marginLeft: 40, // Keep all charts left aligned
                spacingTop: 20,
                spacingBottom: 20,
                zooming: {
                    type: 'x'
                },
                events: {
                    selection: resetZoom
                }
            },
            title: {
                text: dataset.name,
                align: 'left',
                margin: 0,
                x: 30
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            xAxis: {
                crosshair: true,
                events: {
                    setExtremes: syncExtremes
                },
                labels: {
                    format: '{value} km'
                },
                accessibility: {
                    description: 'Kilometers',
                    rangeDescription: '0km to 6.5km'
                }
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            tooltip: {
                fixed: true,
                position: {
                    align: 'right',
                    relativeTo: 'spacingBox',
                    y: -2
                },
                padding: 0,
                pointFormat: '{point.y}',
                backgroundColor: 'none',
                headerFormat: '',
                shadow: false,
                style: {
                    fontSize: '18px'
                },
                valueDecimals: dataset.valueDecimals
            },
            series: [{
                data: dataset.data,
                name: dataset.name,
                type: dataset.type as any,
                color: `var(--highcharts-color-${i})`,
                fillOpacity: 0.3,
                tooltip: {
                    valueSuffix: ' ' + dataset.unit
                }
            }]
        } satisfies Highcharts.Options);
    });
})();
