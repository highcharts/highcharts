(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/nordic-countries-core.topo.json'
    ).then(response => response.json());

    const data = [{
        name: 'Denmark',
        value: 2
    }, {
        name: 'Finland',
        value: 5
    }, {
        name: 'Iceland',
        value: 4
    }, {
        name: 'Norway',
        value: 1
    }, {
        name: 'Sweden',
        value: 3
    }, {
        name: 'Faroe Islands',
        value: 6
    }];


    // Initialize the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Data joined by "name"'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {},

        series: [{
            data: data,
            mapData: topology,
            joinBy: 'name',
            name: 'Random data'
        }]
    });
})();