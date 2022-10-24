(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/pt/pt-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['pt-fa', 10], ['pt-li', 11], ['pt-av', 12], ['pt-vc', 13],
        ['pt-be', 14], ['pt-ev', 15], ['pt-se', 16], ['pt-pa', 17],
        ['pt-sa', 18], ['pt-br', 19], ['pt-le', 20], ['pt-ba', 21],
        ['pt-cb', 22], ['pt-gu', 23], ['pt-co', 24], ['pt-po', 25],
        ['pt-vi', 26], ['pt-vr', 27], ['pt-ma', 28], ['pt-ac', 29]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/pt/pt-all.topo.json">Portugal</a>'
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
