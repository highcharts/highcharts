(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>xAxis</em> options'
        },
        xAxis: {
            endOnTick: false,
            startOnTick: false
        },
        rangeSelector: {
            selected: 2
        },
        series: [{
            data: data
        }]
    });

})();
