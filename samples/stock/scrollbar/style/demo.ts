(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>scrollbar</em> options'
        },
        rangeSelector: {
            selected: 4
        },
        scrollbar: {
            barBackgroundColor: '#cccccc',
            barBorderColor: '#cccccc',
            barBorderRadius: 5,
            barBorderWidth: 0,
            buttonArrowColor: '#333333',
            buttonBackgroundColor: '#e6e6e6',
            buttonBorderColor: '#cccccc',
            buttonBorderRadius: 0,
            buttonBorderWidth: 1,
            buttonsEnabled: false,
            height: 10,
            margin: 0,
            rifleColor: 'none',
            trackBackgroundColor: 'rgba(255, 255, 255, 0.001)',
            trackBorderColor: '#cccccc',
            trackBorderRadius: 5,
            trackBorderWidth: 1
        },
        series: [{
            data: data,
            name: 'USD to EUR'
        }]
    });

})();
