(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/pg/pg-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['pg-4773', 10], ['pg-es', 11], ['pg-md', 12], ['pg-ns', 13],
        ['pg-we', 14], ['pg-en', 15], ['pg-mn', 16], ['pg-mb', 17],
        ['pg-mr', 18], ['pg-ni', 19], ['pg-wn', 20], ['pg-eh', 21],
        ['pg-gu', 22], ['pg-eg', 23], ['pg-ch', 24], ['pg-1041', 25],
        ['pg-ce', 26], ['pg-no', 27], ['pg-sa', 28], ['pg-sh', 29],
        ['pg-wh', 30]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/pg/pg-all.topo.json">Papua New Guinea</a>'
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
