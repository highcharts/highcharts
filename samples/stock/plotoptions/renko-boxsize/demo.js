(async () => {
    const linearData = await fetch(
        'https://www.highcharts.com/samples/data/aapl-c.json'
    ).then(response => response.json());

    const chart = Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },
        series: [
            {
                boxSize: 4,
                type: 'renko',
                yAxis: 0,
                data: linearData
            }
        ]
    });

    const button = document.createElement('button');
    button.innerHTML = 'Toggle box size';
    button.onclick = () => {
        chart.series[0].update({
            boxSize: chart.series[0].boxSize === 4 ? 10 : 4
        });
    };
    document.body.appendChild(button);
})();
