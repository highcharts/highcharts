const data = Array.from({ length: 252 }, (_, i) => i + 1);

Highcharts.chart('container', {
    chart: {
        events: {
            load: function () {
                const chart = this,
                    updateSeries = document.getElementById('updateSeries');

                updateSeries.addEventListener('click', function () {
                    data.reverse();
                    chart.series[0].update({
                        data
                    });
                });
            }
        }
    },
    series: [{
        type: 'column',
        animationLimit: 200,
        data: data
    }]
});
