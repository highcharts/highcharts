(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/no-te-all-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-te-830', 10], ['no-te-827', 11], ['no-te-826', 12],
        ['no-te-814', 13], ['no-te-815', 14], ['no-te-817', 15],
        ['no-te-831', 16], ['no-te-807', 17], ['no-te-821', 18],
        ['no-te-805', 19], ['no-te-834', 20], ['no-te-811', 21],
        ['no-te-829', 22], ['no-te-828', 23], ['no-te-822', 24],
        ['no-te-819', 25], ['no-te-806', 26], ['no-te-833', 27]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-te-all-2019.topo.json">Telemark (2019)</a>'
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
