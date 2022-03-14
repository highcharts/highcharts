(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/de/de-bb-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['de-bb-12065000', 10], ['de-bb-12052000', 11], ['de-bb-12062000', 12],
        ['de-bb-12053000', 13], ['de-bb-12072000', 14], ['de-bb-12063000', 15],
        ['de-bb-12060000', 16], ['de-bb-12066000', 17], ['de-bb-12068000', 18],
        ['de-bb-12054000', 19], ['de-bb-12061000', 20], ['de-bb-12051000', 21],
        ['de-bb-12067000', 22], ['de-bb-12071000', 23], ['de-bb-12070000', 24],
        ['de-bb-12069000', 25], ['de-bb-12073000', 26], ['de-bb-12064000', 27]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-bb-all.topo.json">Brandenburg</a>'
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
