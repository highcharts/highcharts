// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-wv-103', 0],
    ['us-wv-067', 1],
    ['us-wv-015', 2],
    ['us-wv-003', 3],
    ['us-wv-095', 4],
    ['us-wv-019', 5],
    ['us-wv-039', 6],
    ['us-wv-009', 7],
    ['us-wv-069', 8],
    ['us-wv-043', 9],
    ['us-wv-061', 10],
    ['us-wv-033', 11],
    ['us-wv-027', 12],
    ['us-wv-071', 13],
    ['us-wv-023', 14],
    ['us-wv-031', 15],
    ['us-wv-089', 16],
    ['us-wv-011', 17],
    ['us-wv-053', 18],
    ['us-wv-101', 19],
    ['us-wv-025', 20],
    ['us-wv-041', 21],
    ['us-wv-077', 22],
    ['us-wv-017', 23],
    ['us-wv-021', 24],
    ['us-wv-087', 25],
    ['us-wv-001', 26],
    ['us-wv-055', 27],
    ['us-wv-047', 28],
    ['us-wv-109', 29],
    ['us-wv-059', 30],
    ['us-wv-073', 31],
    ['us-wv-085', 32],
    ['us-wv-107', 33],
    ['us-wv-099', 34],
    ['us-wv-093', 35],
    ['us-wv-105', 36],
    ['us-wv-013', 37],
    ['us-wv-091', 38],
    ['us-wv-083', 39],
    ['us-wv-079', 40],
    ['us-wv-081', 41],
    ['us-wv-029', 42],
    ['us-wv-057', 43],
    ['us-wv-075', 44],
    ['us-wv-007', 45],
    ['us-wv-037', 46],
    ['us-wv-049', 47],
    ['us-wv-063', 48],
    ['us-wv-051', 49],
    ['us-wv-035', 50],
    ['us-wv-065', 51],
    ['us-wv-097', 52],
    ['us-wv-045', 53],
    ['us-wv-005', 54]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-wv-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-wv-all.js">West Virginia</a>'
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
