// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-mt-005', 0],
    ['us-mt-041', 1],
    ['us-mt-105', 2],
    ['us-mt-019', 3],
    ['us-mt-051', 4],
    ['us-mt-071', 5],
    ['us-mt-027', 6],
    ['us-mt-037', 7],
    ['us-mt-065', 8],
    ['us-mt-101', 9],
    ['us-mt-015', 10],
    ['us-mt-013', 11],
    ['us-mt-097', 12],
    ['us-mt-059', 13],
    ['us-mt-039', 14],
    ['us-mt-023', 15],
    ['us-mt-001', 16],
    ['us-mt-057', 17],
    ['us-mt-053', 18],
    ['us-mt-029', 19],
    ['us-mt-063', 20],
    ['us-mt-095', 21],
    ['us-mt-089', 22],
    ['us-mt-077', 23],
    ['us-mt-043', 24],
    ['us-mt-031', 25],
    ['us-mt-075', 26],
    ['us-mt-003', 27],
    ['us-mt-033', 28],
    ['us-mt-017', 29],
    ['us-mt-067', 30],
    ['us-mt-009', 31],
    ['us-mt-111', 32],
    ['us-mt-087', 33],
    ['us-mt-081', 34],
    ['us-mt-085', 35],
    ['us-mt-107', 36],
    ['us-mt-109', 37],
    ['us-mt-079', 38],
    ['us-mt-099', 39],
    ['us-mt-073', 40],
    ['us-mt-021', 41],
    ['us-mt-083', 42],
    ['us-mt-055', 43],
    ['us-mt-061', 44],
    ['us-mt-035', 45],
    ['us-mt-047', 46],
    ['us-mt-049', 47],
    ['us-mt-093', 48],
    ['us-mt-091', 49],
    ['us-mt-007', 50],
    ['us-mt-011', 51],
    ['us-mt-025', 52],
    ['us-mt-103', 53],
    ['us-mt-069', 54],
    ['us-mt-045', 55]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-mt-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-mt-all.js">Montana</a>'
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
