(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Demo of <em>xAxis.dateTimeLabelFormats</em> options'
        },
        xAxis: {
            dateTimeLabelFormats: {
                day: '%Y<br/>%m-%d',
                hour: '%Y-%m-%d<br/>%H:%M',
                minute: '%Y-%m-%d<br/>%H:%M',
                month: '%Y-%m',
                second: '%Y-%m-%d<br/>%H:%M:%S',
                week: '%Y<br/>%m-%d',
                year: '%Y'
            }
        },
        series: [{
            data: data
        }]
    } satisfies Highcharts.Options);

})();
