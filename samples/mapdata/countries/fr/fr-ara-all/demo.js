(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/fr/fr-ara-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['fr-ara-ai', 10], ['fr-ara-hs', 11], ['fr-ara-sv', 12],
        ['fr-ara-dm', 13], ['fr-ara-ah', 14], ['fr-ara-is', 15],
        ['fr-ara-cl', 16], ['fr-ara-al', 17], ['fr-ara-lr', 18],
        ['fr-ara-pd', 19], ['fr-ara-hl', 20], ['fr-ara-rh', 21]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/fr-ara-all.topo.json">Auvergne-Rhône-Alpes</a>'
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
