(async () => {

    // Notice that the dataset has missing data
    // Data taken from https://seklima.met.no/
    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@4c69e12/samples/data/temp-range.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        chart: {
            type: 'arearange'
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
