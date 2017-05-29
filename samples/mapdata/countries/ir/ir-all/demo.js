// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ir-5428', 0],
    ['ir-hg', 1],
    ['ir-bs', 2],
    ['ir-kb', 3],
    ['ir-fa', 4],
    ['ir-es', 5],
    ['ir-sm', 6],
    ['ir-go', 7],
    ['ir-mn', 8],
    ['ir-th', 9],
    ['ir-mk', 10],
    ['ir-ya', 11],
    ['ir-cm', 12],
    ['ir-kz', 13],
    ['ir-lo', 14],
    ['ir-il', 15],
    ['ir-ar', 16],
    ['ir-qm', 17],
    ['ir-hd', 18],
    ['ir-za', 19],
    ['ir-qz', 20],
    ['ir-wa', 21],
    ['ir-ea', 22],
    ['ir-bk', 23],
    ['ir-gi', 24],
    ['ir-kd', 25],
    ['ir-kj', 26],
    ['ir-kv', 27],
    ['ir-ks', 28],
    ['ir-sb', 29],
    ['ir-ke', 30],
    ['ir-al', 31]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ir/ir-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ir/ir-all.js">Iran</a>'
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
