// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-id-073', 0],
    ['us-id-057', 1],
    ['us-id-001', 2],
    ['us-id-083', 3],
    ['us-id-071', 4],
    ['us-id-031', 5],
    ['us-id-035', 6],
    ['us-id-077', 7],
    ['us-id-011', 8],
    ['us-id-029', 9],
    ['us-id-065', 10],
    ['us-id-051', 11],
    ['us-id-019', 12],
    ['us-id-033', 13],
    ['us-id-055', 14],
    ['us-id-009', 15],
    ['us-id-021', 16],
    ['us-id-085', 17],
    ['us-id-059', 18],
    ['us-id-027', 19],
    ['us-id-061', 20],
    ['us-id-043', 21],
    ['us-id-015', 22],
    ['us-id-087', 23],
    ['us-id-037', 24],
    ['us-id-003', 25],
    ['us-id-039', 26],
    ['us-id-025', 27],
    ['us-id-049', 28],
    ['us-id-045', 29],
    ['us-id-013', 30],
    ['us-id-069', 31],
    ['us-id-023', 32],
    ['us-id-005', 33],
    ['us-id-007', 34],
    ['us-id-063', 35],
    ['us-id-075', 36],
    ['us-id-067', 37],
    ['us-id-079', 38],
    ['us-id-053', 39],
    ['us-id-041', 40],
    ['us-id-081', 41],
    ['us-id-017', 42],
    ['us-id-047', 43]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-id-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-id-all.js">Idaho</a>'
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
