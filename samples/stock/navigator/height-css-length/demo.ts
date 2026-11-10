(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>navigator.height</em>'
        },
        navigator: {
            height: '6rem'
        },
        series: [{
            data: data
        }]
    });

})();
