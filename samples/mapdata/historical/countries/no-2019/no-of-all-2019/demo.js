(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/no-of-all-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-of-101', 10], ['no-of-111', 11], ['no-of-104', 12],
        ['no-of-137', 13], ['no-of-136', 14], ['no-of-135', 15],
        ['no-of-138', 16], ['no-of-122', 17], ['no-of-123', 18],
        ['no-of-124', 19], ['no-of-125', 20], ['no-of-127', 21],
        ['no-of-128', 22], ['no-of-106', 23], ['no-of-121', 24],
        ['no-of-119', 25], ['no-of-105', 26], ['no-of-118', 27]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-of-all-2019.topo.json">Østfold (2019)</a>'
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
