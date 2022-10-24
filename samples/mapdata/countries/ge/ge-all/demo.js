(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ge/ge-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ge-ab', 10], ['ge-aj', 11], ['ge-gu', 12], ['ge-sz', 13],
        ['ge-im', 14], ['ge-ka', 15], ['ge-mm', 16], ['ge-rk', 17],
        ['ge-tb', 18], ['ge-kk', 19], ['ge-sj', 20], ['ge-sd', 21]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ge/ge-all.topo.json">Georgia</a>'
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
