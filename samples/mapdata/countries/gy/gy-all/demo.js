(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/gy/gy-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['gy-de', 10], ['gy-ma', 11], ['gy-pt', 12], ['gy-ut', 13],
        ['gy-ud', 14], ['gy-pm', 15], ['gy-ba', 16], ['gy-eb', 17],
        ['gy-es', 18], ['gy-cu', 19]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/gy/gy-all.topo.json">Guyana</a>'
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
