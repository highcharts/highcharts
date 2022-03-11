(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/bj/bj-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['bj-do', 10], ['bj-bo', 11], ['bj-al', 12], ['bj-cl', 13],
        ['bj-aq', 14], ['bj-li', 15], ['bj-cf', 16], ['bj-ou', 17],
        ['bj-zo', 18], ['bj-pl', 19], ['bj-mo', 20], ['bj-ak', 21]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bj/bj-all.topo.json">Benin</a>'
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
