(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/hn/hn-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['hn-ib', 10], ['hn-va', 11], ['hn-at', 12], ['hn-gd', 13],
        ['hn-cl', 14], ['hn-ol', 15], ['hn-fm', 16], ['hn-yo', 17],
        ['hn-cm', 18], ['hn-cr', 19], ['hn-in', 20], ['hn-lp', 21],
        ['hn-sb', 22], ['hn-cp', 23], ['hn-le', 24], ['hn-oc', 25],
        ['hn-ch', 26], ['hn-ep', 27]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/hn/hn-all.topo.json">Honduras</a>'
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
