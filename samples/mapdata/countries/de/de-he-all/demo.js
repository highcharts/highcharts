// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['de-he-06633000', 0],
    ['de-he-06635000', 1],
    ['de-he-06431000', 2],
    ['de-he-06535000', 3],
    ['de-he-06634000', 4],
    ['de-he-06611000', 5],
    ['de-he-06636000', 6],
    ['de-he-06532000', 7],
    ['de-he-06440000', 8],
    ['de-he-06531000', 9],
    ['de-he-06632000', 10],
    ['de-he-06435000', 11],
    ['de-he-06413000', 12],
    ['de-he-06432000', 13],
    ['de-he-06411000', 14],
    ['de-he-06438000', 15],
    ['de-he-06436000', 16],
    ['de-he-06439000', 17],
    ['de-he-06414000', 18],
    ['de-he-06437000', 19],
    ['de-he-06434000', 20],
    ['de-he-06631000', 21],
    ['de-he-06412000', 22],
    ['de-he-06533000', 23],
    ['de-he-06534000', 24],
    ['de-he-06433000', 25]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/de/de-he-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-he-all.js">Hessen</a>'
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
