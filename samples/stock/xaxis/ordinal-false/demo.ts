(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>xAxis.ordinal</em>'
        },
        xAxis: {
            ordinal: false
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: null,
                    fillColor: 'light-dark(#fff, #141414)',
                    lineColor: null,
                    lineWidth: 2,
                    radius: 3
                }
            }
        },
        rangeSelector: {
            selected: 0
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
