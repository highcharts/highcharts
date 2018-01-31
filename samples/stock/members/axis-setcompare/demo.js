
var seriesOptions = [],
    seriesCounter = 0,
    names = ['MSFT', 'AAPL', 'GOOG'],
    chart;

/**
 * Create the chart
 */
function createChart() {

    chart = Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 4
        },

        yAxis: {
            labels: {
                formatter: function () {
                    var compare = this.axis.series[0].userOptions.compare || 'none';
                    return (compare !== 'none' && this.value > 0 ? ' + ' : '') + this.value +
                        { 'none': ' USD', 'value': ' USD', 'percent': ' %' }[compare];
                }
            }
        },

        plotOptions: {
            series: {
                compare: 'value'
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} USD</b> ({point.change})<br/>',
            changeDecimals: 2,
            valueDecimals: 2
        },

        series: seriesOptions
    });
}


$.each(names, function (i, name) {

    $.getJSON('https://www.highcharts.com/samples/data/' + name.toLowerCase() + '-c.json',    function (data) {

        seriesOptions[i] = {
            name: name,
            data: data
        };

        // As we're loading the data asynchronously, we don't know what order it will arrive. So
        // we keep a counter and create the chart when all the data is loaded.
        seriesCounter += 1;

        if (seriesCounter === names.length) {
            createChart();
        }
    });
});

// buttons behaviour
$('button.compare').click(function () {
    var compare = $(this).data().compare;
    chart.yAxis[0].setCompare(compare);

});

