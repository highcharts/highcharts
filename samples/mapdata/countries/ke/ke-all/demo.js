// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ke-co', 0],
    ['ke-ny', 1],
    ['ke-ce', 2],
    ['ke-na', 3],
    ['ke-565', 4],
    ['ke-rv', 5],
    ['ke-we', 6],
    ['ke-ne', 7]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ke/ke-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ke/ke-all.js">Kenya</a>'
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
