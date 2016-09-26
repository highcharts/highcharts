$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {

        // Create the chart
        var chart = Highcharts.stockChart('container', {

            title: {
                text: 'Highstock Responsive Chart'
            },

            subtitle: {
                text: 'Click small/large buttons or change window size to test responsiveness'
            },

            rangeSelector: {
                selected: 1
            },

            series: [{
                name: 'AAPL Stock Price',
                data: data,
                type: 'area',
                threshold: null,
                tooltip: {
                    valueDecimals: 2
                }
            }],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        navigator: {
                            enabled: false
                        },
                        scrollbar: {
                            enabled: false
                        }
                    }
                }]
            }
        });


        $('#small').click(function () {
            chart.setSize(400);
        });

        $('#large').click(function () {
            chart.setSize(800);
        });
    });

});