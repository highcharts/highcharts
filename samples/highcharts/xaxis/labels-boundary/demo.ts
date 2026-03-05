(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.chart('container', {
        title: {
            text: 'Demo of axis label boundary'
        },
        xAxis: {
            dateTimeLabelFormats: {
                day: {
                    main: '%e of %b'
                },
                month: {
                    boundary: '<i><b>%B</b></i>'
                }
            },
            max: '2020-02-07',
            min: '2020-01-20',
            type: 'datetime'
        },
        series: [{
            data: data
        }]
    });

})();
