// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['sn-sl', 0],
    ['sn-th', 1],
    ['sn-680', 2],
    ['sn-zg', 3],
    ['sn-tc', 4],
    ['sn-kd', 5],
    ['sn-6976', 6],
    ['sn-6978', 7],
    ['sn-6975', 8],
    ['sn-dk', 9],
    ['sn-db', 10],
    ['sn-fk', 11],
    ['sn-1181', 12],
    ['sn-lg', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/sn/sn-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sn/sn-all.js">Senegal</a>'
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
