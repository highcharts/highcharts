(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/sd/custom/sd-all-disputed.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['sd-wd', 10], ['sd-kh', 11], ['sd-gz', 12], ['sd-gd', 13],
        ['sd-rn', 14], ['sd-no', 15], ['sd-kn', 16], ['sd-wn', 17],
        ['sd-si', 18], ['sd-nd', 19], ['sd-ks', 20], ['sd-sd', 21],
        ['sd-ka', 22], ['sd-bn', 23], ['sd-rs', 24], ['sd-711', 25],
        ['sd-7281', 26]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sd/custom/sd-all-disputed.topo.json">Sudan with disputed territories</a>'
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
