$(function () {
    var seriesOptions = [],
        yAxisOptions = [],
        seriesCounter = 0,
        names = ['MSFT', 'AAPL', 'GOOG'],
        colors = Highcharts.getOptions().colors;

    // create the chart when all data is loaded
    function createChart() {

        $('#container').highcharts('StockChart', {
            chart: {
                animation: false,
                events: {
                    load: function () {
                        this.series[0].hide();
                    }
                }
            },

            title: {
                text: '#2373 caused the two remaining series to be drawn between 2007 and 2008'
            },

            rangeSelector: {
                selected: 5,
                inputEnabled: false
            },

            yAxis: {
                labels: {
                    formatter: function () {
                        return (this.value > 0 ? ' + ' : '') + this.value + '%';
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },

            legend: {
                enabled: true
            },


            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                valueDecimals: 2
            },

            series: seriesOptions
        });
    }

    $.each(names, function (i, name) {

        $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=' + name.toLowerCase() + '-c.json&callback=?',   function (data) {

            seriesOptions[i] = {
                name: name,
                data: data
            };

            // As we're loading the data asynchronously, we don't know what order it will arrive. So
            // we keep a counter and create the chart when all the data is loaded.
            seriesCounter++;

            if (seriesCounter === names.length) {
                createChart();
            }
        });
    });

});