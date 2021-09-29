const report = document.getElementById('report');

Highcharts.stockChart('container', {
    chart: {
        zoomType: 'x',
        events: {
            selection(event) {
                if (event.xAxis) {
                    report.innerHTML = 'Last selection:<br/>min: ' + Highcharts.dateFormat('%Y-%m-%d', event.xAxis[0].min) +
                        ', max: ' + Highcharts.dateFormat('%Y-%m-%d', event.xAxis[0].max);
                } else {
                    report.innerHTML = 'Selection reset';
                }
            }
        }
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});