// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ve-3609', 0],
    ['ve-dp', 1],
    ['ve-ne', 2],
    ['ve-su', 3],
    ['ve-da', 4],
    ['ve-bo', 5],
    ['ve-ap', 6],
    ['ve-ba', 7],
    ['ve-me', 8],
    ['ve-ta', 9],
    ['ve-tr', 10],
    ['ve-zu', 11],
    ['ve-co', 12],
    ['ve-po', 13],
    ['ve-ca', 14],
    ['ve-la', 15],
    ['ve-ya', 16],
    ['ve-fa', 17],
    ['ve-am', 18],
    ['ve-an', 19],
    ['ve-ar', 20],
    ['ve-213', 21],
    ['ve-df', 22],
    ['ve-gu', 23],
    ['ve-mi', 24],
    ['ve-mo', 25]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ve/ve-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ve/ve-all.js">Venezuela</a>'
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
