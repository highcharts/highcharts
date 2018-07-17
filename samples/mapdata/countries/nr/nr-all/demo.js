// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['nr-6494', 0],
    ['nr-6495', 1],
    ['nr-6496', 2],
    ['nr-6497', 3],
    ['nr-6498', 4],
    ['nr-6499', 5],
    ['nr-6487', 6],
    ['nr-3591', 7],
    ['nr-6488', 8],
    ['nr-6489', 9],
    ['nr-6490', 10],
    ['nr-6491', 11],
    ['nr-6492', 12],
    ['nr-6493', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/nr/nr-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nr/nr-all.js">Nauru</a>'
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
