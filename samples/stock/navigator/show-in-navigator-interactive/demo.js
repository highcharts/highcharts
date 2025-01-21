(async () => {
    const names = ['MSFT', 'AAPL', 'GOOG'];

    const series = [];
    for (const name of names) {
        const response = await fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@f0e61a1/' +
            'samples/data/' + name.toLowerCase() + '-c.json'
        );
        const data = await response.json();
        series.push({ name, data });
    }

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
