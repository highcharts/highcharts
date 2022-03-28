(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/kz/kz-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['kz-5085', 10], ['kz-qo', 11], ['kz-ac', 12], ['kz-as', 13],
        ['kz-qs', 14], ['kz-nk', 15], ['kz-pa', 16], ['kz-am', 17],
        ['kz-zm', 18], ['kz-ek', 19], ['kz-ar', 20], ['kz-mg', 21],
        ['kz-aa', 22], ['kz-at', 23], ['kz-wk', 24], ['kz-sk', 25],
        ['kz-qg', 26]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/kz/kz-all.topo.json">Kazakhstan</a>'
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
