(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ao/ao-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ao-na', 10], ['ao-cb', 11], ['ao-ln', 12], ['ao-ls', 13],
        ['ao-ml', 14], ['ao-bo', 15], ['ao-cn', 16], ['ao-cs', 17],
        ['ao-lu', 18], ['ao-ui', 19], ['ao-za', 20], ['ao-bi', 21],
        ['ao-bg', 22], ['ao-cc', 23], ['ao-cu', 24], ['ao-hm', 25],
        ['ao-hl', 26], ['ao-mx', 27]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ao/ao-all.topo.json">Angola</a>'
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
