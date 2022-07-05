(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/mm/mm-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['mm-tn', 10], ['mm-5760', 11], ['mm-mo', 12], ['mm-ra', 13],
        ['mm-ay', 14], ['mm-ch', 15], ['mm-mg', 16], ['mm-sh', 17],
        ['mm-kh', 18], ['mm-kn', 19], ['mm-kc', 20], ['mm-sa', 21],
        ['mm-ba', 22], ['mm-md', 23], ['mm-ya', 24]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mm/mm-all.topo.json">Myanmar</a>'
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
