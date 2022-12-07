(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ca/ca-bc-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ca-bc-5917', 10], ['ca-bc-5924', 11], ['ca-bc-5926', 12],
        ['ca-bc-5927', 13], ['ca-bc-5923', 14], ['ca-bc-5929', 15],
        ['ca-bc-5947', 16], ['ca-bc-5945', 17], ['ca-bc-5943', 18],
        ['ca-bc-5949', 19], ['ca-bc-5959', 20], ['ca-bc-5955', 21],
        ['ca-bc-5957', 22], ['ca-bc-5915', 23], ['ca-bc-5921', 24],
        ['ca-bc-5933', 25], ['ca-bc-5941', 26], ['ca-bc-5953', 27],
        ['ca-bc-5935', 28], ['ca-bc-5907', 29], ['ca-bc-5939', 30],
        ['ca-bc-5937', 31], ['ca-bc-5931', 32], ['ca-bc-5919', 33],
        ['ca-bc-5905', 34], ['ca-bc-5909', 35], ['ca-bc-5951', 36],
        ['ca-bc-5903', 37], ['ca-bc-5901', 38]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-bc-all.topo.json">British Columbia</a>'
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
