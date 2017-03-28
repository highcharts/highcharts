// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['mn-da', 0],
    ['mn-ub', 1],
    ['mn-hg', 2],
    ['mn-uv', 3],
    ['mn-dg', 4],
    ['mn-og', 5],
    ['mn-hn', 6],
    ['mn-bh', 7],
    ['mn-ar', 8],
    ['mn-dz', 9],
    ['mn-ga', 10],
    ['mn-hd', 11],
    ['mn-bo', 12],
    ['mn-bu', 13],
    ['mn-er', 14],
    ['mn-sl', 15],
    ['mn-oh', 16],
    ['mn-du', 17],
    ['mn-to', 18],
    ['mn-gs', 19],
    ['mn-dd', 20],
    ['mn-sb', 21]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/mn/mn-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mn/mn-all.js">Mongolia</a>'
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
