(function (Highcharts) {
    // Configurable
    const MOUSE_SENSITIVITY = 0.002,
        SCROLL_SENSITIVITY = 0.0002;
    function centerZoom(axis, strength) {
        let zoomOffset = (axis.max - axis.min) / 2;
        const center = axis.min + zoomOffset;

        zoomOffset += strength * axis.toValue(1);

        if (zoomOffset < 0) {
            zoomOffset = 0;
        }

        axis.setExtremes(center - zoomOffset, center + zoomOffset, true, false);
        if (axis.chart.resetZoomButton) {
            axis.chart.resetZoomButton = axis.chart.resetZoomButton.destroy();
        }
        axis.chart.showResetZoom();
    }

    Highcharts.addEvent(Highcharts.Axis, 'afterInit', function () {
        const axis = this,
            renderer = axis.chart.renderer;

        if (
            !axis.isXAxis &&
            !axis.options.isInternal &&
            !axis.chart.inverted &&
            !axis.chart.polar
        ) {
            // Create a transparent rectangle on yAxis to create a zoom area
            axis.axisZoomRect = renderer.rect()
                .attr({
                    width: 50,
                    fill: 'red',
                    zIndex: 8
                })
                .addClass('highcharts-no-mousewheel')
                .css({ cursor: 'ns-resize' })
                .add();

            // Enabled zooming via mousewheel scroll
            axis.axisZoomRect.on('mousewheel', event => {
                event.preventDefault();
                centerZoom(axis, event.deltaY * SCROLL_SENSITIVITY);
            });

            // Enable zooming by drag on mouse click
            axis.axisZoomRect.on('mousedown', () => {
                axis.drag = true;
            });

            // Zoom on yAxis while dragging the mouse
            document.addEventListener('mousemove', event => {
                if (axis.drag) {
                    centerZoom(axis, event.movementY * MOUSE_SENSITIVITY);
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
                yAxis.axisZoomRect.attr({
                    x: yAxis.width - 20,
                    y: yAxis.top,
                    height: yAxis.len
                });
            }
        });
    });
}(Highcharts));

const commonOptions = {
    api: {
        url: 'https://demo-live-data.highcharts.com',
        access: {
            url: 'https://demo-live-data.highcharts.com/token/oauth',
            token: 'token'
        }
    }
};

const AMDPriceConnector =
    // eslint-disable-next-line no-undef
    new HighchartsConnectors.Morningstar.TimeSeriesConnector({
        ...commonOptions,
        series: {
            type: 'Price'
        },
        securities: [{
            id: 'US0079031078',
            idType: 'ISIN'
        }],
        startDate: '2021-01-01',
        endDate: '2022-12-31',
        currencyId: 'EUR'
    });

(async () => {
    await AMDPriceConnector.load();

    Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 4
        },
        yAxis: [{
            startOnTick: false,
            endOnTick: false,
            height: '48%',
            lineWidth: 2
        }, {
            startOnTick: false,
            endOnTick: false,
            height: '48%',
            top: '52%',
            lineWidth: 2
        }],
        series: [{
            name: 'AMD',
            data: AMDPriceConnector.table.getRows(),
            tooltip: {
                valueDecimals: 2,
                valueSuffix: ' EUR'
            }
        }, {
            yAxis: 1,
            type: 'macd',
            linkedTo: ':previous'
        }]
    });
})();