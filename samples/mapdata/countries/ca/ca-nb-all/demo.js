(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ca/ca-nb-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ca-nb-1315', 10], ['ca-nb-1302', 11], ['ca-nb-1314', 12],
        ['ca-nb-1308', 13], ['ca-nb-1304', 14], ['ca-nb-1306', 15],
        ['ca-nb-1305', 16], ['ca-nb-1312', 17], ['ca-nb-1311', 18],
        ['ca-nb-1310', 19], ['ca-nb-1313', 20], ['ca-nb-1307', 21],
        ['ca-nb-1303', 22], ['ca-nb-1309', 23], ['ca-nb-1301', 24]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-nb-all.topo.json">New Brunswick</a>'
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
