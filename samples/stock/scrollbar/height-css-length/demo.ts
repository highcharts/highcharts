(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>scrollbar.height</em>'
        },
        scrollbar: {
            height: '1.5rem'
        },
        series: [{
            data: data
        }]
    });

})();
