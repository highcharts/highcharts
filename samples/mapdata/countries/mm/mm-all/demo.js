// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['mm-tn', 0],
    ['mm-5760', 1],
    ['mm-mo', 2],
    ['mm-ra', 3],
    ['mm-ay', 4],
    ['mm-ch', 5],
    ['mm-mg', 6],
    ['mm-sh', 7],
    ['mm-kh', 8],
    ['mm-kn', 9],
    ['mm-kc', 10],
    ['mm-sa', 11],
    ['mm-ba', 12],
    ['mm-md', 13],
    ['mm-ya', 14]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/mm/mm-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mm/mm-all.js">Myanmar</a>'
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
