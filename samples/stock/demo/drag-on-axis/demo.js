function zoomOnYAxis() {
    function centerZoom(axis, strength) {
        let zoomOffset = (axis.max - axis.min) / 2;
        const center = axis.min + zoomOffset;

        zoomOffset += strength * axis.toValue(1);

        if (zoomOffset < 0) {
            zoomOffset = 0;
        }

        axis.setExtremes(center - zoomOffset, center + zoomOffset, false);
        axis.chart.redraw(false);
    }

    Highcharts.addEvent(Highcharts.Chart, 'load', function () {
        const chart = this,
            renderer = chart.renderer,
            yAxes = chart.yAxis.filter(axis => !axis.options.isInternal);

        yAxes.forEach(yAxis => {
            // Create a transparent rectangle on yAxis to create a zoom area
            yAxis.axisZoomRect = renderer.rect()
                .attr({
                    width: 50,
                    height: yAxis.height,
                    fill: 'transparent'
                })
                .css({ cursor: 'ns-resize' })
                .add();

            // Enabled zooming via mousewheel scroll
            yAxis.axisZoomRect.on('mousewheel', event => {
                centerZoom(yAxis, event.deltaY * 0.0001);
            });

            // Enable zooming by drag on mouse click
            yAxis.axisZoomRect.on('mousedown', () => {
                yAxis.drag = true;
            });

            // Zoom on yAxis while dragging the mouse
            document.addEventListener('mousemove', event => {
                if (yAxis.drag) {
                    centerZoom(yAxis, event.movementY * 0.001);
                }
            });

            // Disable zooming when mouse click is released
            document.addEventListener('mouseup', () => {
                yAxis.drag = false;
            });
        });
    });

    Highcharts.addEvent(Highcharts.Chart, 'render', function () {
        const chart = this,
            yAxes = chart.yAxis.filter(axis => !axis.options.isInternal);

        yAxes.forEach(yAxis => {
            yAxis.axisZoomRect.attr({ x: yAxis.width - 20, y: yAxis.top });
        });
    });
}

zoomOnYAxis();

Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-c.json', data => {
    Highcharts.stockChart('container', {
        chart: {
            zooming: {
                mouseWheel: {
                    enabled: false
                }
            }
        },
        yAxis: [{
            startOnTick: false,
            endOnTick: false,
            height: '50%',
            labels: {
                style: {
                    // Pass the drag event through labels
                    'pointer-events': 'none'
                }
            }
        }, {
            startOnTick: false,
            endOnTick: false,
            height: '50%',
            top: '50%',
            labels: {
                style: {
                    // Pass the drag event through labels
                    'pointer-events': 'none'
                }
            }
        }],
        series: [{
            data
        }, {
            data: data.slice(data.length / 5, data.length),
            yAxis: 1
        }]
    });
});