// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['dz-ml', 0],
    ['dz-ob', 1],
    ['dz-sa', 2],
    ['dz-tb', 3],
    ['dz-il', 4],
    ['dz-at', 5],
    ['dz-or', 6],
    ['dz-sb', 7],
    ['dz-tl', 8],
    ['dz-tn', 9],
    ['dz-bc', 10],
    ['dz-na', 11],
    ['dz-ar', 12],
    ['dz-an', 13],
    ['dz-et', 14],
    ['dz-jj', 15],
    ['dz-sk', 16],
    ['dz-eb', 17],
    ['dz-tm', 18],
    ['dz-gr', 19],
    ['dz-lg', 20],
    ['dz-og', 21],
    ['dz-al', 22],
    ['dz-bm', 23],
    ['dz-to', 24],
    ['dz-tp', 25],
    ['dz-ad', 26],
    ['dz-ch', 27],
    ['dz-mc', 28],
    ['dz-mg', 29],
    ['dz-re', 30],
    ['dz-sd', 31],
    ['dz-tr', 32],
    ['dz-ts', 33],
    ['dz-bj', 34],
    ['dz-bb', 35],
    ['dz-bl', 36],
    ['dz-bu', 37],
    ['dz-1950', 38],
    ['dz-bs', 39],
    ['dz-dj', 40],
    ['dz-md', 41],
    ['dz-ms', 42],
    ['dz-sf', 43],
    ['dz-bt', 44],
    ['dz-co', 45],
    ['dz-gl', 46],
    ['dz-kh', 47]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/dz/dz-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/dz/dz-all.js">Algeria</a>'
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
