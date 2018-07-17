// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['vc-gt', 0],
    ['vc-ch', 1],
    ['vc-an', 2],
    ['vc-da', 3],
    ['vc-ge', 4],
    ['vc-pa', 5]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/vc/vc-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/vc/vc-all.js">Saint Vincent and the Grenadines</a>'
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
