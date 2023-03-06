(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/mn/mn-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['mn-da', 10], ['mn-ub', 11], ['mn-hg', 12], ['mn-uv', 13],
        ['mn-dg', 14], ['mn-og', 15], ['mn-hn', 16], ['mn-bh', 17],
        ['mn-ar', 18], ['mn-dz', 19], ['mn-ga', 20], ['mn-hd', 21],
        ['mn-bo', 22], ['mn-bu', 23], ['mn-er', 24], ['mn-sl', 25],
        ['mn-oh', 26], ['mn-du', 27], ['mn-to', 28], ['mn-gs', 29],
        ['mn-dd', 30], ['mn-sb', 31]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mn/mn-all.topo.json">Mongolia</a>'
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
