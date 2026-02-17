(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of axis label boundary'
        },
        xAxis: {
            dateTimeLabelFormats: {
                month: {
                    boundary: '<b>%Y</b>',
                    main: '%[bY]'
                }
            }
        },
        rangeSelector: {
            selected: 4
        },
        series: [{
            data: data
        }]
    });

})();
