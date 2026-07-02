(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/aapl-c.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        chart: {
            height: 800
        },
        title: {
            text: 'Point and Figure series'
        },
        rangeSelector: {
            selected: 5
        },
        series: [{
            boxSize: 3,
            data: data,
            marker: {},
            markerUp: {},
            reversalAmount: 2,
            type: 'pointandfigure'
        }]
    });

})();
