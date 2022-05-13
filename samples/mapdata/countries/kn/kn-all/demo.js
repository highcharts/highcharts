(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/kn/kn-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['kn-tp', 10], ['kn-cc', 11], ['kn-as', 12], ['kn-gb', 13],
        ['kn-gg', 14], ['kn-jw', 15], ['kn-jc', 16], ['kn-jf', 17],
        ['kn-mc', 18], ['kn-pp', 19], ['kn-pl', 20], ['kn-pb', 21],
        ['kn-tl', 22], ['kn-tm', 23]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/kn/kn-all.topo.json">Saint Kitts and Nevis</a>'
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
