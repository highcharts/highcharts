(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/au/au-all.topo.json'
    ).then(response => response.json());

    // Initialize the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Individually disabled data labels'
        },

        colorAxis: {},

        legend: {
            align: 'left',
            floating: true,
            title: {
                text: 'Random data'
            }
        },

        series: [{
            mapData: topology,
            joinBy: 'name',
            data: [{
                name: 'Northern Territory',
                value: 1
            }, {
                name: 'Tasmania',
                value: 4
            }, {
                name: 'Queensland',
                value: 2
            }, {
                name: 'South Australia',
                value: 7
            }, {
                name: 'Western Australia',
                value: 3
            }, {
                name: 'New South Wales',
                value: 9
            }, {
                name: 'Australian Capital Territory',
                value: 2,
                dataLabels: {
                    enabled: false
                }
            }, {
                name: 'Victoria',
                value: 3,
                dataLabels: {
                    enabled: false
                }
            }, {
                name: 'Norfolk Island',
                value: 2,
                dataLabels: {
                    enabled: false
                }
            }, {
                name: 'Jervis Bay Territory',
                value: 2,
                dataLabels: {
                    enabled: false
                }
            }],
            name: 'Random data',
            dataLabels: {
                enabled: true,
                format: '{point.name}:<br>{point.value} items'
            }
        }]
    });
})();