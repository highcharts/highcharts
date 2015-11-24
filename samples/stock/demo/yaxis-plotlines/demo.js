$(function () {
    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function (data) {

        var startDate = new Date(data[data.length - 1][0]), // Get year of last data point
            minRate = 1,
            maxRate = 0,
            startPeriod,
            date,
            rate,
            index;

        startDate.setMonth(startDate.getMonth() - 3); // a quarter of a year before last data point
        startPeriod = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

        for (index = data.length - 1; index >= 0; index = index - 1) {
            date = data[index][0]; // data[i][0] is date
            rate = data[index][1]; // data[i][1] is exchange rate
            if (date < startPeriod) {
                break; // stop measuring highs and lows
            }
            if (rate > maxRate) {
                maxRate = rate;
            }
            if (rate < minRate) {
                minRate = rate;
            }
        }

        // Create the chart
        $('#container').highcharts('StockChart', {

            rangeSelector: {
                selected: 1
            },

            title: {
                text: 'USD to EUR exchange rate'
            },

            yAxis: {
                title: {
                    text: 'Exchange rate'
                },
                plotLines: [{
                    value: minRate,
                    color: 'green',
                    dashStyle: 'shortdash',
                    width: 2,
                    label: {
                        text: 'Last quarter minimum'
                    }
                }, {
                    value: maxRate,
                    color: 'red',
                    dashStyle: 'shortdash',
                    width: 2,
                    label: {
                        text: 'Last quarter maximum'
                    }
                }]
            },

            series: [{
                name: 'USD to EUR',
                data: data,
                tooltip: {
                    valueDecimals: 4
                }
            }]
        });
    });
});