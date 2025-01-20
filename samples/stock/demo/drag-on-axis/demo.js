(function (Highcharts) {
    function centerZoom(axis, strength) {
        let zoomOffset = (axis.max - axis.min) / 2;
        const center = axis.min + zoomOffset;

        zoomOffset += strength * axis.toValue(1);

        if (zoomOffset < 0) {
            zoomOffset = 0;
        }

        axis.setExtremes(center - zoomOffset, center + zoomOffset, true, false);
    }

    Highcharts.addEvent(Highcharts.Axis, 'afterInit', function () {
        const axis = this,
            renderer = axis.chart.renderer;

        if (!axis.isXAxis && !axis.options.isInternal) {
            // Create a transparent rectangle on yAxis to create a zoom area
            axis.axisZoomRect = renderer.rect()
                .attr({
                    width: 50,
                    height: 300,
                    fill: 'transparent',
                    zIndex: 8
                })
                .addClass('highcharts-no-mousewheel')
                .css({ cursor: 'ns-resize' })
                .add();

            // Enabled zooming via mousewheel scroll
            axis.axisZoomRect.on('mousewheel', event => {
                centerZoom(axis, event.deltaY * 0.0001);
            });

            // Enable zooming by drag on mouse click
            axis.axisZoomRect.on('mousedown', () => {
                axis.drag = true;
            });

            // Zoom on yAxis while dragging the mouse
            document.addEventListener('mousemove', event => {
                if (axis.drag) {
                    centerZoom(axis, event.movementY * 0.001);
                }
            });

            // Disable zooming when mouse click is released
            document.addEventListener('mouseup', () => {
                axis.drag = false;
            });
        }
    });

    Highcharts.addEvent(Highcharts.Chart, 'render', function () {
        const chart = this,
            yAxes = chart.yAxis;

        yAxes.forEach(yAxis => {
            if (yAxis.axisZoomRect) {
                yAxis.axisZoomRect.attr({ x: yAxis.width - 20, y: yAxis.top });
            }
        });
    });
}(Highcharts));

Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-c.json', data => {
    Highcharts.stockChart('container', {
        yAxis: [{
            startOnTick: false,
            endOnTick: false,
            height: '50%'
        }, {
            startOnTick: false,
            endOnTick: false,
            height: '50%',
            top: '50%'
        }],
        series: [{
            data
        }, {
            data,
            yAxis: 1
        }]
    });
});