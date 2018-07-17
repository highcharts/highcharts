// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-nj-029', 0],
    ['us-nj-001', 1],
    ['us-nj-005', 2],
    ['us-nj-025', 3],
    ['us-nj-009', 4],
    ['us-nj-031', 5],
    ['us-nj-019', 6],
    ['us-nj-039', 7],
    ['us-nj-017', 8],
    ['us-nj-041', 9],
    ['us-nj-011', 10],
    ['us-nj-033', 11],
    ['us-nj-037', 12],
    ['us-nj-035', 13],
    ['us-nj-027', 14],
    ['us-nj-023', 15],
    ['us-nj-015', 16],
    ['us-nj-007', 17],
    ['us-nj-013', 18],
    ['us-nj-003', 19],
    ['us-nj-021', 20]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-nj-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-nj-all.js">New Jersey</a>'
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
