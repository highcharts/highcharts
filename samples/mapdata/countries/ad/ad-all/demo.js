// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ad-3689', 0],
    ['ad-6404', 1],
    ['ad-6405', 2],
    ['ad-6406', 3],
    ['ad-6407', 4],
    ['ad-6408', 5],
    ['ad-6409', 6]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ad/ad-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ad/ad-all.js">Andorra</a>'
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
