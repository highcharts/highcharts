(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/mu/mu-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['mu-6684', 10], ['mu-6682', 11], ['mu-6679', 12], ['mu-6683', 13],
        ['mu-6691', 14], ['mu-6690', 15], ['mu-90', 16], ['mu-6689', 17],
        ['mu-6692', 18], ['mu-6680', 19], ['mu-6686', 20], ['mu-6685', 21],
        ['mu-6693', 22], ['mu-6681', 23]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mu/mu-all.topo.json">Mauritius</a>'
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
