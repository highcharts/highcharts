Highcharts.SVGRenderer.prototype.symbols.xsign = function (x, y, w, h) {
    return ['M', x, y, 'L', x + w, y + h, 'M', x + w, y, 'L', x, y + h, 'z'];
};

function markerAttribs(point) {
    const series = this,
        options = series.options,
        attribs = {},
        pos = point.pos();

    attribs.width = series.markerWidth;
    attribs.height = series.markerHeight;
    attribs.x = pos[0] - Math.round(attribs.width) / 2;
    attribs.y = pos[1] - Math.round(attribs.height) / 2;
    if (options.crisp) {
        // Math.floor for #1843:
        attribs.x = Math.floor(attribs.x);
    }
    return attribs;
}

function generatePnfData() {
    const series = this,
        data = series.options.data,
        boxSize = series.options.boxSize,
        finalData = series.finalData,
        reversal = boxSize * series.options.reversalAmount,
        symbolUp = series.options.symbolUp;

    let upTrend;

    function getLastPoint(pnfData) {
        const y = pnfData[pnfData.length - 1].y;
        return y[y.length - 1];
    }

    function pushPointGroup(x, y, up) {
        const symbol = up ? symbolUp : null;
        finalData.push({
            x,
            y,
            symbol
        });
    }

    function pushNewPoint(y, upTrend, lastPoint) {
        const currPointGroup = finalData[finalData.length - 1],
            flipFactor = upTrend ? 1 : -1,
            times = Math.floor(flipFactor * (y - lastPoint) / boxSize);

        for (let i = 1; i <= times; i++) {
            const newPoint = lastPoint + flipFactor * (boxSize * i);
            currPointGroup.y.push(newPoint);
        }

    }
    if (this.isDirtyData || (!this.isDirtyData && finalData.length === 0)) {

        this.finalData.length = 0;

        // Get first point and determine its symbol and trend
        for (let i = 0; i < data.length; i++) {
            const x = data[i][0],
                close = data[i][4],
                firstPoint = data[0][4];

            if (close - firstPoint >= boxSize) {
                pushPointGroup(x, [close], true);
                upTrend = true;
                break;
            }
            if (firstPoint - close >= boxSize) {
                pushPointGroup(x, [close], false);
                upTrend = false;
                break;
            }
        }


        data.forEach(point => {
            const x = point[0],
                close = point[4],
                lastPoint = getLastPoint(finalData);

            if (upTrend) {

                if (close - lastPoint >= boxSize) { // Add point going UP
                    pushNewPoint(close, upTrend, lastPoint);
                }

                if (lastPoint - close >= reversal) { // Handle reversal
                    upTrend = false;

                    pushPointGroup(x, [], false);
                    pushNewPoint(close, upTrend, lastPoint);
                }
            }

            if (!upTrend) {

                if (lastPoint - close >= boxSize) { // Add point going DOWN
                    pushNewPoint(close, upTrend, lastPoint);
                }

                if (close - lastPoint >= reversal) { // Handle reversal
                    upTrend = true;

                    pushPointGroup(x, [], true);
                    pushNewPoint(close, upTrend, lastPoint);
                }
            }
        });
    }

    // Process the finalData to groupData return format
    const groupedXData = [],
        groupedYData = [],
        groupMap = [];

    finalData.forEach(point => {
        const x = point.x;

        point.y.forEach(y => {
            groupedXData.push(x);
            groupedYData.push(y);
            groupMap.push({
                start: x,
                length: point.y.length,
                options: {
                    marker: point.symbol
                }
            });

        });
    });


    return {
        groupedXData,
        groupedYData,
        groupMap
    };
}

Highcharts.wrap(Highcharts.Axis.prototype, 'getClosest', function (proceed) {
    let ret = proceed.apply(this, Array.prototype.slice.call(arguments, 1));

    const pnfSeries = this.series.filter(series => series.is('pointandfigure'));

    pnfSeries.forEach(() => {
        if (this.categories) {
            ret = 1;
        } else {
            this.series.forEach(function (series) {
                const seriesClosest = series.closestPointRange,
                    visible = series.visible ||
                        !series.chart.options.chart.ignoreHiddenSeries;

                if (Highcharts.defined(seriesClosest) && visible) {
                    ret = Highcharts.defined(ret) ?
                        Math.min(ret, seriesClosest) :
                        seriesClosest;
                }
            });
        }
    });
    return ret;
});
// eslint-disable-next-line no-underscore-dangle
Highcharts.wrap(Highcharts._modules['Core/Series/Series.js'].prototype, 'groupData', function (proceed) {
    if (this.is('pointandfigure')) {
        return generatePnfData.apply(
            this, Array.prototype.slice.call(arguments, 1
            ));
    }
    return proceed.apply(this, Array.prototype.slice.call(arguments, 1));

});

Highcharts.seriesType(
    'pointandfigure',
    'scatter', {
    // Options
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                '<b> {series.name}</b><br/>' +
                'Close: {point.y}<br/>',
            headerFormat: ''
        },
        turboThreshold: 0,
        groupPadding: 0.2,
        pointPadding: 0.1,
        pointRange: null,
        dataGrouping: {
            groupAll: true,
            enabled: true,
            forced: true
        },
        symbolUp: {
            symbol: 'xsign',
            lineColor: 'green',
            lineWidth: 2
        },
        marker: {
            symbol: 'circle',
            fillColor: 'transparent',
            lineColor: 'red',
            lineWidth: 2
        }
    }, {
        // Series prototype
        takeOrdinalPosition: true,
        finalData: [],
        getColumnMetrics:
            Highcharts.seriesTypes.column.prototype.getColumnMetrics,
        markerAttribs,
        generatePnfData,
        translate() {
            const metrics = this.getColumnMetrics(),
                boxSize = this.options.boxSize;
            this.markerWidth =
                metrics.width + metrics.paddedWidth + metrics.offset;
            this.markerHeight =
                this.yAxis.toPixels(0) - this.yAxis.toPixels(boxSize);
            return Highcharts.Series.prototype.translate.call(this);
        }
    }, {
        // Point prototype
    }
);

Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-ohlc.json', function (data) {

    Highcharts.stockChart('container', {
        chart: {
            height: 800
        },
        title: {
            text: 'AAPL stock price - Point and Figure'
        },

        series: [{
            name: 'AAPL',
            type: 'pointandfigure',
            data,
            boxSize: 3,
            reversalAmount: 3
        }]
    });
});
