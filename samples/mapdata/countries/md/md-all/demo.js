(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/md/md-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['md-rz', 10], ['md-2266', 11], ['md-te', 12], ['md-2267', 13],
        ['md-cu', 14], ['md-bd', 15], ['md-sv', 16], ['md-sd', 17],
        ['md-so', 18], ['md-do', 19], ['md-ed', 20], ['md-br', 21],
        ['md-oc', 22], ['md-rs', 23], ['md-bt', 24], ['md-dr', 25],
        ['md-fa', 26], ['md-gl', 27], ['md-si', 28], ['md-ug', 29],
        ['md-ch', 30], ['md-ta', 31], ['md-ga', 32], ['md-st', 33],
        ['md-cv', 34], ['md-an', 35], ['md-ba', 36], ['md-cn', 37],
        ['md-ca', 38], ['md-cs', 39], ['md-cr', 40], ['md-1605', 41],
        ['md-fl', 42], ['md-du', 43], ['md-db', 44], ['md-hi', 45],
        ['md-ia', 46], ['md-le', 47], ['md-ni', 48], ['md-oh', 49]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/md/md-all.topo.json">Moldova</a>'
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
