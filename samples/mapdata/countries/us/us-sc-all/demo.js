// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-sc-063', 0],
    ['us-sc-081', 1],
    ['us-sc-003', 2],
    ['us-sc-037', 3],
    ['us-sc-019', 4],
    ['us-sc-007', 5],
    ['us-sc-001', 6],
    ['us-sc-077', 7],
    ['us-sc-041', 8],
    ['us-sc-085', 9],
    ['us-sc-029', 10],
    ['us-sc-005', 11],
    ['us-sc-009', 12],
    ['us-sc-089', 13],
    ['us-sc-067', 14],
    ['us-sc-061', 15],
    ['us-sc-027', 16],
    ['us-sc-015', 17],
    ['us-sc-051', 18],
    ['us-sc-033', 19],
    ['us-sc-013', 20],
    ['us-sc-053', 21],
    ['us-sc-017', 22],
    ['us-sc-087', 23],
    ['us-sc-039', 24],
    ['us-sc-091', 25],
    ['us-sc-031', 26],
    ['us-sc-055', 27],
    ['us-sc-057', 28],
    ['us-sc-025', 29],
    ['us-sc-043', 30],
    ['us-sc-071', 31],
    ['us-sc-047', 32],
    ['us-sc-059', 33],
    ['us-sc-045', 34],
    ['us-sc-073', 35],
    ['us-sc-079', 36],
    ['us-sc-075', 37],
    ['us-sc-011', 38],
    ['us-sc-083', 39],
    ['us-sc-069', 40],
    ['us-sc-065', 41],
    ['us-sc-023', 42],
    ['us-sc-021', 43],
    ['us-sc-049', 44],
    ['us-sc-035', 45]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-sc-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-sc-all.js">South Carolina</a>'
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
