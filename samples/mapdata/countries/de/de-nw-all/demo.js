(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/de/de-nw-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['de-nw-05334000', 10], ['de-nw-05914000', 11], ['de-nw-05978000', 12],
        ['de-nw-05754000', 13], ['de-nw-05758000', 14], ['de-nw-05314000', 15],
        ['de-nw-05370000', 16], ['de-nw-05162000', 17], ['de-nw-05166000', 18],
        ['de-nw-05915000', 19], ['de-nw-05558000', 20], ['de-nw-05962000', 21],
        ['de-nw-05954000', 22], ['de-nw-05374000', 23], ['de-nw-05124000', 24],
        ['de-nw-05974000', 25], ['de-nw-05119000', 26], ['de-nw-05170000', 27],
        ['de-nw-05120000', 28], ['de-nw-05122000', 29], ['de-nw-05112000', 30],
        ['de-nw-05911000', 31], ['de-nw-05562000', 32], ['de-nw-05358000', 33],
        ['de-nw-05378000', 34], ['de-nw-05158000', 35], ['de-nw-05315000', 36],
        ['de-nw-05316000', 37], ['de-nw-05113000', 38], ['de-nw-05512000', 39],
        ['de-nw-05913000', 40], ['de-nw-05513000', 41], ['de-nw-05114000', 42],
        ['de-nw-05766000', 43], ['de-nw-05970000', 44], ['de-nw-05566000', 45],
        ['de-nw-05116000', 46], ['de-nw-05570000', 47], ['de-nw-05711000', 48],
        ['de-nw-05966000', 49], ['de-nw-05154000', 50], ['de-nw-05762000', 51],
        ['de-nw-05958000', 52], ['de-nw-05554000', 53], ['de-nw-05770000', 54],
        ['de-nw-05382000', 55], ['de-nw-05366000', 56], ['de-nw-05774000', 57],
        ['de-nw-05515000', 58], ['de-nw-05916000', 59], ['de-nw-05117000', 60],
        ['de-nw-05111000', 61], ['de-nw-05362000', 62]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-nw-all.topo.json">Nordrhein-Westfalen</a>'
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
