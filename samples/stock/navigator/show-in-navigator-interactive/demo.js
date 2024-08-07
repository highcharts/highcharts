(async () => {
    const names = ['MSFT', 'AAPL', 'GOOG'];

    const promises = names.map(name => new Promise(resolve => {
        (async () => {
            const data = await fetch(
                'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/' +
                'samples/data/' + name.toLowerCase() + '-c.json'
            )
                .then(response => response.json());
            resolve({ name, data });
        })();
    }));

    const series = await Promise.all(promises);

    // Create the chart once all data is loaded
    const chart = Highcharts.stockChart('container', {
        series
    });

    // Toggle showing series in navigator
    const checkboxes = document.querySelectorAll('.show-in-navigator');
    checkboxes.forEach(check => {
        check.addEventListener('change', () => {
            chart.series[check.dataset.id].update({
                showInNavigator: check.checked
            });
        });
    });

    // Change navigator series type
    document.getElementById('select-series').addEventListener('change', e => {
        const seriesType = e.target.value;

        chart.update({
            navigator: {
                series: {
                    type: seriesType
                }
            }
        });
    });
})();