(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/cv/cv-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['cv-br', 10], ['cv-ma', 11], ['cv-6566', 12], ['cv-6567', 13],
        ['cv-6570', 14], ['cv-sf', 15], ['cv-mo', 16], ['cv-cf', 17],
        ['cv-ta', 18], ['cv-ca', 19], ['cv-sm', 20], ['cv-cr', 21],
        ['cv-ss', 22], ['cv-so', 23], ['cv-sd', 24], ['cv-rs', 25],
        ['cv-pr', 26], ['cv-6568', 27], ['cv-6569', 28], ['cv-6571', 29],
        ['cv-6572', 30], ['cv-6573', 31]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cv/cv-all.topo.json">Cape Verde</a>'
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
