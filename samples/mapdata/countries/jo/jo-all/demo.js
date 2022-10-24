(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/jo/jo-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['jo-ma', 10], ['jo-ir', 11], ['jo-aj', 12], ['jo-ja', 13],
        ['jo-ba', 14], ['jo-md', 15], ['jo-ka', 16], ['jo-az', 17],
        ['jo-aq', 18], ['jo-mn', 19], ['jo-am', 20], ['jo-at', 21]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/jo/jo-all.topo.json">Jordan</a>'
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
