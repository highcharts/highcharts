(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/de/de-he-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['de-he-06633000', 10], ['de-he-06635000', 11], ['de-he-06431000', 12],
        ['de-he-06535000', 13], ['de-he-06634000', 14], ['de-he-06611000', 15],
        ['de-he-06636000', 16], ['de-he-06532000', 17], ['de-he-06440000', 18],
        ['de-he-06531000', 19], ['de-he-06632000', 20], ['de-he-06435000', 21],
        ['de-he-06413000', 22], ['de-he-06432000', 23], ['de-he-06411000', 24],
        ['de-he-06438000', 25], ['de-he-06436000', 26], ['de-he-06439000', 27],
        ['de-he-06414000', 28], ['de-he-06437000', 29], ['de-he-06434000', 30],
        ['de-he-06631000', 31], ['de-he-06412000', 32], ['de-he-06533000', 33],
        ['de-he-06534000', 34], ['de-he-06433000', 35]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-he-all.topo.json">Hessen</a>'
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
