Highcharts.stockChart('container', {
    rangeSelector: {
        selected: 4
    },
    plotOptions: {
        series: {
            tooltip: {
                valueDecimals: 2
            },
            dataGrouping: {
                forced: true,
                units: [
                    ['week', [1]]
                ]
            }
        }
    },
    series: [{
        name: 'ADBE default (average)',
        data: ADBE
    }, {
        name: 'ADBE start',
        data: ADBE,
        dataGrouping: {
            approximation: function () {
                var groupStart = this.dataGroupInfo.start;

                return this.options.data[groupStart][1];
            }
        }
    }, {
        name: 'ADBE end',
        data: ADBE,
        dataGrouping: {
            approximation: function () {
                var groupEnd = this.dataGroupInfo.start +
                     this.dataGroupInfo.length - 1;

                return this.options.data[groupEnd][1];
            }
        }
    }]
});
