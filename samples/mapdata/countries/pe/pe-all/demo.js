// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['pe-ic', 0],
    ['pe-cs', 1],
    ['pe-uc', 2],
    ['pe-md', 3],
    ['pe-sm', 4],
    ['pe-am', 5],
    ['pe-lo', 6],
    ['pe-ay', 7],
    ['pe-145', 8],
    ['pe-hv', 9],
    ['pe-ju', 10],
    ['pe-lr', 11],
    ['pe-lb', 12],
    ['pe-tu', 13],
    ['pe-ap', 14],
    ['pe-ar', 15],
    ['pe-cl', 16],
    ['pe-mq', 17],
    ['pe-ta', 18],
    ['pe-an', 19],
    ['pe-cj', 20],
    ['pe-hc', 21],
    ['pe-3341', 22],
    ['pe-ll', 23],
    ['pe-pa', 24],
    ['pe-pi', 25]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/pe/pe-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/pe/pe-all.js">Peru</a>'
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
