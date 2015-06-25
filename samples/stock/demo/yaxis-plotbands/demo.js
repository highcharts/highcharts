$(function () {
    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function (data) {

        var startDate = new Date(data[data.length-1][0]); // Get year of last data point
        startDate.setMonth(startDate.getMonth()-3);  // a quarter of a year before last data point
        var minRate = 1;
        var maxRate = 0;
        var startPeriod = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        console.log(startDate.getFullYear() + " " + startDate.getMonth() + " " + startDate.getDate());
        for (var i = data.length-1; i >= 0; i--) {
            var date = data[i][0] // data[i][0] is date
            var rate = data[i][1] // data[i][1] is exchange rate
            if (date < startPeriod) break; // stop measuring highs and lows

            if (rate > maxRate) {
                maxRate = rate;
            }
            if (rate < minRate) {
                minRate = rate;
            }
        }

        // Create the chart
        $('#container').highcharts('StockChart', {

            rangeSelector : {
                selected : 1
            },

            title : {
                text : 'USD to EUR exchange rate'
            },

            yAxis : {
                title : {
                    text : 'Exchange rate'
                },
                plotBands : [{
                    from : minRate,
                    to : maxRate,
                    color : 'rgba(68, 170, 213, 0.2)',
                    label : {
                        text : 'Last quarter year\'s value range'
                    }
                }]
            },

            series : [{
                name : 'USD to EUR',
                data : data,
                tooltip: {
                    valueDecimals: 4
                }
            }]
        });
    });
});
