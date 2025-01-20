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

    const rawData = Object.values(AMDPriceConnector.table.getColumns());
    const data = [];

    for (let i = 0; i < rawData[0].length; i++) {
        data.push([
            rawData[0][i],
            rawData[1][i]
        ]);
    }

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
            yAxis: 1,
            type: 'macd',
            linkedTo: ':previous'
        }]
    });
})();