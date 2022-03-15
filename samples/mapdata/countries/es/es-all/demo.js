(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/es/es-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['es-pm', 10], ['es-va', 11], ['es-le', 12], ['es-me', 13],
        ['es-p', 14], ['es-s', 15], ['es-na', 16], ['es-ce', 17], ['es-cu', 18],
        ['es-vi', 19], ['es-ss', 20], ['es-gr', 21], ['es-mu', 22],
        ['es-bu', 23], ['es-sa', 24], ['es-za', 25], ['es-hu', 26],
        ['es-m', 27], ['es-gu', 28], ['es-sg', 29], ['es-se', 30], ['es-t', 31],
        ['es-te', 32], ['es-v', 33], ['es-bi', 34], ['es-or', 35], ['es-l', 36],
        ['es-z', 37], ['es-gi', 38], ['es-ab', 39], ['es-a', 40], ['es-av', 41],
        ['es-cc', 42], ['es-to', 43], ['es-ba', 44], ['es-co', 45],
        ['es-h', 46], ['es-c', 47], ['es-ma', 48], ['es-po', 49], ['es-lo', 50],
        ['es-so', 51], ['es-al', 52], ['es-b', 53], ['es-ca', 54], ['es-o', 55],
        ['es-cs', 56], ['es-cr', 57], ['es-j', 58], ['es-lu', 59],
        ['es-tf', 60], ['es-gc', 61]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/es/es-all.topo.json">Spain</a>'
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
