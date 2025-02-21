(async () => {

    // Notice that the dataset has missing data
    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@d2270f7c/samples/data/temp-range.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        chart: {
            type: 'columnrange'
        },

        colorAxis: {
            stops: [
                [0, '#1E90FF'],
                [0.5, '#FFFF99'],
                [1, '#FF3333']
            ]
        },

        rangeSelector: {
            selected: 2
        },

        title: {
            text: 'Temperature variation by day'
        },

        tooltip: {
            valueSuffix: '°C'
        },

        series: [{
            name: 'Temperatures',
            data: data
        }]

    });
})();
