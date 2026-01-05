(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>xAxis.startOfWeek</em>'
        },
        xAxis: {
            dateTimeLabelFormats: {
                week: '%a,<br/>%e. %b'
            },
            startOfWeek: 0
        },
        rangeSelector: {
            selected: 1
        },
        series: [{
            data: data
        }]
    });

})();
