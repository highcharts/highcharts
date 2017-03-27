// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ba-3177', 0],
    ['ba-6333', 1],
    ['ba-3178', 2],
    ['ba-6334', 3],
    ['ba-3179', 4],
    ['ba-6335', 5],
    ['ba-3180', 6],
    ['ba-6336', 7],
    ['ba-6337', 8],
    ['ba-6331', 9],
    ['ba-2216', 10],
    ['ba-2217', 11],
    ['ba-2218', 12],
    ['ba-2220', 13],
    ['ba-2219', 14],
    ['ba-3181', 15],
    ['ba-sr', 16],
    ['ba-6332', 17]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ba/ba-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ba/ba-all.js">Bosnia and Herzegovina</a>'
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
