(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ca/ca-mb-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ca-mb-4620', 10], ['ca-mb-4621', 11], ['ca-mb-4622', 12],
        ['ca-mb-4623', 13], ['ca-mb-4608', 14], ['ca-mb-4609', 15],
        ['ca-mb-4606', 16], ['ca-mb-4619', 17], ['ca-mb-4607', 18],
        ['ca-mb-4604', 19], ['ca-mb-4618', 20], ['ca-mb-4605', 21],
        ['ca-mb-4602', 22], ['ca-mb-4603', 23], ['ca-mb-4610', 24],
        ['ca-mb-4601', 25], ['ca-mb-4611', 26], ['ca-mb-4613', 27],
        ['ca-mb-4612', 28], ['ca-mb-4615', 29], ['ca-mb-4614', 30],
        ['ca-mb-4617', 31], ['ca-mb-4616', 32]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-mb-all.topo.json">Manitoba</a>'
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
