(async () => {
    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());
    let cursor = 500;
    const chunk = 100;
    let data = usdeur.slice(0, cursor);

    const chart = Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            data: data
        }]
    });

    document.getElementById('button').addEventListener('click', () => {
        data = usdeur.slice(cursor, cursor + chunk);
        cursor += chunk;

        for (let i = 0; i < data.length; i++) {
            chart.series[0].addPoint(data[i], false);
        }

        chart.redraw();
    });
})();