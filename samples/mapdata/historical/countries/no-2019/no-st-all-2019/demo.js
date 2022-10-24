(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/no-st-all-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-st-1621', 10], ['no-st-1620', 11], ['no-st-1627', 12],
        ['no-st-1663', 13], ['no-st-1630', 14], ['no-st-1617', 15],
        ['no-st-1640', 16], ['no-st-1662', 17], ['no-st-1648', 18],
        ['no-st-1601', 19], ['no-st-1644', 20], ['no-st-1622', 21],
        ['no-st-1624', 22], ['no-st-1635', 23], ['no-st-1632', 24],
        ['no-st-1634', 25], ['no-st-1636', 26], ['no-st-1638', 27],
        ['no-st-1665', 28], ['no-st-1612', 29], ['no-st-1653', 30],
        ['no-st-1613', 31], ['no-st-1657', 32], ['no-st-1664', 33],
        ['no-st-1633', 34]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-st-all-2019.topo.json">Sør-Trøndelag (2019)</a>'
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
