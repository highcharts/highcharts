// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-nd-087', 0],
    ['us-nd-079', 1],
    ['us-nd-013', 2],
    ['us-nd-075', 3],
    ['us-nd-099', 4],
    ['us-nd-035', 5],
    ['us-nd-019', 6],
    ['us-nd-063', 7],
    ['us-nd-067', 8],
    ['us-nd-015', 9],
    ['us-nd-091', 10],
    ['us-nd-005', 11],
    ['us-nd-095', 12],
    ['us-nd-069', 13],
    ['us-nd-057', 14],
    ['us-nd-025', 15],
    ['us-nd-103', 16],
    ['us-nd-093', 17],
    ['us-nd-027', 18],
    ['us-nd-033', 19],
    ['us-nd-053', 20],
    ['us-nd-007', 21],
    ['us-nd-039', 22],
    ['us-nd-105', 23],
    ['us-nd-003', 24],
    ['us-nd-045', 25],
    ['us-nd-051', 26],
    ['us-nd-059', 27],
    ['us-nd-089', 28],
    ['us-nd-021', 29],
    ['us-nd-073', 30],
    ['us-nd-049', 31],
    ['us-nd-083', 32],
    ['us-nd-043', 33],
    ['us-nd-037', 34],
    ['us-nd-001', 35],
    ['us-nd-023', 36],
    ['us-nd-055', 37],
    ['us-nd-101', 38],
    ['us-nd-081', 39],
    ['us-nd-009', 40],
    ['us-nd-029', 41],
    ['us-nd-017', 42],
    ['us-nd-047', 43],
    ['us-nd-097', 44],
    ['us-nd-065', 45],
    ['us-nd-071', 46],
    ['us-nd-077', 47],
    ['us-nd-011', 48],
    ['us-nd-031', 49],
    ['us-nd-041', 50],
    ['us-nd-085', 51],
    ['us-nd-061', 52]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-nd-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-nd-all.js">North Dakota</a>'
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
