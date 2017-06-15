// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-of-101', 0],
    ['no-of-111', 1],
    ['no-of-104', 2],
    ['no-of-137', 3],
    ['no-of-136', 4],
    ['no-of-135', 5],
    ['no-of-138', 6],
    ['no-of-122', 7],
    ['no-of-123', 8],
    ['no-of-124', 9],
    ['no-of-125', 10],
    ['no-of-127', 11],
    ['no-of-128', 12],
    ['no-of-106', 13],
    ['no-of-121', 14],
    ['no-of-119', 15],
    ['no-of-105', 16],
    ['no-of-118', 17]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-of-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-of-all.js">Østfold</a>'
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
