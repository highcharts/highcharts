(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ss/ss-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ss-we', 10], ['ss-619', 11], ['ss-un', 12], ['ss-jg', 13],
        ['ss-wh', 14], ['ss-wr', 15], ['ss-wb', 16], ['ss-ee', 17],
        ['ss-nb', 18], ['ss-eb', 19]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ss/ss-all.topo.json">South Sudan</a>'
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
