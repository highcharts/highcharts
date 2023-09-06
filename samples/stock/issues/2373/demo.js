(async () => {

    var seriesOptions = [],
        seriesCounter = 0,
        names = ['MSFT', 'AAPL', 'GOOG'];

    // create the chart when all data is loaded
    function createChart() {

        Highcharts.stockChart('container', {
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

    function success(url, data) {
        var name = url.match(/(msft|aapl|goog)/)[0].toUpperCase();
        var i = names.indexOf(name);
        seriesOptions[i] = {
            name: name,
            data: data
        };

        // As we're loading the data asynchronously, we don't know what order it
        // will arrive. So we keep a counter and create the chart when all the data is loaded.
        seriesCounter += 1;

        if (seriesCounter === names.length) {
            createChart();
        }
    }

    await fetch('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/msft-c.json')
        .then(response => response.json())
        .then(data => success('msft', data));

    await fetch('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/aapl-c.json')
        .then(response => response.json())
        .then(data => success('aapl', data));

    await fetch('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/goog-c.json')
        .then(response => response.json())
        .then(data => success('goog', data));

})();