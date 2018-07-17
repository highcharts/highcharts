// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-ca-083', 0],
    ['us-ca-111', 1],
    ['us-ca-071', 2],
    ['us-ca-115', 3],
    ['us-ca-101', 4],
    ['us-ca-031', 5],
    ['us-ca-053', 6],
    ['us-ca-057', 7],
    ['us-ca-059', 8],
    ['us-ca-065', 9],
    ['us-ca-073', 10],
    ['us-ca-041', 11],
    ['us-ca-075', 12],
    ['us-ca-095', 13],
    ['us-ca-097', 14],
    ['us-ca-055', 15],
    ['us-ca-013', 16],
    ['us-ca-009', 17],
    ['us-ca-077', 18],
    ['us-ca-035', 19],
    ['us-ca-091', 20],
    ['us-ca-067', 21],
    ['us-ca-017', 22],
    ['us-ca-099', 23],
    ['us-ca-061', 24],
    ['us-ca-043', 25],
    ['us-ca-063', 26],
    ['us-ca-049', 27],
    ['us-ca-089', 28],
    ['us-ca-109', 29],
    ['us-ca-039', 30],
    ['us-ca-003', 31],
    ['us-ca-069', 32],
    ['us-ca-047', 33],
    ['us-ca-079', 34],
    ['us-ca-011', 35],
    ['us-ca-007', 36],
    ['us-ca-081', 37],
    ['us-ca-087', 38],
    ['us-ca-085', 39],
    ['us-ca-029', 40],
    ['us-ca-005', 41],
    ['us-ca-113', 42],
    ['us-ca-033', 43],
    ['us-ca-045', 44],
    ['us-ca-103', 45],
    ['us-ca-023', 46],
    ['us-ca-093', 47],
    ['us-ca-027', 48],
    ['us-ca-001', 49],
    ['us-ca-037', 50],
    ['us-ca-025', 51],
    ['us-ca-021', 52],
    ['us-ca-107', 53],
    ['us-ca-019', 54],
    ['us-ca-015', 55],
    ['us-ca-105', 56],
    ['us-ca-051', 57]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-ca-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ca-all.js">California</a>'
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
