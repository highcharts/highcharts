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
            approximation: function (groupData) {
                return groupData[0];
            }
        }
    }, {
        name: 'ADBE end',
        data: ADBE,
        dataGrouping: {
            approximation: function (groupData) {
                return groupData[groupData.length - 1];
            }
        }
    }]
});
