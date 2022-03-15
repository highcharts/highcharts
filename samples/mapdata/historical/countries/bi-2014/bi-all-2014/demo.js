(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/bi-2014/bi-all-2014.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['bi-br', 10], ['bi-bb', 11], ['bi-ci', 12], ['bi-gi', 13],
        ['bi-ky', 14], ['bi-ma', 15], ['bi-ng', 16], ['bi-ki', 17],
        ['bi-my', 18], ['bi-bm', 19], ['bi-mv', 20], ['bi-bu', 21],
        ['bi-mw', 22], ['bi-ca', 23], ['bi-kr', 24], ['bi-rt', 25],
        ['bi-ry', 26]
    ];

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Highcharts Maps basic demo'
        },

        subtitle: {
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/bi-2014/bi-all-2014.topo.json">Burundi (2014)</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series: [{
            data: data,
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });

})();
