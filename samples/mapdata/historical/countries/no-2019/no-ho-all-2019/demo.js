(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/no-ho-all-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-ho-1251', 10], ['no-ho-1231', 11], ['no-ho-1233', 12],
        ['no-ho-1227', 13], ['no-ho-1241', 14], ['no-ho-1238', 15],
        ['no-ho-1252', 16], ['no-ho-1243', 17], ['no-ho-1245', 18],
        ['no-ho-1201', 19], ['no-ho-1246', 20], ['no-ho-1244', 21],
        ['no-ho-1242', 22], ['no-ho-1253', 23], ['no-ho-1222', 24],
        ['no-ho-1219', 25], ['no-ho-1224', 26], ['no-ho-1211', 27],
        ['no-ho-1223', 28], ['no-ho-1216', 29], ['no-ho-1234', 30],
        ['no-ho-1247', 31], ['no-ho-1232', 32], ['no-ho-1221', 33],
        ['no-ho-1263', 34], ['no-ho-1266', 35], ['no-ho-1228', 36],
        ['no-ho-1235', 37], ['no-ho-1259', 38], ['no-ho-1260', 39],
        ['no-ho-1265', 40], ['no-ho-1264', 41]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-ho-all-2019.topo.json">Hordaland (2019)</a>'
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
