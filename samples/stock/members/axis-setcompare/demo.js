(async () => {

    const names = ['MSFT', 'AAPL', 'GOOG'];

    let chart;

    /**
     * Create the chart
     */
    function createChart(series) {

        chart = Highcharts.stockChart('container', {

            rangeSelector: {
                selected: 4
            },

            yAxis: {
                labels: {
                    formatter: function () {
                        var compare = this.axis.series[0].userOptions.compare || 'none';
                        return (compare !== 'none' && this.value > 0 ? ' + ' : '') + this.value +
                        { none: ' USD', value: ' USD', percent: ' %' }[compare];
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

            series
        });
    }

    const promises = names.map(name => new Promise(resolve => {
        (async () => {
            const data = await fetch(
                'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/' +
                '/samples/data/' + name.toLowerCase() + '-c.json'
            )
                .then(response => response.json());
            resolve({
                name,
                data
            });
        })();
    }));

    const series = await Promise.all(promises);
    createChart(series);

    // buttons behaviour
    document.querySelectorAll('button.compare').forEach(function (button) {
        button.addEventListener('click', function () {
            chart.yAxis[0].setCompare(
                this.getAttribute('data-compare')
            );
        });
    });

})();