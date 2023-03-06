(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/au/au-all.topo.json'
    ).then(response => response.json());

    // Initialize the chart
    const chart = Highcharts.mapChart('container', {

        title: {
            text: 'Select point by id'
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
                value: 1,
                id: 'nt'
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
                value: 2
            }, {
                name: 'Victoria',
                value: 3
            }],
            name: 'Random data',
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                style: {
                    color: '#000000'
                }
            },
            states: {
                select: {
                    color: '#a4edba',
                    borderColor: '#000000'
                }
            }
        }]
    });

    document.getElementById('select').onclick = () => {
        chart.get('nt').select();
    };

})();