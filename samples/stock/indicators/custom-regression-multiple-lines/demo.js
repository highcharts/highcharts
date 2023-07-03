(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    function getLinearRegressionZones(xData, yData) {
        var sumX = 0,
            sumY = 0,
            sumXY = 0,
            sumX2 = 0,
            linearData = [],
            linearXData = [],
            linearYData = [],
            n = xData.length,
            alpha, beta, i, x, y,
            zoneDistance = this.options.params.zoneDistance / 100,
            y1, y2, y3, y4;

        // Get sums:
        for (i = 0; i < n; i++) {
            x = xData[i];
            y = yData[i];
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumX2 += x * x;
        }

        // Get slope and offset:
        alpha = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        if (isNaN(alpha)) {
            alpha = 0;
        }
        beta = (sumY - alpha * sumX) / n;

        // Calculate linear regression:
        for (i = 0; i < n; i++) {
            x = xData[i];
            y = alpha * x + beta;

            y1 = y * (1 - 2 * zoneDistance);
            y2 = y * (1 - zoneDistance);
            y3 = y * (1 + zoneDistance);
            y4 = y * (1 + 2 * zoneDistance);

            // Prepare arrays required for getValues() method
            linearData[i] = [x, y1, y2, y, y3, y4];
            linearXData[i] = x;
            linearYData[i] = [y1, y2, y, y3, y4];
        }

        return {
            xData: linearXData,
            yData: linearYData,
            values: linearData
        };
    }

    Highcharts.seriesType(
        'linearregressionzones',
        'sma',
        {
            color: '#00ff00',
            params: {
                zoneDistance: 3
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:<br/>' +
                '110%: <b>{point.y4}</b><br/>' +
                '105%: <b>{point.y3}</b><br/>' +
                '100%: <b>{point.y}</b><br/>' +
                '95%: <b>{point.y2}</b><br/>' +
                '90%: <b>{point.y1}</b>'
            },
            closeRangeBottomLine: {
                styles: {
                    lineWidth: 1,
                    lineColor: '#ffa500'
                }
            },
            highRangeBottomLine: {
                styles: {
                    lineWidth: 1,
                    lineColor: '#ff0000'
                }
            },
            closeRangeTopLine: {
                styles: {
                    lineWidth: 1,
                    lineColor: '#ffa500'
                }
            },
            highRangeTopLine: {
                styles: {
                    lineWidth: 1,
                    lineColor: '#ff0000'
                }
            }
        },
        {
            getValues: function (series) {
                return this.getLinearRegressionZones(
                    series.xData,
                    series.yData
                );
            },
            getLinearRegressionZones: getLinearRegressionZones,

            linesApiNames: ['highRangeBottomLine', 'closeRangeBottomLine', 'closeRangeTopLine', 'highRangeTopLine'],
            nameBase: 'Linear regression zones',
            nameComponents: ['zoneDistance'],
            nameSuffixes: ['%'],
            parallelArrays: ['x', 'y', 'y1', 'y2', 'y3', 'y4'],
            pointArrayMap: ['y1', 'y2', 'y', 'y3', 'y4'],
            pointValKey: 'y'
        }
    );

    /* eslint-disable no-underscore-dangle */
    var multipleLinesMixin = Highcharts._modules['Mixins/MultipleLines.js'];

    if (multipleLinesMixin) {
        Highcharts.extend(
            Highcharts.Series.types.linearregressionzones.prototype,
            {
                drawGraph: multipleLinesMixin.drawGraph,
                getTranslatedLinesNames:
                multipleLinesMixin.getTranslatedLinesNames,
                translate: multipleLinesMixin.translate,
                toYData: multipleLinesMixin.toYData
            }
        );
    } else { // Highcharts v9.2.3+
        Highcharts._modules['Stock/Indicators/MultipleLinesComposition.js'].compose(
            Highcharts.Series.types.linearregressionzones
        );
    }

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 2
        },

        title: {
            text: 'AAPL Stock Price with Linear Regression zones'
        },

        legend: {
            enabled: true
        },

        plotOptions: {
            series: {
                showInLegend: true
            }
        },

        series: [{
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: data
        }, {
            type: 'linearregressionzones',
            linkedTo: 'aapl'
        }]

    });

})();