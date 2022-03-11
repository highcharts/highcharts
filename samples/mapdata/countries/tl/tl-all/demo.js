(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/tl/tl-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['tl-dl', 10], ['tl-am', 11], ['tl-bb', 12], ['tl-cl', 13],
        ['tl-er', 14], ['tl-mt', 15], ['tl-mf', 16], ['tl-vq', 17],
        ['tl-bt', 18], ['tl-lq', 19], ['tl-al', 20], ['tl-an', 21],
        ['tl-bc', 22]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/tl/tl-all.topo.json">East Timor</a>'
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
