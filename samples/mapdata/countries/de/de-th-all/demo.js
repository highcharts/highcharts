(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/de/de-th-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['de-th-16062000', 10], ['de-th-16055000', 11], ['de-th-16064000', 12],
        ['de-th-16054000', 13], ['de-th-16070000', 14], ['de-th-16051000', 15],
        ['de-th-16071000', 16], ['de-th-16074000', 17], ['de-th-16052000', 18],
        ['de-th-16056000', 19], ['de-th-16075000', 20], ['de-th-16069000', 21],
        ['de-th-16068000', 22], ['de-th-16067000', 23], ['de-th-16053000', 24],
        ['de-th-16076000', 25], ['de-th-16065000', 26], ['de-th-16073000', 27],
        ['de-th-16061000', 28], ['de-th-16077000', 29], ['de-th-16063000', 30],
        ['de-th-16072000', 31], ['de-th-16066000', 32]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-th-all.topo.json">Thüringen</a>'
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
