(async () => {

    var seriesOptions = [],
        seriesCounter = 0,
        names = ['MSFT', 'AAPL', 'GOOG'];

    /**
     * Create the chart when all data is loaded
     */
    function createChart() {

        Highcharts.stockChart('container', {
            title: {
                text: 'Series compare by <em>percent</em>'
            },
            subtitle: {
                text: 'Compare the values of the series against the first value in the visible range'
            },

            rangeSelector: {
                buttons: [{
                    type: 'ytd',
                    count: 1,
                    text: 'YTD'
                }, {
                    type: 'all',
                    text: 'All'
                }],
                selected: 0
            },

            yAxis: {
                labels: {
                    format: '{value} %'
                },
                plotLines: [{
                    value: 100,
                    width: 1,
                    color: '#333333',
                    zIndex: 3
                }]
            },

            plotOptions: {
                series: {
                    compare: 'percent',
                    compareStart: true
                }
            },

            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                changeDecimals: 2,
                valueDecimals: 2
            },

            series: seriesOptions
        });
    }

    function success(name, data) {
        name = name.match(/(msft|aapl|goog)/)[0].toUpperCase();
        const i = names.indexOf(name);
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

    const promises = ['msft', 'aapl', 'goog'].map(name => new Promise((resolve, reject) => {
        (async () => {
            const data = await fetch(
                'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/' + name + '-c.json'
            )
                .then(response => response.json());
            resolve({
                name,
                data
            });
        })();
    }));

    const series = await Promise.all(promises);
    series.forEach(obj => success(obj.name, obj.data));

})();