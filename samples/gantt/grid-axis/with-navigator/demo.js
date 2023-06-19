(async () => {
    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    // THE CHART
    Highcharts.stockChart('container', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Grid axis with navigator'
        },

        subtitle: {
            text: 'Using the time navigation features from Highcharts Stock'
        },

        xAxis: [{
            id: 'bottom-datetime-axis',
            grid: {
                enabled: true
            },
            opposite: true,
            type: 'datetime'
        }, {
            grid: {
                enabled: true
            },
            type: 'datetime',
            opposite: true,
            labels: {
                style: {
                    fontSize: '15px'
                }
            },
            linkedTo: 0
        }],
        series: [{
            name: 'Project 1',
            xAxis: 0,
            data: usdeur
        }]
    });
})();
