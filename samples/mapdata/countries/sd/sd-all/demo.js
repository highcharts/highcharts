(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/sd/sd-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['sd-rs', 10], ['sd-711', 11], ['sd-7281', 12], ['sd-wd', 13],
        ['sd-kh', 14], ['sd-gz', 15], ['sd-gd', 16], ['sd-rn', 17],
        ['sd-no', 18], ['sd-kn', 19], ['sd-wn', 20], ['sd-si', 21],
        ['sd-nd', 22], ['sd-ks', 23], ['sd-sd', 24], ['sd-ka', 25],
        ['sd-bn', 26]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sd/sd-all.topo.json">Sudan</a>'
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
