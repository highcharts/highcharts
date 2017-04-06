// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['mu-6684', 0],
    ['mu-6682', 1],
    ['mu-6679', 2],
    ['mu-6683', 3],
    ['mu-6691', 4],
    ['mu-6690', 5],
    ['mu-90', 6],
    ['mu-6689', 7],
    ['mu-6692', 8],
    ['mu-6680', 9],
    ['mu-6686', 10],
    ['mu-6685', 11],
    ['mu-6693', 12],
    ['mu-6681', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/mu/mu-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mu/mu-all.js">Mauritius</a>'
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
