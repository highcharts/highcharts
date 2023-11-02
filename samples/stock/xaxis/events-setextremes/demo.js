(async () => {
    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());
    Highcharts.stockChart('container', {
        xAxis: {
            events: {
                setExtremes(e) {
                    document.getElementById('report').innerHTML = '<b>Set extremes:</b> e.min: ' + Highcharts.dateFormat(null, e.min) +
                        ' | e.max: ' + Highcharts.dateFormat(null, e.max) + ' | e.trigger: ' + e.trigger;
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
})();