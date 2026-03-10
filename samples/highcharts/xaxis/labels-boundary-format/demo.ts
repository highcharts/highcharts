(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.chart('container', {
        title: {
            text: 'Demo of axis label boundary format'
        },
        xAxis: {
            labels: {
                format: `{#if (eq boundary "month")}{value: %b <b>%Y</b>}
        {else}{value: %e of %b}{/if}`
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
