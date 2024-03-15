(async () => {
    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    const navigator = Highcharts.navigator('navigator-container', {
        series: [{
            data: usdeur
        }]
    });

    const chart = Highcharts.chart('chart-container', {
        xAxis: {
            type: 'datetime'
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });

    navigator.bind(chart);

    document.getElementById('button').addEventListener('click', e => {
        const { min, max } = navigator.getRange();

        chart.renderer.label(
            'min: ' + Highcharts.dateFormat('%Y-%m-%d', min) + '<br/>' +
            'max: ' + Highcharts.dateFormat('%Y-%m-%d', max) + '<br/>',
            100,
            100
        )
            .attr({
                fill: '#FCFFC5',
                zIndex: 8
            })
            .add();
    });
})();