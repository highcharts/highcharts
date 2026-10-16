(async () => {

    // Load the dataset
    const data = await fetch(
        'https://www.highcharts.com/samples/data/large-dataset.json'
    ).then(response => response.json());

    console.time('Chart render');

    // Create the chart
    Highcharts.stockChart('container', {
        chart: {
            zooming: {
                type: 'x'
            }
        },

        rangeSelector: {

            buttons: [{
                type: 'day',
                count: 3,
                text: '3d'
            }, {
                type: 'week',
                count: 1,
                text: '1w'
            }, {
                type: 'month',
                count: 1,
                text: '1m'
            }, {
                type: 'month',
                count: 6,
                text: '6m'
            }, {
                type: 'year',
                count: 1,
                text: '1y'
            }, {
                type: 'all',
                text: 'All'
            }],
            selected: 3
        },

        yAxis: {
            title: {
                text: 'Temperature (°C)'
            }
        },

        title: {
            text: 'Hourly temperatures in Vik i Sogn, Norway, 2009-2017',
            align: 'left'
        },

        series: [{
            name: 'Temperature',
            data: data.data,
            pointStart: data.pointStart,
            pointInterval: data.pointInterval,
            tooltip: {
                valueDecimals: 1,
                valueSuffix: '°C'
            }
        }]

    });

    console.timeEnd('Chart render');

})();
