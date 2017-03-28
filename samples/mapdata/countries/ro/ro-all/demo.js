// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ro-bi', 0],
    ['ro-cs', 1],
    ['ro-tm', 2],
    ['ro-bt', 3],
    ['ro-bn', 4],
    ['ro-cj', 5],
    ['ro-ab', 6],
    ['ro-hd', 7],
    ['ro-mm', 8],
    ['ro-ms', 9],
    ['ro-sj', 10],
    ['ro-sm', 11],
    ['ro-ag', 12],
    ['ro-sb', 13],
    ['ro-vl', 14],
    ['ro-bv', 15],
    ['ro-cv', 16],
    ['ro-hr', 17],
    ['ro-is', 18],
    ['ro-nt', 19],
    ['ro-ph', 20],
    ['ro-sv', 21],
    ['ro-bc', 22],
    ['ro-br', 23],
    ['ro-bz', 24],
    ['ro-gl', 25],
    ['ro-vs', 26],
    ['ro-vn', 27],
    ['ro-if', 28],
    ['ro-tl', 29],
    ['ro-dj', 30],
    ['ro-gj', 31],
    ['ro-mh', 32],
    ['ro-ot', 33],
    ['ro-tr', 34],
    ['ro-cl', 35],
    ['ro-db', 36],
    ['ro-gr', 37],
    ['ro-il', 38],
    ['ro-ct', 39],
    ['ro-ar', 40],
    ['ro-bh', 41]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ro/ro-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ro/ro-all.js">Romania</a>'
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
