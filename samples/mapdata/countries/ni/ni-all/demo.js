(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ni/ni-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ni-as', 10], ['ni-an', 11], ['ni-224', 12], ['ni-6330', 13],
        ['ni-ca', 14], ['ni-gr', 15], ['ni-ji', 16], ['ni-le', 17],
        ['ni-mn', 18], ['ni-ms', 19], ['ni-ci', 20], ['ni-es', 21],
        ['ni-md', 22], ['ni-mt', 23], ['ni-ns', 24], ['ni-bo', 25],
        ['ni-co', 26]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ni/ni-all.topo.json">Nicaragua</a>'
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
