(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ca/ca-sk-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ca-sk-4711', 10], ['ca-sk-4708', 11], ['ca-sk-4706', 12],
        ['ca-sk-4707', 13], ['ca-sk-4705', 14], ['ca-sk-4714', 15],
        ['ca-sk-4704', 16], ['ca-sk-4715', 17], ['ca-sk-4703', 18],
        ['ca-sk-4702', 19], ['ca-sk-4716', 20], ['ca-sk-4701', 21],
        ['ca-sk-4717', 22], ['ca-sk-4710', 23], ['ca-sk-4712', 24],
        ['ca-sk-4713', 25], ['ca-sk-4718', 26], ['ca-sk-4709', 27]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-sk-all.topo.json">Saskatchewan</a>'
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
