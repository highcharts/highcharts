(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ca/ca-ab-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ca-ab-4813', 10], ['ca-ab-4812', 11], ['ca-ab-4801', 12],
        ['ca-ab-4811', 13], ['ca-ab-4802', 14], ['ca-ab-4810', 15],
        ['ca-ab-4803', 16], ['ca-ab-4817', 17], ['ca-ab-4819', 18],
        ['ca-ab-4804', 19], ['ca-ab-4816', 20], ['ca-ab-4805', 21],
        ['ca-ab-4815', 22], ['ca-ab-4806', 23], ['ca-ab-4814', 24],
        ['ca-ab-4807', 25], ['ca-ab-4808', 26], ['ca-ab-4809', 27],
        ['ca-ab-4818', 28]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-ab-all.topo.json">Alberta</a>'
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
