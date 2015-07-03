$(function () {

    $('#container').highcharts('StockChart', {

        rangeSelector: {
            buttons: [{
                type: 'millisecond',
                count: 10,
                text: '10ms'
            }, {
                type: 'all',
                text: 'All'
            }],
            buttonTheme: {
                width: 50
            },
            inputDateFormat: '%H:%M:%S.%L',
            inputEditDateFormat: '%H:%M:%S.%L',
            // Custom parser to parse the %H:%M:%S.%L format
            inputDateParser: function (value) {
                value = value.split(/[:\.]/);
                return Date.UTC(
                    1970,
                    0,
                    1,
                    parseInt(value[0], 10),
                    parseInt(value[1], 10),
                    parseInt(value[2], 10),
                    parseInt(value[3], 10)
                );
            }

        },

        title: {
            text: 'Milliseconds in range selector inputs'
        },

        xAxis: {
            tickPixelInterval: 120
        },

        series: [{
            data: [1, 4, 2, 5, 3, 6, 4, 4, 6, 6, 5, 5, 5, 6, 6, 5, 5, 4, 3, 3, 3, 4, 5, 5, 6, 6],
            tooltip: {
                valueDecimals: 2
            }
        }]
    });

});